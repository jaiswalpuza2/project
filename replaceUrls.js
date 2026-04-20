const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const urlVariations = [
  { match: /"http:\/\/localhost:(5000|5173)\//g, replace: 'import.meta.env.VITE_API_URL + "/' },
  { match: /"http:\/\/localhost:(5000|5173)"/g, replace: 'import.meta.env.VITE_API_URL' },
  { match: /`http:\/\/localhost:(5000|5173)\//g, replace: '`${import.meta.env.VITE_API_URL}/' },
  { match: /'http:\/\/localhost:(5000|5173)\//g, replace: 'import.meta.env.VITE_API_URL + \'/' },
  { match: /io\("http:\/\/localhost:(5000|5173)"/g, replace: 'io(import.meta.env.VITE_API_URL' } // for socket connection
];

walkDir(path.join(__dirname, 'frontend', 'src'), function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    urlVariations.forEach(variation => {
      content = content.replace(variation.match, variation.replace);
    });

    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
