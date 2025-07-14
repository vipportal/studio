
import type { AdminMember } from "@/app/dashboard/admin/page";

const MEMBER_STORAGE_KEY = 'vip_portal_members';
const FIREBASE_USERS_CACHE_KEY = 'firebaseUsersCache';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

// A placeholder for a server-side call to fetch Firebase users.
// In a real app, this would be an API endpoint calling the Firebase Admin SDK.
export async function fetchFirebaseUsers(): Promise<{ id: string; email: string }[]> {
    if (typeof window === 'undefined') {
        return [];
    }
    // This is a placeholder. In a real-world scenario, you can't get a user list on the client.
    // This requires the Admin SDK on a secure backend.
    // We will return an empty array to avoid breaking the app, and the admin will manage users they know.
    console.warn("fetchFirebaseUsers is a client-side placeholder. For a real app, use a secure backend with Firebase Admin SDK to list users.");
    
    // Attempt to get from cache first
    const cachedData = localStorage.getItem(FIREBASE_USERS_CACHE_KEY);
    if (cachedData) {
        try {
            const { timestamp, users } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
                return users;
            }
        } catch (e) {
            console.error("Failed to parse Firebase users cache", e);
            localStorage.removeItem(FIREBASE_USERS_CACHE_KEY);
        }
    }
    
    // In a real app, here you would make a fetch call to your backend API
    // e.g., const response = await fetch('/api/firebase-users');
    // const users = await response.json();
    
    // For this example, we'll return an empty array, and the logic will primarily rely on existing member data.
    const users: { id: string; email: string }[] = [];
    
    try {
        localStorage.setItem(FIREBASE_USERS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), users }));
    } catch (e) {
        console.error("Failed to set Firebase users cache", e);
    }
    
    return users;
}


export async function getMembers(): Promise<AdminMember[]> {
    if (typeof window === 'undefined') {
        return [];
    }
    
    try {
        const storedDetailsJSON = localStorage.getItem(MEMBER_STORAGE_KEY);
        let storedMembers: AdminMember[] = [];
        if (storedDetailsJSON) {
            try {
                storedMembers = JSON.parse(storedDetailsJSON);
            } catch (e) {
                console.error("Failed to parse members from localStorage", e);
                storedMembers = [];
            }
        }

        const firebaseUsers = await fetchFirebaseUsers();
        
        const allMembersMap = new Map<string, AdminMember>();

        // First, add all existing members with details to the map
        storedMembers.forEach(member => {
            allMembersMap.set(member.id, member);
        });

        // Then, add or update with users from Firebase Auth
        firebaseUsers.forEach(fbUser => {
            if (!allMembersMap.has(fbUser.id)) {
                // This is a new user from Firebase not yet in our details list
                allMembersMap.set(fbUser.id, {
                    id: fbUser.id,
                    phone: fbUser.email,
                    name: '',
                    iban: '',
                    bank: '',
                    tc: '',
                    il: '',
                    ilce: '',
                    weeklyGain: '',
                    errorMessage: 'İşlem sırasında bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.',
                    onayMesaji: 'İşleminiz başarıyla alındı.',
                    invoiceAmount: '',
                    accountActivity: '',
                    meetingInfo: '',
                    currentBalance: '0 TL',
                    status: 'Pasif',
                    transactionStatus: 'allowed',
                });
            } else {
                // User exists, ensure their email (phone field) is up-to-date
                const existingMember = allMembersMap.get(fbUser.id)!;
                existingMember.phone = fbUser.email;
            }
        });

        // Add default values to all members to prevent errors
        const allMembersWithDefaults = Array.from(allMembersMap.values()).map(member => ({
            status: member.status || 'Pasif',
            transactionStatus: member.transactionStatus || 'allowed',
            onayMesaji: member.onayMesaji || 'İşleminiz başarıyla alındı.',
            errorMessage: member.errorMessage || 'İşlem sırasında bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.',
            accountActivity: member.accountActivity || "",
            meetingInfo: member.meetingInfo || "",
            currentBalance: member.currentBalance || "0 TL",
            ...member,
        }));
        
        return allMembersWithDefaults;

    } catch (error) {
        console.error("Failed to process members", error);
        return [];
    }
}


export function setMembers(members: AdminMember[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        // Now we store all members, including those that might only have an id and email,
        // to maintain a consistent list that mirrors Firebase Auth users.
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
        console.error("Failed to save members to localStorage", error);
    }
}
