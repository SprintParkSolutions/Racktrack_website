// Static build for cPanel: copies the shippable files into dist/ and verifies
// that every href/src referenced by the HTML actually exists in the output.
import { cp, rm, mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve, relative, posix } from 'node:path';

const root = import.meta.dirname;
const dist = join(root, 'dist');

// Everything the site needs at runtime. Anything not listed (node_modules,
// tests, package.json, _v.mjs, .claude) stays out of the upload.
const SHIP = ['index.html', 'styles.css', 'js', 'pages', 'assets'];

const HTACCESS = `# RackTrack - static site on cPanel/Apache

DirectoryIndex index.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # HTML must revalidate so deploys are picked up immediately.
  ExpiresByType text/html "access plus 0 seconds"
  # CSS/JS carry ?v= cache-busting query strings, so they can be cached hard.
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_mime.c>
  AddType font/woff2 .woff2
  AddType image/webp .webp
  AddType video/mp4 .mp4
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(woff2)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
</IfModule>

# Serve /pages/contact for /pages/contact.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>

ErrorDocument 404 /index.html
`;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function dirSize(dir) {
  let bytes = 0;
  for (const file of await walk(dir)) bytes += (await stat(file)).size;
  return bytes;
}

// Pull local href/src/url() targets out of a file, ignoring absolute URLs,
// anchors, mailto:/tel: and protocol-relative CDN links.
function localRefs(text) {
  const refs = new Set();
  const patterns = [
    /(?:href|src)\s*=\s*"([^"]+)"/g,
    /(?:href|src)\s*=\s*'([^']+)'/g,
    /url\(\s*["']?([^)"']+)["']?\s*\)/g,
  ];
  for (const re of patterns) {
    for (const [, raw] of text.matchAll(re)) {
      const ref = raw.trim();
      if (!ref || /^(https?:)?\/\//.test(ref)) continue;
      if (/^(#|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
      refs.add(ref.split('#')[0].split('?')[0]);
    }
  }
  return [...refs];
}

async function verify() {
  const broken = [];
  const files = (await walk(dist)).filter((f) => /\.(html|css)$/.test(f));
  for (const file of files) {
    for (const ref of localRefs(await readFile(file, 'utf8'))) {
      const target = ref.startsWith('/')
        ? join(dist, ref)
        : resolve(dirname(file), ref);
      if (!existsSync(target)) {
        broken.push(`${relative(dist, file).split('\\').join('/')} -> ${ref}`);
      }
    }
  }
  return broken;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const item of SHIP) {
  const from = join(root, item);
  if (!existsSync(from)) throw new Error(`missing shippable path: ${item}`);
  await cp(from, join(dist, item), { recursive: true });
  console.log(`copied ${item}`);
}

await writeFile(join(dist, '.htaccess'), HTACCESS);
console.log('wrote .htaccess');

const broken = await verify();
if (broken.length) {
  console.error(`\n${broken.length} broken local reference(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exitCode = 1;
} else {
  console.log('\nlink check: all local references resolve');
}

const files = await walk(dist);
const mb = ((await dirSize(dist)) / 1024 / 1024).toFixed(1);
console.log(`dist/: ${files.length} files, ${mb} MB`);
