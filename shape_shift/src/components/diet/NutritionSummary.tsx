// components/diet/NutritionSummary.tsx
'use client';

import { Progress } from '@/components/ui/progress';
import { Nutrition } from '@/lib/api';

interface Props {
  nutrition: Nutrition;
  goal: number;
}

export default function NutritionSummary({
  nutrition,
  goal,
}: Props): JSX.Element {
  const { calories, protein, carbs, fats } = nutrition;
  const percent = Math.min((calories / goal) * 100, 100);

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">
        Today's Nutrition
      </h2>
      <p className="text-sm text-muted-foreground">
        Total: {calories} / {goal} kcal
      </p>
      <Progress value={percent} />
      <div className="grid grid-cols-3 gap-2 text-sm mt-2">
        <div>🧬 Protein: {protein}g</div>
        <div>🍞 Carbs: {carbs}g</div>
        <div>🥑 Fats: {fats}g</div>
      </div>
    </div>
  );
}
