'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { fetchTodayMeals, fetchNutrition } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Type for each meal item
type Meal = { id: string; name: string; mealType: string; calories: number };
const SECTIONS = ['breakfast','lunch','dinner','snacks'] as const;
enum SectionTitles { breakfast = 'Breakfast', lunch = 'Lunch', dinner = 'Dinner', snacks = 'Snacks' }

export default function TodoDiet({ userId }: { userId: string }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [nutrition, setNutrition] = useState<{ consumed: number; target: number }>({ consumed: 0, target: 0 });
  const router = useRouter();

  useEffect(() => {
    fetchTodayMeals(userId).then(setMeals).catch(console.error);
    fetchNutrition(userId).then(setNutrition).catch(console.error);
  }, [userId]);

  const handleCheck = (id: string) => setDone(s => new Set(s).add(id));
  const allDone = meals.length > 0 && meals.every(m => done.has(m.id));
  const pct = nutrition.target ? Math.min((nutrition.consumed / nutrition.target) * 100, 100) : 0;

  // Group meals by section
  const grouped = SECTIONS.reduce((acc, sect) => {
    acc[sect] = meals.filter(m => m.mealType.toLowerCase() === sect);
    return acc;
  }, {} as Record<typeof SECTIONS[number], Meal[]>);

  return (
    <div className="rounded-lg border p-4 shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold m-0">Today&apos;s Meals</h2>
        {meals.length === 0 && (
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => router.push('/diet')}
          >
            Add Meals
          </Button>
        )}
      </div>


      {/* Calories progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Calories: <strong>{nutrition.consumed}</strong></span>
          <span>/ {nutrition.target}</span>
        </div>
        <Progress value={pct} className="h-2 rounded-full" />
      </div>

      {/* Meals grid or all-done message */}
      {allDone ? (
        <div className="text-center py-4 font-medium text-green-600">All meals logged! 🍽️</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map(sect => (
            <Card key={sect} className="overflow-hidden">
              <CardContent>
                <h3 className="text-md font-semibold uppercase mb-2">{SectionTitles[sect]}</h3>
                {grouped[sect].length > 0 ? (
                  <ul className="space-y-1">
                    {grouped[sect].map(m => (
                      <li key={m.id} className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-medium line-clamp-2 overflow-ellipsis">{m.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{m.calories} cal</p>
                        </div>
                        <Checkbox checked={done.has(m.id)} onCheckedChange={() => handleCheck(m.id)} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No {sect} items</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
