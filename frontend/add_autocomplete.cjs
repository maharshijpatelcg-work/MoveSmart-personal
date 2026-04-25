const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/WomenSafety.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Traffic.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Settings.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Safety.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Routes.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Register.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/Login.jsx',
  'c:/Users/maharshi patel/Documents/onedrive/Desktop/MoveSmart-personal/smartmove/frontend/src/pages/LiveMap.jsx'
];

files.forEach(file => {
  if(fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Add autoComplete="off" to <input tags if not present
    content = content.replace(/<input(?!\s+autoComplete=)([^>]+)>/g, '<input autoComplete="off"$1>');
    fs.writeFileSync(file, content);
    console.log('Updated ' + path.basename(file));
  } else {
    console.log('File not found: ' + file);
  }
});
