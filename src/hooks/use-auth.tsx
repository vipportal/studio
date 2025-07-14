
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // User is signed in with Firebase.
        // Now, let's get their profile details from our own storage.
        const allMembers = await getMembers();
        const memberDetails = allMembers.find(m => m.id === currentUser.uid);
        
        if (memberDetails) {
          setMember(memberDetails);
          // Update localStorage for immediate access on other pages if needed
          localStorage.setItem('loggedInUser', JSON.stringify(memberDetails));
        } else {
          // This case might happen if admin hasn't filled details yet.
          setMember(null);
          localStorage.removeItem('loggedInUser');
        }
      } else {
        // User is signed out.
        setMember(null);
        localStorage.removeItem('loggedInUser');
        const isAdmin = localStorage.getItem('userRole') === 'admin';
        // Redirect to login if not on an auth page and not admin.
        if (!pathname.startsWith('/dashboard/admin') && pathname !== '/' && !isAdmin) {
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
