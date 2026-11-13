import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { AuthFormShell, SignUpForm } from '@/components/nkap/auth-forms'

export const metadata: Metadata = {
  title: 'Create your account | Nkap',
  description:
    'Create a free Nkap account with a verified email — save your corridors and get rate alerts from Money in America.',
  alternates: { canonical: '/sign-up' },
}

export default function SignUpPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <AuthFormShell
          title="Create your account"
          intro="A free account keeps your rate alerts in one place. We will email you a verification link first — your account is not active until you click it."
        >
          <SignUpForm />
        </AuthFormShell>
      </main>
      <SiteFooter />
    </div>
  )
}
