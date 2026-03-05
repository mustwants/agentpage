'use strict';

module.exports = function modernTemplate(data) {
  const {
    name, title, phone, email, bio,
    agentPhoto, propertyImages, specialties,
    licenseNumber, website
  } = data;

  const propertiesHtml = propertyImages.length > 0
    ? propertyImages.map(src => `
      <div class="property-card">
        <img src="${escapeAttr(src)}" alt="Property" loading="lazy">
      </div>`).join('')
    : '<p class="no-listings">No listings added yet.</p>';

  const specialtiesHtml = specialties.length > 0
    ? specialties.map(s => `<span class="specialty-tag">${escape(s)}</span>`).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(name)} – Real Estate</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #ffffff; color: #111; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }

    /* NAV */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: #fff;
      border-bottom: 1px solid #eee;
      padding: 16px 40px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .nav-brand { font-size: 1.1rem; font-weight: 700; letter-spacing: -.01em; }
    .nav-links { display: flex; gap: 24px; font-size: .9rem; color: #555; }
    .nav-links a:hover { color: #000; }

    /* HERO */
    .hero {
      display: grid; grid-template-columns: 1fr 1fr;
      min-height: 90vh;
    }
    .hero-text {
      display: flex; flex-direction: column; justify-content: center;
      padding: 80px 60px;
    }
    .hero-text .label {
      font-size: .8rem; font-weight: 600; letter-spacing: .15em;
      text-transform: uppercase; color: #0066cc; margin-bottom: 16px;
    }
    .hero-text h1 {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 800; letter-spacing: -.03em; line-height: 1.1;
      margin-bottom: 20px;
    }
    .hero-text .subtitle { font-size: 1.1rem; color: #555; margin-bottom: 36px; }
    .cta-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn-primary {
      background: #111; color: #fff;
      padding: 14px 28px; border-radius: 4px;
      font-size: .95rem; font-weight: 600;
    }
    .btn-secondary {
      border: 2px solid #111; color: #111;
      padding: 12px 28px; border-radius: 4px;
      font-size: .95rem; font-weight: 600;
    }
    .hero-image {
      background: #f2f2f2;
      overflow: hidden;
    }
    .hero-image img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .hero-image-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #e8f0ff 0%, #d0e4ff 100%);
      font-size: 120px; color: #aac0e8;
    }

    /* CONTENT */
    .container { max-width: 1100px; margin: 0 auto; padding: 80px 40px; }

    /* SECTION */
    section { margin-bottom: 72px; }
    section h2 {
      font-size: 1.8rem; font-weight: 800;
      letter-spacing: -.02em; margin-bottom: 24px;
    }
    .section-line {
      height: 3px; width: 40px; background: #0066cc; margin-bottom: 32px;
    }

    /* BIO */
    .bio { font-size: 1.05rem; color: #444; max-width: 680px; }

    /* SPECIALTIES */
    .specialties { display: flex; flex-wrap: wrap; gap: 10px; }
    .specialty-tag {
      border: 1.5px solid #111; color: #111;
      padding: 6px 16px; border-radius: 100px;
      font-size: .85rem; font-weight: 600;
    }

    /* LISTINGS */
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .property-card { overflow: hidden; }
    .property-card img {
      width: 100%; height: 220px; object-fit: cover;
      display: block; transition: transform .3s ease;
    }
    .property-card:hover img { transform: scale(1.03); }
    .no-listings { color: #aaa; }

    /* CONTACT */
    .contact-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .contact-item {
      padding: 24px;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    .contact-item .c-label { font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #0066cc; margin-bottom: 8px; }
    .contact-item .c-value { font-size: .95rem; color: #222; word-break: break-word; }
    .contact-item a { color: #222; }
    .contact-item a:hover { color: #0066cc; }

    /* LICENSE */
    .license-bar {
      border-top: 1px solid #eee;
      padding: 20px 40px;
      text-align: center;
      font-size: .8rem; color: #aaa;
    }

    @media (max-width: 768px) {
      .hero { grid-template-columns: 1fr; min-height: auto; }
      .hero-image { height: 300px; }
      .hero-text { padding: 60px 24px; }
      nav { padding: 16px 24px; }
      .container { padding: 60px 24px; }
    }
  </style>
</head>
<body>
  <nav>
    <span class="nav-brand">${escape(name)}</span>
    <div class="nav-links">
      ${phone ? `<a href="tel:${escapeAttr(phone)}">Call</a>` : ''}
      ${email ? `<a href="mailto:${escapeAttr(email)}">Email</a>` : ''}
      ${website ? `<a href="${escapeAttr(website)}" target="_blank">Website</a>` : ''}
    </div>
  </nav>

  <div class="hero">
    <div class="hero-text">
      <span class="label">Real Estate Professional</span>
      <h1>${escape(name)}</h1>
      <p class="subtitle">${escape(title)}</p>
      <div class="cta-buttons">
        ${phone ? `<a class="btn-primary" href="tel:${escapeAttr(phone)}">Call Now</a>` : ''}
        ${email ? `<a class="btn-secondary" href="mailto:${escapeAttr(email)}">Send Email</a>` : ''}
      </div>
    </div>
    <div class="hero-image">
      ${agentPhoto
        ? `<img src="${escapeAttr(agentPhoto)}" alt="${escapeAttr(name)} photo">`
        : `<div class="hero-image-placeholder">&#128100;</div>`}
    </div>
  </div>

  <div class="container">
    ${bio ? `
    <section>
      <h2>About</h2>
      <div class="section-line"></div>
      <p class="bio">${escape(bio).replace(/\n/g, '<br>')}</p>
    </section>` : ''}

    ${specialties.length > 0 ? `
    <section>
      <h2>Specialties</h2>
      <div class="section-line"></div>
      <div class="specialties">${specialtiesHtml}</div>
    </section>` : ''}

    <section>
      <h2>Featured Listings</h2>
      <div class="section-line"></div>
      <div class="listings-grid">${propertiesHtml}</div>
    </section>

    ${(phone || email || website) ? `
    <section>
      <h2>Contact</h2>
      <div class="section-line"></div>
      <div class="contact-grid">
        ${phone ? `<div class="contact-item"><div class="c-label">Phone</div><div class="c-value"><a href="tel:${escapeAttr(phone)}">${escape(phone)}</a></div></div>` : ''}
        ${email ? `<div class="contact-item"><div class="c-label">Email</div><div class="c-value"><a href="mailto:${escapeAttr(email)}">${escape(email)}</a></div></div>` : ''}
        ${website ? `<div class="contact-item"><div class="c-label">Website</div><div class="c-value"><a href="${escapeAttr(website)}" target="_blank">${escape(website)}</a></div></div>` : ''}
      </div>
    </section>` : ''}
  </div>

  ${licenseNumber ? `<div class="license-bar">License #${escape(licenseNumber)}</div>` : ''}
</body>
</html>`;
};

function escape(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
