"use client";

import { Button } from "@/components/ui/button";

type WorkoutCardProps = {
  name: string;
  sets: number | string;
  reps: number | string;
  description?: string;
  onAdd?: () => void;
};

export default function WorkoutCard({ name, sets, reps, description, onAdd }: WorkoutCardProps) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white space-y-2 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{name}</h3>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            ➕ Add
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <strong>Sets:</strong> {sets} &nbsp;&nbsp;&nbsp;
        <strong>Reps:</strong> {reps}
      </p>

      {description && (
        <p className="text-sm text-gray-700 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}
