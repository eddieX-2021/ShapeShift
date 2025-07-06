'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  const router = useRouter();
  return (
    <div className="p-6 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-3xl font-bold">🎉 Thank you!</h1>
      <p>Your donation was successful.</p>
      <Button onClick={() => router.push('/billing')}>Back to Billing</Button>
    </div>
  );
}
