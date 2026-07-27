import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-3">
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">User Registration Required</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Please complete your account profile or log in to access your study library.
      </p>
    </div>
  );
}
