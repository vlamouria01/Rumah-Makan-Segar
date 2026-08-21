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
export const DEFAULT_DEMO_PHONE = '089518948115';
export const VERCEL_DOMAIN = 'https://rumah-makan-segar.vercel.app';

export function normalizePhoneNumber(inputPhone: string): string {
  if (!inputPhone) return '';
  const digits = inputPhone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  } else if (digits.startsWith('8')) {
    return '62' + digits;
  } else if (!digits.startsWith('62')) {
    return '62' + digits;
  }
  return digits;
}

export function isValidPhoneNumber(inputPhone: string): boolean {
  if (!inputPhone) return false;
  const digitsOnly = inputPhone.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) return false;
  const normalized = normalizePhoneNumber(inputPhone);
  // Valid Indonesian mobile number format: 628 followed by 7 to 12 digits
  return /^628\d{7,12}$/.test(normalized);
}

export async function loginWithGoogleFirebase(): Promise<{
  success: boolean;
  user?: { email: string; displayName: string; photoURL: string; uid: string; phone: string };
  message?: string;
}> {
  // 1. Try Google Identity Services (Direct Google OAuth - 100% immune to firebaseapp storage partitioning)
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
    try {
      const gUser = await new Promise<any>((resolve, reject) => {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '152286716545-54hvjh3r56s75c2ev77jvsr0jqii4q3j.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              reject(new Error(tokenResponse.error));
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const data = await res.json();
                resolve(data);
              } catch (fetchErr) {
                reject(fetchErr);
              }
            } else {
              reject(new Error('No access token received'));
            }
          },
        });
        client.requestAccessToken();
      });

      if (gUser && gUser.email) {
        return {
          success: true,
          user: {
            email: gUser.email,
            displayName: gUser.name || gUser.given_name || gUser.email.split('@')[0],
            photoURL: gUser.picture || '',
            uid: gUser.sub || `google_${Date.now()}`,
            phone: ''
          }
        };
      }
    } catch (gisErr: any) {
      console.warn('GIS login failed, trying Firebase popup fallback:', gisErr?.message);
    }
  }

  // 2. Try Firebase signInWithPopup as fallback
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Pengguna Google',
        photoURL: user.photoURL || '',
        uid: user.uid,
        phone: user.phoneNumber || ''
      }
    };
  } catch (err: any) {
    console.warn('Firebase Google Auth popup error:', err?.code, err?.message);
    
    // If popup is blocked or storage partitioned
    return {
      success: false,
      message: err?.message || 'Login Google dibatalkan atau tidak dapat dibuka di browser ini.'
    };
  }
}

export async function loginAdminWithGoogleFirebase() {
  // 1. Try GIS first
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
    try {
      const gUser = await new Promise<any>((resolve, reject) => {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '152286716545-54hvjh3r56s75c2ev77jvsr0jqii4q3j.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              reject(new Error(tokenResponse.error));
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const data = await res.json();
                resolve(data);
              } catch (fetchErr) {
                reject(fetchErr);
              }
            } else {
              reject(new Error('No access token received'));
            }
          },
        });
        client.requestAccessToken();
      });

      if (gUser && gUser.email) {
        const userEmail = gUser.email.toLowerCase().trim();
        if (userEmail === ALLOWED_ADMIN_EMAIL.toLowerCase()) {
          return {
            success: true,
            user: {
              email: gUser.email,
              displayName: gUser.name || 'Valensia Rainy (Admin RM Segar)',
              photoURL: gUser.picture || '',
              uid: gUser.sub || `google_${Date.now()}`,
              phone: '6289518948115'
            }
          };
        } else {
          return {
            success: false,
            error: 'UNAUTHORIZED_EMAIL',
            attemptedEmail: gUser.email,
            message: `Akses Ditolak! Akun Google (${gUser.email}) tidak terdaftar sebagai Admin. Hanya akun ${ALLOWED_ADMIN_EMAIL} yang memiliki akses.`
          };
        }
      }
    } catch (gisErr: any) {
      console.warn('GIS Admin login failed, fallback to Firebase:', gisErr?.message);
    }
  }

  // 2. Firebase popup fallback
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';

    if (userEmail === ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: true,
        user: {
          email: user.email || ALLOWED_ADMIN_EMAIL,
          displayName: user.displayName || 'Valensia Rainy (Admin RM Segar)',
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
    console.warn('Firebase Google Auth popup error for Admin:', err?.code, err?.message);
    return {
      success: false,
      errorCode: err?.code || 'AUTH_ERROR',
      message: err?.message || 'Popup Google login dibatalkan atau tidak dapat dibuka di browser ini.'
    };
  }
}
