import { LOGO_PNG_BASE64 } from '@/lib/nkap/logo-data'

/** Serves the Nkap wordmark logo (transparent PNG) — see lib/nkap/logo-data.ts. */
export function GET() {
  return new Response(Buffer.from(LOGO_PNG_BASE64, 'base64'), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
