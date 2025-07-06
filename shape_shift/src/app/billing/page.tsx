'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
  // placeholder state — in a real app you'd fetch this
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free');

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
              <li>2 saved plans (placeholder)</li>
              <li>Limited uploads (placeholder)</li>
            </ul>
            {currentPlan === 'free' ? (
              <Button disabled>Your current plan</Button>
            ) : (
              <Button onClick={() => setCurrentPlan('free')}>
                Downgrade to Free
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tier</CardTitle>
            <CardDescription>$20 USD / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited saved plans (placeholder)</li>
              <li>Unlimited uploads (placeholder)</li>
            </ul>
            {currentPlan === 'pro' ? (
              <Button disabled>Your current plan</Button>
            ) : (
              <Button onClick={() => setCurrentPlan('pro')}>Upgrade to Pro</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
