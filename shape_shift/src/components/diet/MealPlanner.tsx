// components/diet/MealPlanner.tsx
'use client';

import { Meals, MealItem } from '@/lib/api';

interface MealPlannerProps {
  meals: Meals;
  onDelete: (section: keyof Meals, idx: number) => void;
}

export default function MealPlanner({ meals, onDelete }: MealPlannerProps) {
  const sections = ['breakfast','lunch','dinner','snacks'] as const;

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-6">
      <h2 className="text-xl font-semibold">🍽️ Your Meals Today</h2>
      {sections.map((section) => {
        const items: MealItem[] = meals[section] ?? [];
        return (
          <div key={section} className="space-y-2">
            <h3 className="text-lg font-semibold capitalize">
              {section}
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-lg">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.calories} kcal • {item.protein}g P •{' '}
                      {item.carbs}g C • {item.fats}g F
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                    <button
                      className="mt-2 text-red-500 text-sm hover:underline"
                      onClick={() => onDelete(section, idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
