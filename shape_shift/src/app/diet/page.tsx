'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

import NutritionSummary from '@/components/diet/NutritionSummary';
import FoodUpload        from '@/components/diet/FoodUpload';
import MealSearch        from '@/components/diet/MealSearch';
import PlanGenerator     from '@/components/diet/PlanGenerator';
import MealPlanner       from '@/components/diet/MealPlanner';
import CustomMealForm    from '@/components/diet/CustomMealForm';

import {
  getCurrentUser,
  getTodayMeals,
  getDietNutrition,
  addMealFromSearch,
  deleteDietMealItem,
  Meals,
  Nutrition,
  MealSection,
} from '@/lib/api';

export default function DietPage() {
  const [userId, setUserId]       = useState<string>('');
  const [meals, setMeals]         = useState<Meals>({
    breakfast: [], lunch: [], dinner: [], snacks: []
  });
  const [nutrition, setNutrition] = useState<Nutrition>({
    calories: 0, protein: 0, carbs: 0, fats: 0
  });

  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const goal = 2000;

  // fetch helper
  const refreshAll = async () => {
    if (!userId) return;
    const [m, n] = await Promise.all([
      getTodayMeals(userId),
      getDietNutrition(userId),
    ]);
    setMeals(m);
    setNutrition(n);
  };

  // init
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUserId(user.id);
      const [initialMeals, initialNutrition] = await Promise.all([
        getTodayMeals(user.id),
        getDietNutrition(user.id),
      ]);
      setMeals(initialMeals);
      setNutrition(initialNutrition);
    })();
  }, []);

  const handleAdd = async (section: MealSection, name: string) => {
    if (!userId) return;
    await addMealFromSearch(userId, name, section);
    await refreshAll();
  };

  const handleDelete = async (section: MealSection, idx: number) => {
    if (!userId) return;
    await deleteDietMealItem(userId, section, idx);
    await refreshAll();
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🥗 Diet Planner</h1>

      <PlanGenerator
        userId={userId}
        onPlanGenerated={async (pm) => {
          setMeals(pm);
          await refreshAll();
        }}
      />

      <NutritionSummary nutrition={nutrition} goal={goal} />

      <FoodUpload />

      <MealSearch onAdd={handleAdd} />

      {/* --- Daily Meals + single Add-Custom button --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">🍽️ Your Meals Today</h2>

          {/* DialogTrigger will wrap this button */}
          <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <DialogTrigger asChild>
              <Button>Add Custom Meal</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Custom Meal</DialogTitle>
                <DialogDescription>
                  Enter the details of your custom meal.
                </DialogDescription>
              </DialogHeader>

              <CustomMealForm
                userId={userId}
                onCancel={() => setIsCustomOpen(false)}
                onAdded={async (newMeals) => {
                  setMeals(newMeals);
                  setIsCustomOpen(false);
                  setNutrition(await getDietNutrition(userId));
                }}
              />


            </DialogContent>
          </Dialog>
        </div>

        <MealPlanner meals={meals} onDelete={handleDelete} />
      </div>
    </div>
  );
}
