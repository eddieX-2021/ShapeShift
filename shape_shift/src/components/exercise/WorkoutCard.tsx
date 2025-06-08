"use client";

import { Button } from "@/components/ui/button";

export default function WorkoutCard({ name, sets, reps, onAdd }: { name: string; sets: number; reps: number; onAdd?: () => void }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-2 bg-white">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>{sets} sets × {reps} reps</p>
      {onAdd && <Button onClick={onAdd}>➕ Add to Planner</Button>}
    </div>
  );
}
