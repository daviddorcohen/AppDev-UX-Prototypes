const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const outDir = '/Users/ygalanti/Downloads';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/save/')) {
    const filename = decodeURIComponent(req.url.replace('/save/', ''));
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const dataMatch = body.toString().match(/^data:image\/png;base64,(.+)$/);
      if (dataMatch) {
        const buf = Buffer.from(dataMatch[1], 'base64');
        const outPath = path.join(outDir, filename);
        fs.writeFileSync(outPath, buf);
        console.log(`Saved: ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, path: outPath }));
      } else {
        res.writeHead(400);
        res.end('Invalid data');
      }
    });
    return;
  }

  if (req.method === 'GET') {
    const file = path.join(dir, req.url === '/' ? 'auto-export.html' : req.url);
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(file);
    const ct = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    fs.createReadStream(file).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(8765, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:8765');
  console.log('PNGs will be saved to:', outDir);
});
