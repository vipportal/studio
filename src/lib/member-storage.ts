
import type { AdminMember } from "@/app/dashboard/admin/page";

const MEMBER_STORAGE_KEY = 'vip_portal_members';
const FIREBASE_USERS_CACHE_KEY = 'firebaseUsersCache';
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

// A placeholder for a server-side call to fetch Firebase users.
// In a real app, this would be an API endpoint calling the Firebase Admin SDK.
// For this project, we'll simulate it and use a cache.
export async function fetchFirebaseUsers(): Promise<{ id: string; email: string }[]> {
    // This is a placeholder. In a real-world scenario, you can't get a user list on the client.
    // This requires the Admin SDK on a secure backend.
    // We will return an empty array to avoid breaking the app, and the admin will manage users they know.
    console.warn("fetchFirebaseUsers is a client-side placeholder. For a real app, use a secure backend with Firebase Admin SDK to list users.");
    
    // Attempt to get from cache first
     if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(FIREBASE_USERS_CACHE_KEY);
        if (cachedData) {
            const { timestamp, users } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
                return users;
            }
        }
    }
    
    // In a real app, here you would make a fetch call to your backend API
    // e.g., const response = await fetch('/api/firebase-users');
    // const users = await response.json();
    
    // For now, we return empty and the logic will rely on existing member data.
    const users: { id: string; email: string }[] = [];
    
    if (typeof window !== 'undefined') {
        localStorage.setItem(FIREBASE_USERS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), users }));
    }
    
    return [];
}


export async function getMembers(): Promise<AdminMember[]> {
    if (typeof window === 'undefined') {
        return [];
    }
    
    try {
        // In a real app, you'd fetch from a database (e.g., Firestore).
        // Here, we're using localStorage as a mock database.
        const storedDetailsJSON = localStorage.getItem(MEMBER_STORAGE_KEY);
        const storedDetails: AdminMember[] = storedDetailsJSON ? JSON.parse(storedDetailsJSON) : [];
        
        // As we cannot fetch all Firebase users on the client, we will rely on the stored details.
        // The Admin Panel will now be responsible for showing users from Firebase
        // and merging them with these details.
        // For client-side operations, we return the details we have.
        return storedDetails.map(member => ({
            status: 'Aktif',
            transactionStatus: 'allowed',
            onayMesaji: "İşleminiz başarıyla alındı.",
            errorMessage: 'İşlem sırasında bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.',
            accountActivity: "",
            meetingInfo: "",
            currentBalance: "0 TL",
            ...member,
        }));

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
        // We only store members that have actual details, not just the Firebase Auth shell.
        const membersWithDetails = members.filter(m => m.name && m.tc);
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(membersWithDetails));
    } catch (error) {
        console.error("Failed to save members to localStorage", error);
    }
}
