const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // 1. Run Expo Export
  console.log('🚀 Running Expo Web Export...');
  execSync('npx expo export -p web', { stdio: 'inherit' });

  // 2. Find the generated JavaScript bundle file
  const jsDir = path.join(__dirname, 'dist', '_expo', 'static', 'js', 'web');
  const files = fs.readdirSync(jsDir);
  const jsFile = files.find((f) => f.startsWith('AppEntry'));

  if (!jsFile) {
    throw new Error('AppEntry bundle file not found in dist output!');
  }

  // 3. Inject JS file reference into public/index.html and write to dist/index.html
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const scriptTag = `<script src="/_expo/static/js/web/${jsFile}"></script></body>`;
  html = html.replace('</body>', scriptTag);

  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html);
  console.log('✅ Success: index.html created in dist/');
} catch (error) {
  console.error('❌ Build Script Failed:', error.message);
  process.exit(1);
}