
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMember } from "@/app/dashboard/admin/page";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const MeetingsPageSkeleton = () => (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
                <Card>
                    <CardContent className="p-2">
                        <Skeleton className="w-full h-[350px]" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                        <Separator className="my-2" />
                        <Skeleton className="h-10 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default function MeetingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { member, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Planlama Başarılı",
        description: `Görüşmeniz ${date ? format(date, "PPP") : ""} için başarıyla oluşturuldu.`,
    })
  }
  
  if (loading) {
      return <MeetingsPageSkeleton />;
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
              {member?.meetingInfo && (
                <>
                    <Separator className="my-2" />
                    <p className="text-lg font-bold text-foreground pt-2">
                        {member.meetingInfo}
                    </p>
                </>
              )}
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
