import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const ALLOWED_ADMIN_EMAIL = 'valensiarainy73@gmail.com';

export async function loginWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        email: user.email || '',
        displayName: user.displayName || 'Pengguna RM Segar',
        photoURL: user.photoURL || '',
        uid: user.uid,
        phone: user.phoneNumber || ''
      }
    };
  } catch (err: any) {
    console.error('Firebase Google Auth error:', err);
    return {
      success: false,
      error: err.code || 'AUTH_ERROR',
      message: err.message || 'Gagal melakukan login dengan Google Firebase.'
    };
  }
}

export async function loginAdminWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';

    if (userEmail === ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: true,
        user: {
          email: user.email || ALLOWED_ADMIN_EMAIL,
          displayName: user.displayName || 'Admin RM Segar',
          photoURL: user.photoURL || '',
          uid: user.uid,
          phone: '6289518948115'
        }
      };
    } else {
      await signOut(auth);
      return {
        success: false,
        error: 'UNAUTHORIZED_EMAIL',
        attemptedEmail: user.email || 'tanpa email',
        message: `Akses Ditolak! Akun Google (${user.email || 'tanpa email'}) tidak terdaftar sebagai Admin. Hanya akun ${ALLOWED_ADMIN_EMAIL} yang memiliki akses.`
      };
    }
  } catch (err: any) {
    console.error('Firebase Google Auth error:', err);
    return {
      success: false,
      error: err.code || 'AUTH_ERROR',
      message: err.message || 'Gagal melakukan login dengan Google Firebase.'
    };
  }
}
