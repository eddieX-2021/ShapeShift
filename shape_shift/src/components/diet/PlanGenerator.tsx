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
  Meals,
  DietPlan,
  applyGeneratedPlan,    // ← import
} from '@/lib/api';

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
  const [dietRestriction, setDietRestriction] =
    useState('');
  const [generated, setGenerated] = useState<Meals | null>(
    null
  );
  const [cycleName, setCycleName] = useState('');
  const [plans, setPlans] = useState<DietPlan[]>([]);

  // Load saved plans
  useEffect(() => {
    if (!userId) return;
    listDietPlans(userId).then(setPlans);
  }, [userId]);

  const handleGenerate = async () => {
    if (!userId) return;
    const plan = await generateDietPlan(
      userId,
      goal,
      description,
      dietRestriction
    );
    setGenerated(plan);
    onPlanGenerated(plan);
  };

  const handleSave = async () => {
    if (!generated || !userId) return;
    const updated = await saveDietPlan(
      userId,
      cycleName || Date.now().toString(),
      generated
    );
    setPlans(updated);
    setCycleName('');
  };
  const handleApply = async () => {
    if (!generated || !userId) return;
    // this writes generated to today’s meals
    await applyGeneratedPlan(userId, generated);
    // optionally re-load nutrition or meals:
    onPlanGenerated(generated);
  };


  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">
        🤖 Generate AI Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Goal (e.g. lose weight)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Input
          placeholder="Description (e.g. 200 lb)"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
        <Input
          placeholder="Restrictions (e.g. vegan)"
          value={dietRestriction}
          onChange={(e) =>
            setDietRestriction(e.target.value)
          }
        />
      </div>

      <Button onClick={handleGenerate}>
        Generate Plan
      </Button>

      {generated && (
        <div className="space-y-2">
          <h3 className="font-medium">Preview:</h3>
          {(
            ['breakfast', 'lunch', 'dinner', 'snacks'] as const
          ).map((sec) => (
            <div key={sec}>
              <strong>
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
                :
              </strong>{' '}
              {generated[sec].map((m) => m.name).join(', ')}
            </div>
          ))}

          <Input
            placeholder="Cycle name to save"
            value={cycleName}
            onChange={(e) =>
              setCycleName(e.target.value)
            }
          />

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              Save Plan
            </Button>
            <Button
              variant="secondary"
              onClick={handleApply}
            >
              Apply to Today
            </Button>
          </div>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">
            Saved Plans:
          </h3>
          <ul className="space-y-1 text-sm">
            {plans.map((p, i) => (
              <li
                key={p._id}
                className="flex justify-between"
              >
                <span>
                  {p.cycleName} (
                  {new Date(p.createdAt).toLocaleDateString()}
                  )
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await deleteDietPlan(userId, i);
                    setPlans(
                      await listDietPlans(userId)
                    );
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
