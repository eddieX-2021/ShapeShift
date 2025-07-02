// src/components/home/TodoDiet.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Meal = {
  id: string;
  name: string;
  mealType: string;
  calories: number;
};

export default function TodoDiet({ userId }: { userId: string }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [nutrition, setNutrition] = useState<{ consumed: number; target: number }>({
    consumed: 0,
    target: 0,
  });

  const router = useRouter();

  useEffect(() => {
    // fetch today's meals
    axios
      .get(`/api/diet/meals/today?userId=${userId}`)
      .then((res) => setMeals(res.data))
      .catch(console.error);

    // fetch nutrition summary
    axios
      .get(`/api/diet/nutrition?userId=${userId}`)
      .then((res) => setNutrition(res.data))
      .catch(console.error);
  }, [userId]);

  const handleCheck = (mealId: string) => {
    setDone((s) => new Set(s).add(mealId));
  };

  const allDone = meals.length > 0 && meals.every((m) => done.has(m.id));
  const pct = nutrition.target
    ? Math.min((nutrition.consumed / nutrition.target) * 100, 100)
    : 0;

  return (
    <div className="rounded-lg border p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Today's Meals</h2>
      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span>Calories: {nutrition.consumed}</span>
          <span>/ {nutrition.target} kcal</span>
        </div>
        <Progress value={pct} className="w-full mt-1" />
      </div>

      {meals.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No meals added for today.{" "}
          <Button size="sm" onClick={() => router.push("/diet")}>
            Add Meals
          </Button>
        </div>
      ) : allDone ? (
        <AnimatePresence>
          <motion.div
            key="meals-done"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {meals.map((m) => (
              <div key={m.id} className="flex items-center gap-2 p-2">
                <span className="text-green-500">✔</span>
                <span className="line-through">
                  {m.name} ({m.mealType})
                </span>
              </div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center space-y-2"
            >
              <p className="font-semibold">All meals logged! 🍽️</p>
              <Button size="sm" variant="outline" onClick={() => router.push("/diet")}>
                Edit Meals
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="space-y-2">
          {meals.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p>{m.name}</p>
                  <p className="text-xs text-gray-500">{m.mealType}</p>
                </div>
                <Checkbox
                  checked={done.has(m.id)}
                  onCheckedChange={() => handleCheck(m.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
