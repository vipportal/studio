
import type { AdminMember } from "@/app/dashboard/admin/page";

const MEMBER_STORAGE_KEY = 'vip_portal_members';

const initialMembers: AdminMember[] = [
  { id: 1, name: "Ali Veli", phone: "5551112233", password: "password1", iban: "TR123456789", bank: "Garanti", tc: "11111111111", il: "İstanbul", ilce: "Beşiktaş", weeklyGain: "1500 TL", errorMessage: "Lütfen destek ekibiyle iletişime geçin, ödemeniz askıya alındı.", invoiceAmount: "1250 TL", status: "Aktif", transactionStatus: 'blocked' },
  { id: 2, name: "Ayşe Fatma", phone: "5554445566", password: "password2", iban: "TR987654321", bank: "Akbank", tc: "22222222222", il: "Ankara", ilce: "Çankaya", weeklyGain: "2000 TL", errorMessage: "Hata", invoiceAmount: "1800 TL", status: "Pasif", transactionStatus: 'allowed' },
];

export function getMembers(): AdminMember[] {
    if (typeof window === 'undefined') {
        return initialMembers;
    }
    try {
        const storedMembers = localStorage.getItem(MEMBER_STORAGE_KEY);
        if (storedMembers) {
            // Add transactionStatus to existing members if it doesn't exist
            const members = JSON.parse(storedMembers) as AdminMember[];
            return members.map(member => ({
                transactionStatus: 'allowed', // Default value
                ...member,
            }));
        } else {
            // Initialize with default members if none are stored
            localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(initialMembers));
            return initialMembers;
        }
    } catch (error) {
        console.error("Failed to retrieve members from localStorage", error);
        return initialMembers;
    }
}

export function setMembers(members: AdminMember[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
        console.error("Failed to save members to localStorage", error);
    }
}
