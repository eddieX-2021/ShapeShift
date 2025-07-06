'use client';
import { useState, useEffect } from 'react';
import { getCurrentUser, CurrentUser } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';

export default function AccountPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        // maybe redirect to login on 401
      });
  }, []);

  if (!user) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={user.name} readOnly />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
