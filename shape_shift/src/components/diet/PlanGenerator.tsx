// components/diet/PlanGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  generateDietPlan,
  saveDietPlan,
  listDietPlans,
  deleteDietPlan,
} from '@/lib/api';

type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description?: string;
}
export interface Meals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}
export interface DietPlan {
  _id: string;
  cycleName: string;
  meals: Meals;
  createdAt: string;
}

interface PlanGeneratorProps {
  userId: string;
  onPlanGenerated: (meals: Meals) => void;
}

export default function PlanGenerator({
  userId,
  onPlanGenerated,
}: PlanGeneratorProps) {
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [dietRestriction, setDietRestriction] = useState('');
  const [generated, setGenerated] = useState<Meals | null>(null);
  const [cycleName, setCycleName] = useState('');
  const [plans, setPlans] = useState<DietPlan[]>([]);

  // load saved plans on mount
  useEffect(() => {
    if (!userId) return;
    listDietPlans(userId).then(setPlans);
  }, [userId]);

  const handleGenerate = async () => {
    if (!userId) return;
    const plan = await generateDietPlan(userId, goal, description, dietRestriction);
    setGenerated(plan);
    onPlanGenerated(plan);
  };

  const handleSave = async () => {
    if (!generated || !userId) return;
    const updated = await saveDietPlan(userId, cycleName || Date.now().toString(), generated);
    setPlans(updated);
    setCycleName('');
  };

  const handleDelete = async (idx: number) => {
    if (!userId) return;
    await deleteDietPlan(userId, idx);
    setPlans(await listDietPlans(userId));
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">🤖 Generate AI Plan</h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Calorie goal (e.g. 2000)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Input
          placeholder="Description (e.g. weight loss)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Restrictions (e.g. vegan)"
          value={dietRestriction}
          onChange={(e) => setDietRestriction(e.target.value)}
        />
      </div>
      <Button onClick={handleGenerate}>Generate Plan</Button>

      {/* Show generated plan */}
      {generated && (
        <div className="space-y-2">
          <h3 className="font-medium">Preview:</h3>
          {(['breakfast','lunch','dinner','snacks'] as MealSection[]).map((sec) => (
            <div key={sec}>
              <strong>{sec.charAt(0).toUpperCase()+sec.slice(1)}:</strong>{' '}
              {generated[sec].map((m) => m.name).join(', ')}
            </div>
          ))}
          <Input
            placeholder="Cycle name to save"
            value={cycleName}
            onChange={(e) => setCycleName(e.target.value)}
          />
          <Button onClick={handleSave}>Save Plan</Button>
        </div>
      )}

      {/* List saved plans */}
      {plans.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">Saved Plans:</h3>
          <ul className="space-y-1 text-sm">
            {plans.map((p, i) => (
              <li key={p._id} className="flex justify-between">
                <span>{p.cycleName} ({new Date(p.createdAt).toLocaleDateString()})</span>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
