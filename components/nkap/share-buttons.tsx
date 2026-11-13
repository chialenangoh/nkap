'use client'

import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

/**
 * Plain share links (no SDKs, no tracking pixels): WhatsApp, Facebook, X,
 * plus a copy-link button. `text` should already include the corridor's
 * best verified receiver-gets figure when one is available.
 */
export function ShareButtons({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const btn =
    'inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Share2 className="h-3.5 w-3.5" /> Share this comparison:
      </span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className={btn}
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className={btn}
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className={btn}
      >
        X
      </a>
      <button type="button" onClick={copyLink} className={btn}>
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-primary" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy link
          </>
        )}
      </button>
    </div>
  )
}
