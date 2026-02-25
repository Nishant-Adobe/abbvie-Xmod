const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const CONTENT_DIR = path.join(__dirname, 'content');

function getPageShell(contentHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Index</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <script src="/scripts/aem.js" type="module"></script>
  <script src="/scripts/scripts.js" type="module"></script>
  <link rel="stylesheet" href="/styles/styles.css"/>
</head>
<body>
  <header></header>
  <main>${contentHtml}</main>
  <footer></footer>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // Serve .plain.html content files
  if (url.endsWith('.plain.html')) {
    const filePath = path.join(CONTENT_DIR, url);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + url);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
    return;
  }

  // Serve local project files (scripts, styles, blocks)
  const localExtensions = ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'];
  const ext = path.extname(url).toLowerCase();
  if (localExtensions.includes(ext)) {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + url);
        return;
      }
      const mimeTypes = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
    return;
  }

  // For page requests - embed content in the EDS page shell
  // Map URL to .plain.html file
  let contentFile;
  if (url === '/' || url === '/index' || url === '/index.html') {
    contentFile = 'index.plain.html';
  } else {
    const baseName = url.replace(/\.html$/, '').replace(/^\//, '');
    contentFile = baseName + '.plain.html';
  }

  const contentPath = path.join(CONTENT_DIR, contentFile);
  fs.readFile(contentPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(getPageShell(''));
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(getPageShell(data));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Content server listening on http://localhost:${PORT}`);
});
