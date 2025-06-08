"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const meals = [
  { name: "Grilled Chicken", calories: 300 },
  { name: "Oatmeal", calories: 200 },
  { name: "Tuna Salad", calories: 250 },
];

export default function MealSearch() {
  const [query, setQuery] = useState("");

  const filtered = meals.filter((meal) =>
    meal.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="border rounded-lg p-4 shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold">🔍 Search Meals</h2>
      <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="space-y-2">
        {filtered.map((meal, i) => (
          <div key={i} className="flex justify-between items-center border p-2 rounded">
            <div>
              {meal.name} — {meal.calories} kcal
            </div>
            <Button size="sm">Add</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
