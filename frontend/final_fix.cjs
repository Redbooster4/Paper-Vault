const fs = require('fs');
const path = require('path');

function fixClasses(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('className="')) {
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
      const classList = classes.trim().split(/\s+/);
      if (classList.length === 1) {
        return `className={styles.${classList[0]}}`;
      } else {
        const mapped = classList.map(c => `\${styles.${c}}`).join(' ');
        return `className={\`${mapped}\`}`;
      }
    });
    changed = true;
  }

  if (!content.includes('import styles from') && !content.includes("import styles from")) {
    const parts = filePath.split(/[\/\\]/);
    const srcIndex = parts.indexOf('src');
    const depth = parts.length - srcIndex - 2;
    const prefix = depth === 1 ? '../../styles/' : '../styles/';
    let importStatement = `import styles from '${prefix}shared.module.css';`;
    
    if (filePath.includes('Navbar.jsx')) importStatement = `import styles from '../styles/Navbar.module.css';`;
    if (filePath.includes('Layout.jsx')) importStatement = `import styles from '../styles/Layout.module.css';`;
    if (filePath.includes('CountdownTimer.jsx')) importStatement = `import styles from '../styles/CountdownTimer.module.css';`;
    
    const lines = content.split('\n');
    let insertIdx = 0;
    for(let i = 0; i < lines.length; i++) {
      if(lines[i].startsWith('import ')) insertIdx = i + 1;
    }
    lines.splice(insertIdx, 0, importStatement);
    content = lines.join('\n');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

function traverse(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) traverse(full);
    else if (full.endsWith('.jsx')) fixClasses(full);
  }
}

traverse('src/pages');
traverse('src/components');
