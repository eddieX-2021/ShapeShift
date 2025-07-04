'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  fetchTodayMeals,
  fetchNutrition
} from '@/lib/api';

import { Card, CardContent } from '@/components/ui/card';
import { Button }            from '@/components/ui/button';
import { Checkbox }          from '@/components/ui/checkbox';
import { Progress }          from '@/components/ui/progress';

type Meal = { id: string; name: string; mealType: string; calories: number };

export default function TodoDiet({ userId }: { userId: string }) {
  const [meals, setMeals]         = useState<Meal[]>([]);
  const [done,  setDone]          = useState<Set<string>>(new Set());
  const [nutrition, setNutrition] = useState<{ consumed: number; target: number }>({
    consumed: 0,
    target:   0,
  });
  const router = useRouter();

  useEffect(() => {
    console.debug('TodoDiet ➜ useEffect', { userId });
    fetchTodayMeals(userId)
      .then((m) => {
        console.debug('TodoDiet ← meals', m);
        setMeals(m);
      })
      .catch((e) => console.error('TodoDiet fetchMeals error', e));

    fetchNutrition(userId)
      .then((n) => {
        console.debug('TodoDiet ← nutrition', n);
        setNutrition(n);
      })
      .catch((e) => console.error('TodoDiet fetchNutrition error', e));
  }, [userId]);

  const handleCheck = (id: string) => setDone((s) => new Set(s).add(id));
  const allDone     = meals.length > 0 && meals.every((m) => done.has(m.id));
  const pct         = nutrition.target
    ? Math.min((nutrition.consumed / nutrition.target) * 100, 100)
    : 0;

  return (
    <div className="rounded-lg border p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Today's Meals</h2>

      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span>Calories: {nutrition.consumed}</span>
          <span>/ {nutrition.target}</span>
        </div>
        <Progress value={pct} className="w-full mt-1" />
      </div>

      {!meals.length ? (
        <div className="text-sm text-muted-foreground">
          No meals added today.&nbsp;
          <Button size="sm" onClick={() => router.push('/diet')}>
            Add Meals
          </Button>
        </div>
      ) : allDone ? (
        <div className="text-center">
          All meals logged! 🍽️
        </div>
      ) : (
        meals.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p>{m.name}</p>
                <p className="text-xs text-gray-500">{m.mealType}</p>
              </div>
              <Checkbox
                checked={done.has(m.id)}
                onCheckedChange={() => handleCheck(m.id)}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
