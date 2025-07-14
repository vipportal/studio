
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getMembers } from "@/lib/member-storage";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

type AuthContextType = {
  user: User | null;
  member: AdminMember | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Return if auth is not initialized
    if (!auth) {
        setLoading(false);
        // Optional: you might want to redirect to an error page or show a message
        // if Firebase fails to initialize. For now, we just stop loading.
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const allMembers = await getMembers();
          const memberDetails = allMembers.find(m => m.id === currentUser.uid);
          
          if (memberDetails) {
            setMember(memberDetails);
            // We no longer need to store the user in localStorage for auth purposes
          } else {
            // This case happens if a user exists in Firebase Auth but has no profile details yet.
            // This is a valid state; the user is authenticated but may have limited access to features
            // until their profile is completed by an admin.
            setMember(null);
          }
        } catch (error) {
           console.error("Error fetching member details:", error);
           setMember(null);
        }
      } else {
        // User is signed out.
        setMember(null);
        setUser(null);
        
        // Don't redirect if on the login page
        // or if it's the admin page and an admin session is still locally stored.
        const isAdminPage = pathname.startsWith('/dashboard/admin');
        const isLoginPage = pathname === '/';
        const isAdminLoggedIn = typeof window !== 'undefined' && localStorage.getItem('userRole') === 'admin';

        if (!isLoginPage && (!isAdminPage || !isAdminLoggedIn)) {
          router.push('/');
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router, pathname]);

  const value = { user, member, loading };

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
