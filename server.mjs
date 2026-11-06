import { serve, FastResponse } from 'srvx'
import { fileURLToPath } from 'node:url'
import { extname, join, resolve, sep } from 'node:path'
import { readdir, readFile, stat } from 'node:fs/promises'
import { brotliCompressSync, gzipSync, constants as zlib } from 'node:zlib'

import handler from './dist/server/server.js'

const clientDir =
  resolve(fileURLToPath(new URL('./dist/client', import.meta.url))) + sep

const port = Number(process.env.PORT) || 3000
const hostname = process.env.HOST || '0.0.0.0'

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/vnd.microsoft.icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf'
}

// Sıkıştırmaya değen (metin tabanlı) türler. woff2/png/jpg zaten sıkıştırılmış.
const COMPRESSIBLE = new Set([
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.txt',
  '.xml',
  '.svg',
  '.webmanifest'
])

/**
 * Statik dosya önbelleği.
 *
 * srvx'in serveStatic'i her istekte dosyayı en yüksek seviye Brotli (q11) ile
 * yeniden sıkıştırıyordu ve Cache-Control göndermiyordu. Bu, küçük bir VPS'te
 * CSS/JS'in saniyelerce gecikmesine (ve sayfanın stilsiz/geç görünmesine) yol
 * açıyordu. Burada her dosya yalnızca bir kez okunur + sıkıştırılır ve bellekte
 * tutulur; hash'li /assets/* dosyaları tarayıcıda 1 yıl önbelleğe alınır.
 */
const cache = new Map()

async function loadFile(filePath) {
  let entry = cache.get(filePath)
  if (entry) return entry

  const fileStat = await stat(filePath).catch(() => null)
  if (!fileStat?.isFile()) return null

  const ext = extname(filePath)
  const raw = await readFile(filePath)
  entry = { raw, type: MIME_TYPES[ext] || 'application/octet-stream' }

  if (COMPRESSIBLE.has(ext) && raw.length > 1024) {
    entry.br = brotliCompressSync(raw, {
      params: {
        [zlib.BROTLI_PARAM_QUALITY]: 11,
        [zlib.BROTLI_PARAM_SIZE_HINT]: raw.length
      }
    })
    entry.gzip = gzipSync(raw, { level: 9 })
  }

  cache.set(filePath, entry)
  return entry
}

async function staticMiddleware(req, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  const pathname = decodeURIComponent(new URL(req.url).pathname)
  if (pathname === '/' || extname(pathname) === '') return next()

  const filePath = join(clientDir, pathname)
  if (!filePath.startsWith(clientDir)) return next()

  const entry = await loadFile(filePath)
  if (!entry) return next()

  const headers = {
    'Content-Type': entry.type,
    // /assets altındaki dosyaların adında içerik hash'i var → güvenle kalıcı önbellek.
    'Cache-Control': pathname.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600'
  }

  let body = entry.raw
  if (entry.br || entry.gzip) {
    headers['Vary'] = 'Accept-Encoding'
    const accept = req.headers.get('accept-encoding') || ''
    if (entry.br && accept.includes('br')) {
      headers['Content-Encoding'] = 'br'
      body = entry.br
    } else if (entry.gzip && accept.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip'
      body = entry.gzip
    }
  }
  headers['Content-Length'] = String(body.length)

  return new FastResponse(req.method === 'HEAD' ? null : body, { headers })
}

// Açılışta tüm client dosyalarını önceden yükle/sıkıştır; böylece ilk ziyaretçi
// de sıkıştırma maliyetini beklemez.
async function warmCache(dir) {
  for (const dirent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, dirent.name)
    if (dirent.isDirectory()) await warmCache(full)
    else await loadFile(full)
  }
}
await warmCache(clientDir).catch((err) =>
  console.warn('[static] cache warm-up failed:', err)
)

serve({
  port,
  hostname,
  // Önce statik client varlıklarını (JS/CSS/görseller) servis et,
  // eşleşme yoksa TanStack Start SSR fetch handler'ına düş.
  middleware: [staticMiddleware],
  fetch: handler.fetch
})

console.log(`Server listening on http://${hostname}:${port}`)
