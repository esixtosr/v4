const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const binaryName = 'sharp-darwin-x64.node';
const vendorVersion = '8.11.3';
const source = path.join(
  root,
  'node_modules',
  'gatsby-plugin-sharp',
  'node_modules',
  'sharp',
  'node_modules',
  'sharp',
  'build',
  'Release',
  binaryName,
);
const sourceVendorDir = path.join(
  root,
  'node_modules',
  'gatsby-plugin-sharp',
  'node_modules',
  'sharp',
  'node_modules',
  'sharp',
  'vendor',
  vendorVersion,
  'darwin-x64',
);

const targets = [
  path.join(root, 'node_modules', 'gatsby-plugin-sharp', 'node_modules', 'sharp'),
  path.join(root, 'node_modules', 'gatsby-plugin-manifest', 'node_modules', 'sharp'),
  path.join(root, 'node_modules', 'gatsby-transformer-sharp', 'node_modules', 'sharp'),
];

const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDir(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
};

if (!fs.existsSync(source) || !fs.existsSync(sourceVendorDir)) {
  process.exit(0);
}

for (const targetRoot of targets) {
  const binaryTarget = path.join(targetRoot, 'build', 'Release', binaryName);
  const vendorTarget = path.join(targetRoot, 'vendor', vendorVersion, 'darwin-x64');

  fs.mkdirSync(path.dirname(binaryTarget), { recursive: true });
  fs.copyFileSync(source, binaryTarget);
  copyDir(sourceVendorDir, vendorTarget);
}
