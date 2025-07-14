
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
          if (!isAdminUser) {
            const allMembers = getMembers(); // This is client-side safe
            const memberDetails = allMembers.find(m => m.id === currentUser.uid);
            setMember(memberDetails || null);
          } else {
            setMember(null);
          }
        } catch (error) {
           console.error("Error fetching member details:", error);
           setMember(null);
        }
      } else {
        setUser(null);
        setMember(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Wait until loading is false to prevent race conditions
    if (loading) {
      return; 
    }

    const isAuthenticated = !!user;
    const isAuthPage = pathname === '/';
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (!isAuthenticated && isDashboardPage) {
      // If user is not authenticated and tries to access dashboard, redirect to login
      router.push('/');
    } else if (isAuthenticated && isAuthPage) {
      // If user is authenticated and on the login page, redirect to their dashboard
      if (isAdmin) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/profile');
      }
    } else if (isAuthenticated && pathname === '/dashboard') {
        // If user lands on the base dashboard, redirect to profile
        router.push('/dashboard/profile');
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
