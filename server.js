const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const GENERATED_DIR = path.join(__dirname, 'public', 'generated');
[UPLOAD_DIR, GENERATED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer v2 storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Available template versions
const VERSIONS = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Timeless design with warm tones, ideal for traditional real estate markets.',
    thumbnail: '/thumbnails/classic.svg'
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean lines and bold typography for a contemporary, forward-thinking agent.',
    thumbnail: '/thumbnails/modern.svg'
  },
  {
    id: 'luxury',
    name: 'Luxury Estate',
    description: 'Premium dark theme with gold accents for high-end property specialists.',
    thumbnail: '/thumbnails/luxury.svg'
  }
];

// GET /api/versions - list all available page versions
app.get('/api/versions', (req, res) => {
  res.json({ success: true, versions: VERSIONS });
});

// POST /api/upload - upload agent photo or property images
// Accepts: agentPhoto (single), propertyImages (up to 6)
app.post('/api/upload', (req, res, next) => {
  const uploadFields = upload.fields([
    { name: 'agentPhoto', maxCount: 1 },
    { name: 'propertyImages', maxCount: 6 }
  ]);

  uploadFields(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB per image.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    const result = {};

    if (req.files && req.files.agentPhoto && req.files.agentPhoto.length > 0) {
      const f = req.files.agentPhoto[0];
      result.agentPhoto = `/uploads/${f.filename}`;
    }

    if (req.files && req.files.propertyImages && req.files.propertyImages.length > 0) {
      result.propertyImages = req.files.propertyImages.map(f => `/uploads/${f.filename}`);
    }

    if (Object.keys(result).length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    res.json({ success: true, files: result });
  });
});

// POST /api/generate - generate the agent profile page
app.post('/api/generate', express.json(), (req, res) => {
  const { version, agentData } = req.body;

  if (!version) {
    return res.status(400).json({ success: false, error: 'Version is required.' });
  }

  const selectedVersion = VERSIONS.find(v => v.id === version);
  if (!selectedVersion) {
    return res.status(400).json({ success: false, error: `Unknown version: ${version}` });
  }

  const data = {
    name: agentData?.name || 'Agent Name',
    title: agentData?.title || 'Real Estate Professional',
    phone: agentData?.phone || '',
    email: agentData?.email || '',
    bio: agentData?.bio || '',
    agentPhoto: agentData?.agentPhoto || '',
    propertyImages: agentData?.propertyImages || [],
    specialties: agentData?.specialties || [],
    licenseNumber: agentData?.licenseNumber || '',
    website: agentData?.website || '',
    version,
  };

  const templatePath = path.join(__dirname, 'templates', `${version}.js`);
  if (!fs.existsSync(templatePath)) {
    return res.status(500).json({ success: false, error: `Template not found for version: ${version}` });
  }

  const templateFn = require(templatePath);
  const html = templateFn(data);

  const filename = `agent-${uuidv4()}.html`;
  const outputPath = path.join(GENERATED_DIR, filename);
  fs.writeFileSync(outputPath, html, 'utf8');

  res.json({ success: true, url: `/generated/${filename}`, version: selectedVersion });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Agent Page Generator running on http://localhost:${PORT}`);
});
