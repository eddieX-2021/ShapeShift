
'use client';

import { useState, useEffect } from 'react';
import NutritionSummary from '@/components/diet/NutritionSummary';
import FoodUpload from '@/components/diet/FoodUpload';
import MealSearch from '@/components/diet/MealSearch';
import PlanGenerator from '@/components/diet/PlanGenerator';
import MealPlanner from '@/components/diet/MealPlanner';
import {
  getTodayMeals,
  getDietNutrition,
  addMealFromSearch,
  deleteDietMealItem,
  getCurrentUser,
} from '@/lib/api';

type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description?: string;
}

interface Meals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function DietPage() {
  const [userId, setUserId] = useState<string>('');                       // no more `string | null`
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
  const goal = 2000; // your daily calorie goal

  // 1) Load current user, then fetch meals & nutrition
  useEffect(() => {
    (async () => {
      try {
        const user = (await getCurrentUser()) as { _id: string };      // :contentReference[oaicite:0]{index=0}
        setUserId(user._id);

        const [mealsData, nutritionData] = await Promise.all([
          getTodayMeals(user._id),
          getDietNutrition(user._id),
        ]);
        setMeals(mealsData);
        setNutrition(nutritionData);
      } catch (err) {
        console.error('Error initializing diet page:', err);
      }
    })();
  }, []);

  // 2) Helpers to re-fetch when you add/delete
  const fetchMeals = async () => {
    if (!userId) return;
    try {
      setMeals(await getTodayMeals(userId));
    } catch (err) {
      console.error('Failed to load meals', err);
    }
  };

  const fetchNutrition = async () => {
    if (!userId) return;
    try {
      setNutrition(await getDietNutrition(userId));
    } catch (err) {
      console.error('Failed to load nutrition', err);
    }
  };

  // 3) Add via search
  const handleAdd = async (section: MealSection, mealName: string) => {
    if (!userId) return;
    try {
      await addMealFromSearch(userId, mealName, section);
      await Promise.all([fetchMeals(), fetchNutrition()]);
    } catch (err) {
      console.error('Failed to add meal', err);
    }
  };

  // 4) Delete an item
  const handleDelete = async (section: MealSection, index: number) => {
    if (!userId) return;
    try {
      await deleteDietMealItem(userId, section, index);
      await Promise.all([fetchMeals(), fetchNutrition()]);
    } catch (err) {
      console.error('Failed to delete meal', err);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🥗 Diet Planner</h1>
      {/* AI Plan generator */}
      <PlanGenerator
        userId={userId}
        onPlanGenerated={(planMeals) => {
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
