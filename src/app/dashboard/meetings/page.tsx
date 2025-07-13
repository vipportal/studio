
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

export default function MeetingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Planlama Başarılı",
        description: `Görüşmeniz ${date ? format(date, "PPP") : ""} için başarıyla oluşturuldu.`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Görüşme Planlayıcı</h1>
        <p className="text-muted-foreground">
          Yeni bir görüşme oluşturmak için takvimden bir gün seçin ve bilgileri girin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardContent className="p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full"
                        disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                </CardContent>
            </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Görüşme Detayları</CardTitle>
              <CardDescription>
                {date ? format(date, "PPP") : "Lütfen bir tarih seçin"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input id="subject" placeholder="Örn: Akşam Yemeği Planı" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="duration">Süre (dakika)</Label>
                  <Input id="duration" type="number" placeholder="Örn: 90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea id="notes" placeholder="Eklemek istediğiniz notlar..." />
                </div>
                <Button type="submit" className="w-full">
                  Görüşme Oluştur
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
