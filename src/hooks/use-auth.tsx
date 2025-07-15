
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// The email for the admin user
const ADMIN_EMAIL = "admin@vip-portal.com";

type AuthContextType = {
  user: User | null;
  member: AdminMember | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<AdminMember | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading=true
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !db) {
        console.error("Firebase Auth or Firestore is not initialized.");
        setLoading(false); // Stop loading if services fail
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const isAdminUser = currentUser.email === ADMIN_EMAIL;
        setIsAdmin(isAdminUser);

        if (!isAdminUser) {
            // Fetch member details from Firestore
            const memberDocRef = doc(db, "members", currentUser.uid);
            const memberDocSnap = await getDoc(memberDocRef);

            if (memberDocSnap.exists()) {
                 setMember(memberDocSnap.data() as AdminMember);
            } else {
                 console.warn(`No member document found for UID: ${currentUser.uid}`);
                 setMember(null);
            }
        } else {
            setMember(null); // Admin is not a "member"
        }
      } else {
        // No user is signed in
        setUser(null);
        setMember(null);
        setIsAdmin(false);
      }
      
      // Firebase has given us an answer, so we can stop loading.
      setLoading(false); 
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Wait until loading is false to prevent race conditions during initial load.
    if (loading) {
      return; 
    }

    const isAuthenticated = !!user;
    const isAuthPage = pathname === '/';
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (!isAuthenticated && isDashboardPage) {
      // If user is not authenticated and tries to access a protected dashboard page, redirect to login.
      router.push('/');
    } else if (isAuthenticated && isAuthPage) {
      // If user is authenticated and on the login page, redirect to their dashboard.
      if (isAdmin) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/profile');
      }
    } else if (isAuthenticated && pathname === '/dashboard') {
        // If user lands on the base dashboard, redirect to their profile.
        router.push('/dashboard/profile');
    }

  }, [user, isAdmin, loading, pathname, router]);


  const value = { 
    user, 
    member, 
    isAdmin,
    isAuthenticated: !loading && !!user, // Authenticated is only true when loading is done and user exists
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
