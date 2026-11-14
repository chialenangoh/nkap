'use client'

import Link from 'next/link'
import { Coins, Gift } from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'

/** "chialefack.nangoh+x@gmail.com" → "Chialefack Nangoh" for greetings. */
export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0].split('+')[0]
  const words = local.split(/[._-]+/).filter(Boolean)
  if (words.length === 0) return 'Friend'
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function initialsFromEmail(email: string): string {
  const words = email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

/**
 * App-style welcome bar at the top of the home screen (modelled on the
 * reference app Chiale provided): avatar + "Welcome, Name" and a rewards
 * pill. Signed-out visitors get a friendly generic greeting.
 */
export function WelcomeBar() {
  const { user, loading, configured } = useAuth()
  const signedIn = configured && !loading && Boolean(user?.email)

  return (
    <div className="flex items-center gap-3">
      {signedIn ? (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-primary-foreground ring-2 ring-primary/30">
          {initialsFromEmail(user!.email!)}
        </span>
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary/30">
          <Coins className="h-6 w-6" />
        </span>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-sm text-muted-foreground">Welcome</p>
        <p className="truncate font-heading text-lg font-bold text-foreground">
          {signedIn
            ? displayNameFromEmail(user!.email!)
            : 'to Nkap — compare before you send'}
        </p>
      </div>
      <Link
        href="/#rewards"
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-sm font-semibold text-primary shadow-md transition-shadow hover:shadow-lg"
      >
        <Gift className="h-4 w-4" />
        Get $20 off
      </Link>
    </div>
  )
}
