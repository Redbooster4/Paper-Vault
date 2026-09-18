const fs = require('fs');

const file = 'src/styles/shared.module.css';
let css = fs.readFileSync(file, 'utf8');

// Remove all existing .container { ... } blocks
css = css.replace(/\.container\s*\{[^}]+\}/g, '');

// Remove all existing .title { ... } blocks
css = css.replace(/\.title\s*\{[^}]+\}/g, '');

// Remove all existing .subtitle { ... } blocks
css = css.replace(/\.subtitle\s*\{[^}]+\}/g, '');

// Prepend unified blocks
const unified = `
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  width: 100%;
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  color: #fff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
}

.subtitle {
  font-size: 1.1rem;
  color: #a0a0a0;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}
`;

fs.writeFileSync(file, unified + "\n" + css.trim());
console.log("Deduplicated and updated widths in shared.module.css");
