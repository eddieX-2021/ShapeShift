"use client";

import { Progress } from "@/components/ui/progress";

export default function NutritionSummary() {
  const calories = 1350;
  const goal = 2000;

  return (
    <div className="border rounded-lg p-4 shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Today's Nutrition</h2>
      <p className="text-sm text-muted-foreground">Total: {calories} / {goal} kcal</p>
      <Progress value={(calories / goal) * 100} />

      <div className="grid grid-cols-3 gap-2 text-sm mt-2">
        <div>🧬 Protein: 80g</div>
        <div>🍞 Carbs: 150g</div>
        <div>🥑 Fats: 45g</div>
      </div>
    </div>
  );
}
