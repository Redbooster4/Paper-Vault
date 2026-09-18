const fs = require('fs');
const path = require('path');

function removeSubtitles(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) removeSubtitles(full);
    else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      const original = content;
      
      // We look for <p className={styles.subtitle}>...</p>
      // We can use a regex to match it. Because it might span multiple lines, we can match carefully.
      content = content.replace(/<p className=\{styles\.subtitle\}>[\s\S]*?<\/p>\n?/g, '');
      
      if (original !== content) {
        fs.writeFileSync(full, content);
        console.log("Removed subtitle from: " + full);
      }
    }
  }
}
removeSubtitles('src/pages');
