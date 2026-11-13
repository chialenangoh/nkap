/**
 * Firebase client setup for Nkap accounts.
 *
 * The config values are Firebase's PUBLIC client identifiers (they ship in
 * every visitor's browser by design); security comes from Firebase Auth
 * itself, not from hiding them. Filled in when the dedicated "nkap"
 * Firebase project was created (Nov 13, 2026).
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCc4YTtFY_o4cyL4bC99fY6MefP9HzWNzs',
  authDomain: 'nkap-4d8e2.firebaseapp.com',
  projectId: 'nkap-4d8e2',
  storageBucket: 'nkap-4d8e2.firebasestorage.app',
  messagingSenderId: '204033715732',
  appId: '1:204033715732:web:bb6935b586b5e409470101',
}

export const AUTH_CONFIGURED = !firebaseConfig.apiKey.startsWith('FIREBASE_')

let app: FirebaseApp | null = null

export function getFirebaseAuth(): Auth | null {
  if (!AUTH_CONFIGURED) return null
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  }
  return getAuth(app)
}

/** Where Firebase sends users after they click the verification link. */
export const VERIFY_CONTINUE_URL = 'https://freenkap.com/auth/confirmed'
