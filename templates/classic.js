'use strict';

module.exports = function classicTemplate(data) {
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
  <title>${escape(name)} – Real Estate Professional</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; background: #f9f5ef; color: #2c2c2c; }
    a { color: inherit; }

    /* HERO */
    .hero {
      background: linear-gradient(135deg, #8b6f47 0%, #5a3e28 100%);
      color: #fff;
      padding: 60px 20px;
      text-align: center;
    }
    .hero-photo {
      width: 160px; height: 160px;
      border-radius: 50%;
      object-fit: cover;
      border: 5px solid rgba(255,255,255,0.8);
      margin: 0 auto 24px;
      display: block;
      background: rgba(255,255,255,0.15);
    }
    .hero-photo-placeholder {
      width: 160px; height: 160px;
      border-radius: 50%;
      border: 5px solid rgba(255,255,255,0.4);
      margin: 0 auto 24px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.1);
      font-size: 64px; color: rgba(255,255,255,0.6);
    }
    .hero h1 { font-size: 2.4rem; margin-bottom: 8px; }
    .hero .title { font-size: 1.1rem; opacity: .85; letter-spacing: .05em; }

    /* CONTACT BAR */
    .contact-bar {
      background: #5a3e28;
      color: #f9f5ef;
      display: flex; flex-wrap: wrap; justify-content: center; gap: 24px;
      padding: 16px 20px;
      font-size: .95rem;
    }
    .contact-bar a { color: #f9c97a; text-decoration: none; }
    .contact-bar a:hover { text-decoration: underline; }

    /* CONTAINER */
    .container { max-width: 960px; margin: 48px auto; padding: 0 20px; }

    /* SECTIONS */
    section { margin-bottom: 48px; }
    section h2 {
      font-size: 1.5rem;
      color: #5a3e28;
      border-bottom: 2px solid #c9a96e;
      padding-bottom: 8px; margin-bottom: 20px;
    }

    /* BIO */
    .bio { font-size: 1.05rem; line-height: 1.8; color: #444; }

    /* SPECIALTIES */
    .specialties { display: flex; flex-wrap: wrap; gap: 10px; }
    .specialty-tag {
      background: #c9a96e; color: #fff;
      padding: 6px 14px; border-radius: 20px;
      font-size: .9rem; font-family: Arial, sans-serif;
    }

    /* LISTINGS */
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .property-card {
      border-radius: 8px; overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,.1);
      background: #fff;
    }
    .property-card img { width: 100%; height: 200px; object-fit: cover; display: block; }
    .no-listings { color: #888; font-style: italic; }

    /* LICENSE */
    .license { font-size: .85rem; color: #888; margin-top: 4px; }

    /* FOOTER */
    footer {
      text-align: center;
      padding: 32px 20px;
      background: #2c2c2c; color: #aaa;
      font-size: .85rem; font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <header class="hero">
    ${agentPhoto
      ? `<img class="hero-photo" src="${escapeAttr(agentPhoto)}" alt="${escapeAttr(name)} photo">`
      : `<div class="hero-photo-placeholder">&#128100;</div>`}
    <h1>${escape(name)}</h1>
    <p class="title">${escape(title)}</p>
  </header>

  <div class="contact-bar">
    ${phone ? `<span>&#128222; <a href="tel:${escapeAttr(phone)}">${escape(phone)}</a></span>` : ''}
    ${email ? `<span>&#9993; <a href="mailto:${escapeAttr(email)}">${escape(email)}</a></span>` : ''}
    ${website ? `<span>&#127760; <a href="${escapeAttr(website)}" target="_blank">${escape(website)}</a></span>` : ''}
  </div>

  <div class="container">
    ${bio ? `
    <section>
      <h2>About Me</h2>
      <p class="bio">${escape(bio).replace(/\n/g, '<br>')}</p>
    </section>` : ''}

    ${specialties.length > 0 ? `
    <section>
      <h2>Specialties</h2>
      <div class="specialties">${specialtiesHtml}</div>
    </section>` : ''}

    <section>
      <h2>Featured Listings</h2>
      <div class="listings-grid">${propertiesHtml}</div>
    </section>

    ${licenseNumber ? `<p class="license">License #${escape(licenseNumber)}</p>` : ''}
  </div>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${escape(name)}. All rights reserved.</p>
    <p style="margin-top:6px">Powered by MustWants Agent Page Generator</p>
  </footer>
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
