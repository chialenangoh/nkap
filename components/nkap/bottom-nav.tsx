'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, Headphones, Home, Scale, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/', label: 'Home', icon: Home, match: '/' },
  { href: '/#compare', label: 'Compare', icon: Scale, match: null },
  { href: '/#rewards', label: 'Rewards', icon: Gift, match: null },
  { href: '/how-it-works', label: 'Support', icon: Headphones, match: '/how-it-works' },
  { href: '/account', label: 'Settings', icon: Settings, match: '/account' },
] as const

/**
 * Mobile bottom tab bar, modelled on the reference app (Home · Compare ·
 * Rewards · Support · Settings). Every tab goes somewhere real: Support
 * opens How Nkap works, Settings opens the account page. Desktop keeps
 * the top navigation, so this renders on small screens only.
 */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      <div aria-hidden className="h-24 md:hidden" />
      <nav
        aria-label="App"
        className="fixed inset-x-3 bottom-3 z-40 md:hidden"
      >
        <div className="flex items-stretch justify-between rounded-full border border-border bg-card/95 px-1.5 py-1.5 shadow-2xl backdrop-blur">
          {ITEMS.map((item) => {
            const active = item.match !== null && pathname === item.match
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 text-[11px] transition-colors',
                  active
                    ? 'bg-secondary font-semibold text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
