'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CircleUserRound, MailWarning } from 'lucide-react'
import { useAuth, authErrorMessage } from '@/lib/nkap/auth-context'

/**
 * Header account control: sign-in / create-account links when logged out;
 * the account email, verification reminder and sign-out when logged in.
 */
export function AccountMenu() {
  const { user, loading, configured, signOutUser, resendVerification } =
    useAuth()
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!configured || loading) return null

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/sign-in"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create account
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <CircleUserRound className="h-4 w-4" />
        <span className="max-w-[180px] truncate">{user.email}</span>
      </span>
      {!user.emailVerified && (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await resendVerification()
              setNotice('Verification email sent — check your inbox.')
            } catch (e) {
              setNotice(authErrorMessage(e))
            } finally {
              setBusy(false)
            }
          }}
          className="flex items-center gap-1 font-medium text-amber-500 transition-opacity hover:opacity-80 disabled:opacity-50"
          title="Your email is not verified yet — resend the verification email"
        >
          <MailWarning className="h-4 w-4" />
          Verify email
        </button>
      )}
      <button
        type="button"
        onClick={() => signOutUser()}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
      {notice && (
        <span className="w-full text-xs text-muted-foreground">{notice}</span>
      )}
    </div>
  )
}
