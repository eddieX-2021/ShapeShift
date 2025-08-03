'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea }     from '@/components/ui/textarea';
import { Button }       from '@/components/ui/button';
import { sendFeedback } from '@/lib/api';

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setStatus('idle');

    try {
      await sendFeedback(message.trim());
      setStatus('success');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <Card>
        <CardHeader>
          <CardTitle>We’d love your feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                rows={6}
                placeholder="What’s on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Submit Feedback'}
            </Button>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-green-600">Thanks! Your feedback has been sent. 🙏</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-600">
              Oops, something went wrong. Please try again later.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
