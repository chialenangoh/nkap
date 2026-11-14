import { ICON_PNG_BASE64 } from '@/lib/nkap/logo-data'

/** Apple touch icon — same artwork as /icon.png (iOS scales it). */
export function GET() {
  return new Response(Buffer.from(ICON_PNG_BASE64, 'base64'), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
