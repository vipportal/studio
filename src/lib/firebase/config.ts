
"use client";

import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getFirestore, Firestore, collection, query, where, getDocs } from "firebase/firestore";
import type { AdminMember } from "@/app/dashboard/admin/page";


// --- SDK KURULUMU VE YAPILANDIRMASI ---
// Firebase projenizin yapılandırma bilgilerini buraya girin.
// Bu bilgileri Firebase konsolunda, Proje Ayarları > Genel sekmesinde bulabilirsiniz.
const firebaseConfig = {
  apiKey: "AIzaSyCexoCpkkZaTI1OAHcJ743syavAYGImEqU",
  authDomain: "vip-portal-5c0bh.firebaseapp.com",
  projectId: "vip-portal-5c0bh",
  storageBucket: "vip-portal-5c0bh.firebasestorage.app",
  messagingSenderId: "343162938148",
  appId: "1:343162938148:web:c108a818653aea7a95c9b1",
  measurementId: "G-JLV8XG1YBV"
  };

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only on the client side
if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    // This ensures the user's session is persisted across browser sessions.
    setPersistence(auth, browserSessionPersistence);
  } catch (error) {
     console.error("Firebase başlatma hatası. Lütfen `src/lib/firebase/config.ts` dosyasındaki yapılandırma bilgilerinizi kontrol edin.", error);
  }
}

/**
 * Creates a temporary, secondary Firebase app instance to perform actions 
 * like user creation without affecting the primary authentication state.
 * @returns A temporary FirebaseApp instance.
 */
export const createTempApp = (): FirebaseApp | null => {
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

/**
 * Fetches a user document from Firestore by their username.
 * @param username The username to search for.
 * @returns The user document data if found, otherwise null.
 */
export const getUserByUsername = async (username: string): Promise<AdminMember | null> => {
  if (!db) return null;

  try {
    const membersCollection = collection(db, "members");
    const q = query(membersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Assuming username is unique, return the first match.
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as AdminMember;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
};


export { app, auth, db };
