
"use client";

import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const areEnvsDefined = 
    !!firebaseConfig.apiKey &&
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
    console.error("Firebase config environment variables are not defined. Please create a .env.local file with your Firebase credentials.");
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
