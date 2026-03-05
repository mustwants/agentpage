'use strict';

module.exports = function luxuryTemplate(data) {
  const {
    name, title, phone, email, bio,
    agentPhoto, propertyImages, specialties,
    licenseNumber, website
  } = data;

  const propertiesHtml = propertyImages.length > 0
    ? propertyImages.map(src => `
      <div class="property-card">
        <img src="${escapeAttr(src)}" alt="Property" loading="lazy">
        <div class="property-overlay"></div>
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
  <title>${escape(name)} – Luxury Real Estate</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --gold: #c9a96e;
      --gold-light: #e8d5a3;
      --dark: #0d0d0d;
      --dark2: #1a1a1a;
      --dark3: #252525;
      --text: #e0d9cc;
      --muted: #7a7060;
    }
    body { font-family: 'Lato', sans-serif; background: var(--dark); color: var(--text); }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
    a { color: var(--gold); text-decoration: none; }
    a:hover { color: var(--gold-light); }

    /* HEADER */
    header {
      position: relative;
      min-height: 100vh;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .header-bg {
      position: absolute; inset: 0;
      background: linear-gradient(160deg, #1a0e05 0%, #0d0d0d 60%, #100a18 100%);
    }
    .header-accent {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 70% 50%, rgba(201,169,110,.12) 0%, transparent 65%);
    }
    .header-border {
      position: absolute; inset: 24px;
      border: 1px solid rgba(201,169,110,.25);
      pointer-events: none;
    }

    nav {
      position: relative; z-index: 10;
      display: flex; align-items: center; justify-content: space-between;
      padding: 32px 60px;
    }
    .nav-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem; color: var(--gold);
      letter-spacing: .08em;
    }
    .nav-links { display: flex; gap: 32px; font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
    .nav-links a { color: var(--muted); transition: color .2s; }
    .nav-links a:hover { color: var(--gold); }

    .header-content {
      position: relative; z-index: 10;
      flex: 1; display: flex; align-items: center;
      padding: 60px;
      gap: 80px;
    }
    .header-photo {
      flex-shrink: 0;
      width: 280px; height: 340px;
      border: 2px solid rgba(201,169,110,.4);
      overflow: hidden;
    }
    .header-photo img { width: 100%; height: 100%; object-fit: cover; }
    .header-photo-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: var(--dark3); font-size: 80px; color: var(--muted);
    }
    .header-info { flex: 1; }
    .header-info .eyebrow {
      font-size: .75rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 20px;
    }
    .header-info h1 {
      font-size: clamp(2.2rem, 5vw, 4rem);
      color: #fff; line-height: 1.1; margin-bottom: 16px;
    }
    .header-info .tagline {
      font-weight: 300; font-size: 1rem; color: var(--muted);
      margin-bottom: 40px; letter-spacing: .05em;
    }
    .gold-divider { width: 60px; height: 2px; background: var(--gold); margin-bottom: 32px; }
    .contact-pills { display: flex; flex-wrap: wrap; gap: 16px; }
    .contact-pill {
      border: 1px solid rgba(201,169,110,.5);
      padding: 10px 22px;
      font-size: .85rem; letter-spacing: .05em;
      color: var(--gold); transition: all .2s;
    }
    .contact-pill:hover { background: rgba(201,169,110,.1); }

    /* MAIN */
    main { max-width: 1200px; margin: 0 auto; padding: 100px 60px; }

    /* SECTION */
    section { margin-bottom: 90px; }
    .section-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
    .section-header h2 { font-size: 1.6rem; color: #fff; }
    .section-header .sh-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201,169,110,.5), transparent); }

    /* BIO */
    .bio { font-weight: 300; font-size: 1.05rem; line-height: 1.9; color: #b0a898; max-width: 720px; }

    /* SPECIALTIES */
    .specialties { display: flex; flex-wrap: wrap; gap: 12px; }
    .specialty-tag {
      border: 1px solid rgba(201,169,110,.4);
      color: var(--gold); padding: 8px 20px;
      font-size: .8rem; letter-spacing: .1em; text-transform: uppercase;
    }

    /* LISTINGS */
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 3px;
    }
    .property-card {
      position: relative; overflow: hidden;
      height: 260px;
    }
    .property-card img {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform .5s ease;
    }
    .property-card:hover img { transform: scale(1.06); }
    .property-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 60%);
    }
    .no-listings { color: var(--muted); font-style: italic; }

    /* FOOTER */
    footer {
      border-top: 1px solid rgba(201,169,110,.2);
      padding: 40px 60px;
      display: flex; align-items: center; justify-content: space-between;
      font-size: .8rem; color: var(--muted); letter-spacing: .05em;
    }
    .footer-brand { font-family: 'Playfair Display', serif; color: var(--gold); font-size: .95rem; }

    @media (max-width: 768px) {
      nav { padding: 24px 24px; }
      .header-content { flex-direction: column; padding: 40px 24px; gap: 40px; }
      .header-photo { width: 100%; height: 300px; }
      main { padding: 60px 24px; }
      footer { flex-direction: column; gap: 12px; text-align: center; padding: 40px 24px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-bg"></div>
    <div class="header-accent"></div>
    <div class="header-border"></div>

    <nav>
      <span class="nav-brand">${escape(name)}</span>
      <div class="nav-links">
        ${phone ? `<a href="tel:${escapeAttr(phone)}">Contact</a>` : ''}
        ${email ? `<a href="mailto:${escapeAttr(email)}">Email</a>` : ''}
        ${website ? `<a href="${escapeAttr(website)}" target="_blank">Website</a>` : ''}
      </div>
    </nav>

    <div class="header-content">
      <div class="header-photo">
        ${agentPhoto
          ? `<img src="${escapeAttr(agentPhoto)}" alt="${escapeAttr(name)} photo">`
          : `<div class="header-photo-placeholder">&#128100;</div>`}
      </div>
      <div class="header-info">
        <div class="eyebrow">Luxury Real Estate</div>
        <h1>${escape(name)}</h1>
        <div class="gold-divider"></div>
        <p class="tagline">${escape(title)}</p>
        <div class="contact-pills">
          ${phone ? `<a class="contact-pill" href="tel:${escapeAttr(phone)}">${escape(phone)}</a>` : ''}
          ${email ? `<a class="contact-pill" href="mailto:${escapeAttr(email)}">${escape(email)}</a>` : ''}
        </div>
      </div>
    </div>
  </header>

  <main>
    ${bio ? `
    <section>
      <div class="section-header"><h2>About</h2><div class="sh-line"></div></div>
      <p class="bio">${escape(bio).replace(/\n/g, '<br>')}</p>
    </section>` : ''}

    ${specialties.length > 0 ? `
    <section>
      <div class="section-header"><h2>Specialties</h2><div class="sh-line"></div></div>
      <div class="specialties">${specialtiesHtml}</div>
    </section>` : ''}

    <section>
      <div class="section-header"><h2>Featured Properties</h2><div class="sh-line"></div></div>
      <div class="listings-grid">${propertiesHtml}</div>
    </section>
  </main>

  <footer>
    <span class="footer-brand">${escape(name)}</span>
    <span>
      ${licenseNumber ? `License #${escape(licenseNumber)} &nbsp;|&nbsp; ` : ''}
      &copy; ${new Date().getFullYear()} All rights reserved
    </span>
    <span>MustWants Agent Page Generator</span>
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
