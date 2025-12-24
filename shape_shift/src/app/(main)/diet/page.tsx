"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import NutritionSummary from "@/components/diet/NutritionSummary";
import FoodUpload from "@/components/diet/FoodUpload";
import MealSearch from "@/components/diet/MealSearch";
import PlanGenerator from "@/components/diet/PlanGenerator";
import MealPlanner from "@/components/diet/MealPlanner";
import CustomMealForm from "@/components/diet/CustomMealForm";

import {
  getCurrentUser,
  getTodayMeals,
  getDietNutrition,
  addMealFromSearch,
  deleteDietMealItem,
  Meals,
  Nutrition,
  MealSection,
  getSuggestedCalories,
} from "@/lib/api";

export default function DietPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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

  const [goal, setGoal] = useState<number>(2000);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const refreshAll = async (uid: string) => {
    const [m, n] = await Promise.all([getTodayMeals(uid), getDietNutrition(uid)]);
    setMeals(m);
    setNutrition(n);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setUserId(null);
          return;
        }
        setUserId(user.id);

        const suggested = await getSuggestedCalories(user.id);
        setGoal(suggested);

        await refreshAll(user.id);
      } catch (e) {
        console.error("Diet page load failed:", e);
        setUserId(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const handleAdd = async (section: MealSection, name: string) => {
    if (!userId) return;
    await addMealFromSearch(userId, name, section);
    await refreshAll(userId);
  };

  const handleDelete = async (section: MealSection, idx: number) => {
    if (!userId) return;
    await deleteDietMealItem(userId, section, idx);
    await refreshAll(userId);
  };

  if (loadingUser) return <div className="p-6">Loading...</div>;

  if (!userId) {
    return <div className="p-6 text-gray-600">Please log in to view Diet Planner.</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🥗 Diet Planner</h1>

      <PlanGenerator
        userId={userId}
        onPlanGenerated={async (pm) => {
          setMeals(pm);
          await refreshAll(userId);
        }}
      />

      <NutritionSummary nutrition={nutrition} goal={goal} />

      <FoodUpload />

      <MealSearch onAdd={handleAdd} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">🍽️ Your Meals</h2>

          <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <DialogTrigger asChild>
              <Button>Add Custom Meal</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Custom Meal</DialogTitle>
                <DialogDescription>Enter the details of your custom meal.</DialogDescription>
              </DialogHeader>

              <CustomMealForm
                userId={userId}
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
