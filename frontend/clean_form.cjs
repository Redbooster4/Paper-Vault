const fs = require('fs');
const file = 'src/styles/shared.module.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(/\.form\s*\{[^}]+\}/g, '');

const unified = `
.form { 
  display: flex; 
  flex-direction: column; 
  gap: 1.25rem; 
  background: #111113; 
  padding: 2.5rem; 
  border-radius: 12px; 
  border: 1px solid #27272a; 
  margin-bottom: 2rem;
  width: 100%;
}
`;

fs.writeFileSync(file, unified + "\n" + css.trim());
console.log("Deduplicated .form");
