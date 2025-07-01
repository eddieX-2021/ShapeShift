// page.tsx
'use client';

import { useState, useEffect } from 'react';
import NutritionSummary from '@/components/diet/NutritionSummary';
import FoodUpload from '@/components/diet/FoodUpload';
import MealSearch from '@/components/diet/MealSearch';
import PlanGenerator from '@/components/diet/PlanGenerator';
import MealPlanner from '@/components/diet/MealPlanner';

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
  const [userId, setUserId] = useState<string>('');
  const [meals, setMeals] = useState<Meals>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [nutrition, setNutrition] = useState<Nutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const goal = 2000;

  // Initialize user & load data
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUserId(user._id);
      const [m, n] = await Promise.all([
        getTodayMeals(user._id),
        getDietNutrition(user._id),
      ]);
      setMeals(m);
      setNutrition(n);
    })();
  }, []);

  // Helpers
  const fetchMeals = async () => {
    if (!userId) return;
    setMeals(await getTodayMeals(userId));
  };
  const fetchNutrition = async () => {
    if (!userId) return;
    setNutrition(await getDietNutrition(userId));
  };

  // Handlers (typed!)
  const handleAdd = async (
    section: MealSection,
    mealName: string
  ) => {
    if (!userId) return;
    await addMealFromSearch(userId, mealName, section);
    await Promise.all([fetchMeals(), fetchNutrition()]);
  };

  const handleDelete = async (
    section: MealSection,
    index: number
  ) => {
    if (!userId) return;
    await deleteDietMealItem(userId, section, index);
    await Promise.all([fetchMeals(), fetchNutrition()]);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🥗 Diet Planner</h1>

      <PlanGenerator
        userId={userId}
        onPlanGenerated={(planMeals: Meals) => {
          setMeals(planMeals);
          fetchNutrition();
        }}
      />

      <NutritionSummary nutrition={nutrition} goal={goal} />

      <FoodUpload />

      <MealSearch onAdd={handleAdd} />

      <MealPlanner meals={meals} onDelete={handleDelete} />
    </div>
  );
}
