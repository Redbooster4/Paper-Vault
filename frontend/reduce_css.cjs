const fs = require('fs');
const path = require('path');

const stylesDir = 'src/styles';
const pagesDir = 'src/pages';
const sharedFile = path.join(stylesDir, 'shared.module.css');

const filesToDelete = [
  'AdminDashboard.module.css',
  'AuditLog.module.css',
  'GrantAccess.module.css',
  'LandingPage.module.css',
  'PaperDetails.module.css',
  'RetrievePaper.module.css',
  'StudentDashboard.module.css',
  'UploadPaper.module.css'
];

let sharedCss = fs.readFileSync(sharedFile, 'utf8') + '\n\n/* --- PAGE STYLES --- */\n';

for (const file of filesToDelete) {
  const fp = path.join(stylesDir, file);
  if (fs.existsSync(fp)) {
    sharedCss += `\n/* From ${file} */\n` + fs.readFileSync(fp, 'utf8') + '\n';
    fs.unlinkSync(fp);
  }
}
fs.writeFileSync(sharedFile, sharedCss);

function updateImports(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      updateImports(full);
    } else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      
      // Replace imports of the deleted files with shared.module.css
      filesToDelete.forEach(deletedFile => {
        const regex = new RegExp(`import\\s+styles\\s+from\\s+['"](?:\\.\\.\\/)*styles\\/${deletedFile}['"];?`, 'g');
        if (regex.test(content)) {
          // calculate relative path to shared.module.css
          const depth = full.split(/[\/\\]/).length - full.split(/[\/\\]/).indexOf('pages') - 1;
          const prefix = depth === 1 ? '../../styles/' : '../styles/';
          content = content.replace(regex, `import styles from '${prefix}shared.module.css';`);
          fs.writeFileSync(full, content);
          console.log(`Updated ${full}`);
        }
      });
    }
  }
}

updateImports(pagesDir);
console.log("Cleanup complete!");
