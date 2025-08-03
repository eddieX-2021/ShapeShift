"use client";

import { Input } from "@/components/ui/input";
import WorkoutCard from "./WorkoutCard";
import { useState } from "react";

const exerciseLibrary = [
  { name: "Deadlift", sets: 4, reps: 6 },
  { name: "Bench Press", sets: 4, reps: 8 },
  { name: "Shoulder Press", sets: 3, reps: 10 },
];

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}
export default function WorkoutSearch({
  onAdd,
}: {
  onAdd?: (w: Exercise) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = exerciseLibrary.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🔍 Search Workouts</h2>
      <Input
        placeholder="Search exercises..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid gap-3">
        {filtered.map((exercise, idx) => (
          <WorkoutCard key={idx} {...exercise} onAdd={() => onAdd?.(exercise)} />
        ))}
      </div>
    </div>
  );
}
