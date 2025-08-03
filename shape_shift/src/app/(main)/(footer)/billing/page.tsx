'use client';

import { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '@/lib/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Called when user confirms in the modal
  const handleConfirm = async () => {
    setIsDialogOpen(false);
    setLoading(true);
    try {
      const url = await createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Subscription Plans</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Free Tier</CardTitle>
            <CardDescription>$0 USD / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1">
              <li>Save up to 2 diet & exercise plans</li>
              <li>Basic API quotas</li>
            </ul>
            {currentPlan === 'free' ? (
              <Button disabled>Your current plan</Button>
            ) : (
              <Button onClick={() => setCurrentPlan('free')}>
                Switch to Free
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tier</CardTitle>
            <CardDescription>$5 USD / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited saved diet & exercise plans</li>
              <li>Higher API quotas</li>
              <li>Priority support</li>
            </ul>
            {currentPlan === 'pro' ? (
              <Button disabled>Your current plan</Button>
            ) : (
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => setIsDialogOpen(true)}
              >
                {loading ? 'Redirecting…' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warning Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm bg-white ring-2 ring-red-500">
          <DialogHeader>
            <DialogTitle className="text-red-600">Warning</DialogTitle>
            <DialogDescription className="text-sm text-gray-700">
              Most of the features in this app are free.  
              Consider this as a donation to support development.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Redirecting…' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
