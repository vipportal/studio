
import type { AdminMember } from "@/app/dashboard/admin/page";

const MEMBER_STORAGE_KEY = 'vip_portal_members';

const initialMembers: AdminMember[] = [
  { id: 1, name: "Ali Veli", phone: "5551112233", password: "password1", iban: "TR123456789", bank: "Garanti", tc: "11111111111", il: "İstanbul", ilce: "Beşiktaş", weeklyGain: "1500 TL", errorMessage: "Lütfen destek ekibiyle iletişime geçin, ödemeniz askıya alındı.", onayMesaji: "Para çekme talebiniz onaylanmıştır.", invoiceAmount: "1250 TL", accountActivity: "Gelen Transfer: +1.250,00 TL (VIP Üyelik)", meetingInfo: "Randevu oluşturmadan önce lütfen uygunluk durumunu kontrol ediniz.", status: "Aktif", transactionStatus: 'blocked' },
  { id: 2, name: "Ayşe Fatma", phone: "5554445566", password: "password2", iban: "TR987654321", bank: "Akbank", tc: "22222222222", il: "Ankara", ilce: "Çankaya", weeklyGain: "2000 TL", errorMessage: "Hata", onayMesaji: "İşlem başarılı.", invoiceAmount: "1800 TL", accountActivity: "", meetingInfo: "", status: "Pasif", transactionStatus: 'allowed' },
];

export function getMembers(): AdminMember[] {
    if (typeof window === 'undefined') {
        return initialMembers;
    }
    try {
        const storedMembers = localStorage.getItem(MEMBER_STORAGE_KEY);
        if (storedMembers) {
            const members = JSON.parse(storedMembers) as AdminMember[];
            // Ensure all members have the new optional fields to avoid issues
            return members.map(member => ({
                transactionStatus: 'allowed',
                onayMesaji: "İşleminiz başarıyla alındı.",
                accountActivity: "",
                meetingInfo: "",
                ...member, // Existing data overwrites defaults
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
