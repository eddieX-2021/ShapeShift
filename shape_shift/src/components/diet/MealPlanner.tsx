'use client';

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

interface MealPlannerProps {
  meals: Meals;
  onDelete: (section: keyof Meals, index: number) => void;
}

export default function MealPlanner({ meals, onDelete }: MealPlannerProps) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">🍽️ Your Meals Today</h2>

      {(['breakfast', 'lunch', 'dinner', 'snacks'] as (keyof Meals)[]).map((section) => (
        <div key={section} className="space-y-2">
          <h3 className="text-md font-medium capitalize">{section}</h3>
          {meals[section].length === 0 ? (
            <div className="text-sm text-muted-foreground">No items yet.</div>
          ) : (
            meals[section].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  {item.name} — {item.calories} kcal
                </div>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => onDelete(section, idx)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
