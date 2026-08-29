const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  console.log('🚀 Step 1: Exporting Expo Web...');
  execSync('npx expo export -p web', { stdio: 'inherit' });

  const distDir = path.join(__dirname, 'dist');
  const publicHtml = path.join(__dirname, 'public', 'index.html');

  if (!fs.existsSync(publicHtml)) {
    throw new Error('public/index.html file missing!');
  }

  // Find AppEntry bundle file recursively
  function findAppEntry(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        const found = findAppEntry(fullPath);
        if (found) return found;
      } else if (file.name.startsWith('AppEntry') && file.name.endsWith('.js')) {
        return fullPath;
      }
    }
    return null;
  }

  const jsFileFull = findAppEntry(distDir);
  if (!jsFileFull) {
    throw new Error('Could not find AppEntry bundle in dist!');
  }

  const relativePath = path.relative(distDir, jsFileFull).replace(/\\/g, '/');
  console.log(`📦 Injecting Bundle: ${relativePath}`);

  let html = fs.readFileSync(publicHtml, 'utf8');
  const scriptTag = `<script src="/${relativePath}"></script></body>`;
  html = html.replace('</body>', scriptTag);

  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('✅ Success: index.html generated in dist/');
} catch (err) {
  console.error('❌ Build Script Error:', err.message);
  process.exit(1);
}