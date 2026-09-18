const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      fixImports(full);
    } else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes("import styles from '../styles/shared.module.css';")) {
         const parts = full.split(/[/\\]/);
         const depth = parts.length - parts.indexOf('src') - 2;
         if (depth === 2) {
             content = content.replace("import styles from '../styles/shared.module.css';", "import styles from '../../styles/shared.module.css';");
             fs.writeFileSync(full, content);
             console.log("Fixed depth 2: " + full);
         }
      }
      if (content.includes("import styles from '../../styles/shared.module.css';")) {
         const parts = full.split(/[/\\]/);
         const depth = parts.length - parts.indexOf('src') - 2;
         if (depth === 1) {
             content = content.replace("import styles from '../../styles/shared.module.css';", "import styles from '../styles/shared.module.css';");
             fs.writeFileSync(full, content);
             console.log("Fixed depth 1: " + full);
         }
      }
    }
  }
}
fixImports('src/pages');
fixImports('src/components');
