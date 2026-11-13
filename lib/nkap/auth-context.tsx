'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, VERIFY_CONTINUE_URL } from './firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
  resendVerification: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Friendly text for the Firebase error codes visitors can actually hit. */
export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email already has an account. Try signing in instead.'
    case 'auth/invalid-email':
      return 'That email address does not look complete. Check it and try again.'
    case 'auth/weak-password':
      return 'That password is too weak. Use at least 8 characters with a mix of letters and numbers.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password not recognised. Check both and try again.'
    case 'auth/too-many-requests':
      return 'Too many attempts for now. Please wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'Network problem — check your connection and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getFirebaseAuth()
  const configured = auth !== null

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [auth])

  const value: AuthContextValue = {
    user,
    loading,
    configured,
    async signUp(email, password) {
      if (!auth) throw new Error('not-configured')
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(cred.user, { url: VERIFY_CONTINUE_URL })
    },
    async signIn(email, password) {
      if (!auth) throw new Error('not-configured')
      await signInWithEmailAndPassword(auth, email, password)
    },
    async signOutUser() {
      if (!auth) return
      await signOut(auth)
    },
    async resendVerification() {
      if (!auth || !auth.currentUser) throw new Error('not-signed-in')
      await sendEmailVerification(auth.currentUser, {
        url: VERIFY_CONTINUE_URL,
      })
    },
    async resetPassword(email) {
      if (!auth) throw new Error('not-configured')
      await sendPasswordResetEmail(auth, email)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
