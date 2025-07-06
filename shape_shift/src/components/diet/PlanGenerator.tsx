// components/diet/PlanGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Input }  from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  generateDietPlan,
  saveDietPlan,
  listDietPlans,
  deleteDietPlan,
  applyGeneratedPlan,
  Meals,
  DietPlan,
} from '@/lib/api';

interface Props {
  userId: string;
  onPlanGenerated: (meals: Meals) => void;
}

export default function PlanGenerator({ userId, onPlanGenerated }: Props) {
  const [goal, setGoal]                 = useState('');
  const [description, setDescription]   = useState('');
  const [dietRestriction, setDietRestriction] = useState('');
  const [generated, setGenerated]       = useState<Meals | null>(null);
  const [cycleName, setCycleName]       = useState('');
  const [plans, setPlans]               = useState<DietPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // load saved plans
  useEffect(() => {
    if (!userId) return;
    listDietPlans(userId)
      .then(setPlans)
      .catch((e) => {
        console.error(e);
        toast({
          title: 'Error',
          description: 'Couldn’t load saved plans.',
          variant: 'destructive',
        });
      });
  }, [userId]);

  const handleGenerate = async () => {
    if (!userId) return;
    setIsGenerating(true);
    try {
      const meals = await generateDietPlan(userId, goal, description, dietRestriction);
      setGenerated(meals);
      onPlanGenerated(meals);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Failed to generate plan.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    try {
      const updated = await saveDietPlan(
        userId,
        cycleName || Date.now().toString(),
        generated
      );
      setPlans(updated);
      setCycleName('');
      toast({ title: 'Saved!', description: 'Your plan was saved.' });
    } catch (err: any) {
      toast({
        title: 'Couldn’t save plan',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleApply = async () => {
    if (!generated) return;
    try {
      await applyGeneratedPlan(userId, generated);
      onPlanGenerated(generated);
      toast({ title: 'Applied!', description: 'Plan applied to today.' });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Failed to apply plan.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      const updated = await deleteDietPlan(userId, idx);
      setPlans(updated);
      toast({ title: 'Deleted', description: 'Plan removed.' });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Failed to delete plan.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-semibold">🤖 Generate AI Plan</h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input placeholder="Restrictions" value={dietRestriction} onChange={(e) => setDietRestriction(e.target.value)} />
      </div>

      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating…' : 'Generate Plan'}
      </Button>

      {/* Preview + Save */}
      {generated && (
        <div className="p-4 bg-gray-50 rounded space-y-4">
          <h3 className="font-medium">Preview:</h3>
          {(['breakfast','lunch','dinner','snacks'] as const).map((sec) => (
            <div key={sec}>
              <strong>{sec.charAt(0).toUpperCase()+sec.slice(1)}:</strong>{' '}
              {generated[sec].map((m) => m.name).join(', ')}
            </div>
          ))}
          {plans.length < 2 ? (
            <>
              <Input
                placeholder="Cycle name to save"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={!cycleName}>
                  Save Plan
                </Button>
                <Button variant="outline" onClick={handleApply}>
                  Apply to Today
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-red-600">
              You’ve reached the maximum of 2 saved plans.
            </p>
          )}
        </div>
      )}

      {/* Saved Plans List */}
      {plans.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-medium">💾 Saved Plans ({plans.length}/2)</h3>
          {plans.map((p, i) => (
            <div
              key={p._id}
              className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm"
            >
              <div>
                <strong>{p.cycleName}</strong>{' '}
                <span className="text-sm text-gray-500">
                  ({new Date(p.createdAt).toLocaleDateString()})
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleDelete(i)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
