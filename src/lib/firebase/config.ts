
"use client";

import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

// --- SDK KURULUMU VE YAPILANDIRMASI ---
// Firebase projenizin yapılandırma bilgilerini buraya girin.
// Bu bilgileri Firebase konsolunda, Proje Ayarları > Genel sekmesinde bulabilirsiniz.
const firebaseConfig = {
  apiKey: "YAPIŞTIRIN: Buraya kendi FIREBASE_API_KEY değerinizi yapıştırın",
  authDomain: "YAPIŞTIRIN: Buraya kendi FIREBASE_AUTH_DOMAIN değerinizi yapıştırın",
  projectId: "YAPIŞTIRIN: Buraya kendi FIREBASE_PROJECT_ID değerinizi yapıştırın",
  storageBucket: "YAPIŞTIRIN: Buraya kendi FIREBASE_STORAGE_BUCKET değerinizi yapıştırın",
  messagingSenderId: "YAPIŞTIRIN: Buraya kendi FIREBASE_MESSAGING_SENDER_ID değerinizi yapıştırın",
  appId: "YAPIŞTIRIN: Buraya kendi FIREBASE_APP_ID değerinizi yapıştırın",
  measurementId: "YAPIŞTIRIN: Buraya kendi G- ile başlayan MEASUREMENT_ID değerinizi yapıştırın" // Google Analytics için
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const areEnvsDefined = 
    !!firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith("YAPIŞTIRIN:") &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId;

// Initialize Firebase only on the client side and if config is valid
if (typeof window !== 'undefined') {
  if (areEnvsDefined) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // This ensures the user's session is persisted across browser sessions.
    setPersistence(auth, browserSessionPersistence);
  } else {
    console.error("Firebase yapılandırma bilgileri eksik. Lütfen `src/lib/firebase/config.ts` dosyasını kontrol edin.");
  }
}

/**
 * Creates a temporary, secondary Firebase app instance to perform actions 
 * like user creation without affecting the primary authentication state.
 * @returns A temporary FirebaseApp instance.
 */
export const createTempApp = (): FirebaseApp | null => {
    if (!areEnvsDefined) {
        console.error("Firebase config not defined, cannot create temp app.");
        return null;
    }
    const tempAppName = `temp-app-${Date.now()}`;
    return initializeApp(firebaseConfig, tempAppName);
};

/**
 * Creates a new user in a temporary app instance to avoid logging out the current admin.
 * @param email The new user's email.
 * @param password The new user's password.
 * @returns A promise that resolves with the UserCredential of the new user.
 */
export const createUserInTempApp = async (email: string, password: string): Promise<UserCredential> => {
    const tempApp = createTempApp();
    if (!tempApp) {
        throw new Error("Failed to create temporary Firebase app for user creation.");
    }
    const tempAuth = getAuth(tempApp);

    try {
        const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
        return userCredential;
    } finally {
        // Clean up the temporary app instance
        if (tempApp) {
           await deleteApp(tempApp);
        }
    }
};


export { app, auth, areEnvsDefined };
