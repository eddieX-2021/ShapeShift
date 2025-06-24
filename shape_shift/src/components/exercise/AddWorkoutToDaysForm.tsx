// components/exercise/AddWorkoutToDaysForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onAddToDays: (
    workout: {
      name: string;
      sets: number;
      reps: number;
      description?: string;
    },
    days: string[]
  ) => void;
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddWorkoutToDaysForm({ onAddToDays }: Props) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>(
    WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
  );

  const toggleDay = (day: string) =>
    setSelected((prev) => ({ ...prev, [day]: !prev[day] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = WEEK_DAYS.filter((d) => selected[d]);
    if (!name || days.length === 0) return alert("Name + at least one day required");
    onAddToDays({ name, sets, reps, description: description || undefined }, days);
    // reset
    setName(""); setSets(3); setReps(10); setDescription("");
    setSelected(WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {}));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">➕ Add Custom Workout</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          placeholder="Exercise name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(Number(e.target.value))}
        />
        <Input
          type="number"
          min={1}
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {WEEK_DAYS.map((day) => (
          <Button
            key={day}
            size="sm"
            variant={selected[day] ? "default" : "outline"}
            onClick={() => toggleDay(day)}
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>

      <Button type="submit">Add to Selected Days</Button>
    </form>
  );
}
