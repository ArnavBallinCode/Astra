import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const root = resolve('app/dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.png': 'image/png' }
http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  if (!url.pathname.startsWith('/Astra/')) { response.writeHead(404).end(); return }
  const file = resolve(root, decodeURIComponent(url.pathname.slice('/Astra/'.length)) || 'index.html')
  if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return }
  try { const body = await readFile(file); response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' }); response.end(body) }
  catch { response.writeHead(404).end('Not found') }
}).listen(4175, '127.0.0.1')