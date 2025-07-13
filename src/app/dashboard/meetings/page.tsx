import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const meetings = [
  { with: "Ayşe Y.", date: "30/05/2024 - 14:00", duration: "60 dk", img: "https://placehold.co/100x100.png", hint: "woman face" },
  { with: "Elif A.", date: "25/05/2024 - 18:30", duration: "45 dk", img: "https://placehold.co/100x100.png", hint: "woman profile" },
  { with: "Fatma K.", date: "18/05/2024 - 20:00", duration: "90 dk", img: "https://placehold.co/100x100.png", hint: "woman elegant" },
  { with: "Selin G.", date: "12/05/2024 - 11:00", duration: "75 dk", img: "https://placehold.co/100x100.png", hint: "woman coffee" },
];

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
       <div className="mb-8">
         <h1 className="text-3xl font-headline font-bold">Görüşmelerim</h1>
         <p className="text-muted-foreground">Geçmiş görüşme kayıtlarınız.</p>
       </div>
       <div className="space-y-4">
        {meetings.map((meeting) => (
            <Card key={meeting.with} className="transition-colors hover:bg-card/80">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-accent/50">
                            <AvatarImage src={meeting.img} alt={meeting.with} data-ai-hint={meeting.hint} />
                            <AvatarFallback>{meeting.with.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{meeting.with}</p>
                            <p className="text-sm text-muted-foreground">{meeting.date}</p>
                        </div>
                    </div>
                    <p className="font-mono text-sm">{meeting.duration}</p>
                </CardContent>
            </Card>
        ))}
       </div>
    </div>
  );
}
