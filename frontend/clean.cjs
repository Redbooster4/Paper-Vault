const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove import styles
  content = content.replace(/import\s+styles\s+from\s+['"].*\.module\.css['"];\n?/g, '');
  
  // 2. Remove react-icons imports
  content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"]react-icons\/[^'"]+['"];\n?/g, '');

  // 3. Remove BlurText imports
  content = content.replace(/import\s+BlurText\s+from\s+['"].*BlurText.*['"];\n?/g, '');

  // 4. Remove BlurText usages
  content = content.replace(/<BlurText[^>]*>/g, '<span>');
  content = content.replace(/<\/BlurText>/g, '</span>');

  // 5. Remove FiIcon usages (e.g., <FiUpload ... />)
  content = content.replace(/<Fi[A-Za-z0-9]+\s*[^>]*\/?>(<\/Fi[A-Za-z0-9]+>)?/g, '');

  // 6. Replace className={styles.xxx} with className="xxx"
  // Also handle template literals: className={`${styles.dropzone} ${...}`}
  // Actually, standard regex for styles.xyz -> xyz is tricky in template literals.
  // Let's first replace template literals if they exist, or just replace styles.(\w+) with "$1"
  // For className={styles.container}, it becomes className="container"
  content = content.replace(/className=\{styles\.([a-zA-Z0-9_]+)\}/g, 'className="$1"');

  // For className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
  // Let's just globally replace styles.([a-zA-Z0-9_]+) with '$1'
  content = content.replace(/styles\.([a-zA-Z0-9_]+)/g, "'$1'");

  // Fix up className={'container'} to className="container" where simple
  content = content.replace(/className=\{'([a-zA-Z0-9_]+)'\}/g, 'className="$1"');

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Cleanup done!");
