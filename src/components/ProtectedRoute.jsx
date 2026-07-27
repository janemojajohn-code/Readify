import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from './UserNotRegisteredError';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <UserNotRegisteredError />;
  }
  return children;
}
