import React from 'react';
import { BookOpen, Headphones, FileText, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';

export default function StatsGrid() {
  const { documents, notes, user } = useAuth();

  const totalListeningMinutes = documents.reduce((acc, doc) => acc + (doc.listening_time_minutes || 0), 0);
  const listeningHours = (totalListeningMinutes / 60).toFixed(1);

  const stats = [
    {
      label: 'Documents',
      value: documents.length,
      icon: BookOpen,
      colorClass: 'text-primary bg-primary/10',
    },
    {
      label: 'Listening Hours',
      value: `${listeningHours} hrs`,
      icon: Headphones,
      colorClass: 'text-accent bg-accent/10',
    },
    {
      label: 'Notes Taken',
      value: notes.length,
      icon: FileText,
      colorClass: 'text-chart-3 bg-chart-3/10',
    },
    {
      label: 'Day Streak',
      value: `${user.streak || 5} Days 🔥`,
      icon: Flame,
      colorClass: 'text-chart-5 bg-chart-5/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={i} 
            className="p-5 border-0 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 bg-card/80 backdrop-blur-xs"
          >
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${stat.colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
