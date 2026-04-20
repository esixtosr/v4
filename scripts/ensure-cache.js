const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '.cache');

fs.mkdirSync(cacheDir, { recursive: true });
