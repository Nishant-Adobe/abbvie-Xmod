const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const CONTENT_DIR = path.join(__dirname, 'content');

const server = http.createServer((req, res) => {
  // Map request paths to local files
  let filePath;
  const url = req.url.split('?')[0]; // Strip query params

  if (url === '/' || url === '/index' || url === '/index.html') {
    filePath = path.join(CONTENT_DIR, 'index.plain.html');
  } else if (url.endsWith('.plain.html')) {
    filePath = path.join(CONTENT_DIR, url);
  } else if (url.endsWith('.html')) {
    // Try plain.html version
    filePath = path.join(CONTENT_DIR, url.replace('.html', '.plain.html'));
  } else {
    filePath = path.join(CONTENT_DIR, url + '.plain.html');
  }

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
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Content server listening on http://localhost:${PORT}`);
});
