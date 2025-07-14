
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getMembers } from "@/lib/member-storage";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  member: AdminMember | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
        try {
            const loggedInUser = JSON.parse(loggedInUserData);
            const allMembers = getMembers();
            const freshUserData = allMembers.find(m => m.id === loggedInUser.id);
            setMember(freshUserData || null);
        } catch (e) {
            console.error("Failed to parse loggedInUser from localStorage", e);
            setMember(null);
        }
    } else if (!pathname.startsWith('/dashboard/admin') && pathname !== '/') {
        router.push('/');
    }
    setLoading(false);
  }, [router, pathname]);

  const value = { member, loading };

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
