const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/CalendarPage.jsx',
];

for (const file of filesToFix) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix lucide-react imports
  const blockRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];/g;
  content = content.replace(blockRegex, (match, importsStr) => {
    let cleanImports = importsStr.replace(/\b(Twitter|Linkedin|Instagram|Facebook)\b\s*,?/g, '');
    return `import {${cleanImports}} from 'lucide-react';\nimport { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';`;
  });

  // Write back
  fs.writeFileSync(filePath, content);
}
