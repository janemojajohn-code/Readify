import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-4">
      <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
        <BookOpen className="h-10 w-10 opacity-60" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
      <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="default" className="rounded-xl px-6 font-semibold">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
