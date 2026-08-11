#!/usr/bin/env node
// Zero-dependency static file server for viewing feature specs in the browser.
// Usage: node .github/tools/serve.js [port]   (default port 8741, or set PORT env)
// Serves the project root so specs/ and .github/tools/api-viewer.html resolve.
// Adds GET /api/specs -> JSON list of { name, spec, openapi } for specs/*/.
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || process.argv[2] || 8741);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yaml': 'application/yaml; charset=utf-8',
  '.yml': 'application/yaml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function listSpecs() {
  const specsDir = path.join(ROOT, 'specs');
  if (!fs.existsSync(specsDir)) return [];
  return fs
    .readdirSync(specsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      spec: `specs/${e.name}/spec.md`,
      openapi: `specs/${e.name}/openapi.yaml`,
    }))
    .filter((s) => fs.existsSync(path.join(ROOT, s.openapi)));
}

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/specs') {
    send(res, 200, JSON.stringify(listSpecs(), null, 2), 'application/json; charset=utf-8');
    return;
  }

  if (pathname === '/') {
    res.writeHead(302, { Location: '/.github/tools/api-viewer.html' });
    res.end();
    return;
  }

  const rel = pathname.replace(/^\/+/, '');
  const abs = path.resolve(ROOT, rel);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) {
    send(res, 403, 'Forbidden\n', 'text/plain; charset=utf-8');
    return;
  }

  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      send(res, 404, 'Not found\n', 'text/plain; charset=utf-8');
      return;
    }
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(abs).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Spec viewer: http://localhost:${PORT}/`);
  console.log(`Spec list:   http://localhost:${PORT}/api/specs`);
});
