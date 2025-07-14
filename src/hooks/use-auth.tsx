
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getMembers } from "@/lib/member-storage";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Return if auth is not initialized
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        setUser(currentUser);
        const isAdminUser = currentUser.email === ADMIN_EMAIL;
        setIsAdmin(isAdminUser);

        try {
          // Admin does not have a member profile, so we can skip fetching.
          if (!isAdminUser) {
            const allMembers = await getMembers();
            const memberDetails = allMembers.find(m => m.id === currentUser.uid);
            setMember(memberDetails || null);
          } else {
            setMember(null); // Ensure member is null for admin
          }
        } catch (error) {
           console.error("Error fetching member details:", error);
           setMember(null);
        }
      } else {
        // User is signed out. Reset all auth state.
        setUser(null);
        setMember(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Removed router and pathname dependencies to prevent re-running on navigation

  // This effect handles redirection logic based on auth state.
  // It runs when loading is finished or when the user navigates to a new page.
  useEffect(() => {
    if (loading) {
      return; // Don't do anything while auth state is being determined
    }

    const isAuthenticated = !!user;
    const isAuthPage = pathname === '/';
    const isAdminPage = pathname.startsWith('/dashboard/admin');

    if (isAuthPage) {
      if (isAuthenticated) {
        // If user is logged in and on the login page, redirect to their dashboard
        router.push('/dashboard');
      }
    } else {
      // For all other pages (dashboard, etc.)
      if (!isAuthenticated) {
        // If user is not logged in, redirect to login page
        router.push('/');
      } else if (isAdminPage && !isAdmin) {
        // If user is trying to access admin page but is not admin, redirect
        router.push('/dashboard');
      }
    }

  }, [user, isAdmin, loading, pathname, router]);


  const value = { 
    user, 
    member, 
    isAdmin,
    isAuthenticated: !!user,
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
