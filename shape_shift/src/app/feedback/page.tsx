'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    // later hook this up to your backend
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <Card>
        <CardHeader>
          <CardTitle>We’d love your feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="feedback">Your thoughts & suggestions</Label>
              <Textarea
                id="feedback"
                rows={5}
                value={feedback}
                onChange={(e:any) => setFeedback(e.target.value)}
                placeholder="Tell us what you like, what we can improve…"
              />
            </div>
            <Button type="submit">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
