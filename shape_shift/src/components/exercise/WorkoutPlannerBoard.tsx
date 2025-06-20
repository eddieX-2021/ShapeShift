"use client";

import WorkoutCard from "./WorkoutCard";
import { Button } from "@/components/ui/button";

export default function WorkoutPlannerBoard({
  planner,
  addWorkout,
  removeWorkout,
}: {
  planner: { [day: string]: any[] };
  addWorkout: (day: string, workout: any) => void;
  removeWorkout: (day: string, index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📆 Your Weekly Planner</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(planner).map((day) => (
          <div key={day} className="border p-4 rounded-lg shadow bg-muted">
            <h3 className="font-semibold mb-2">{day}</h3>
            {planner[day].length === 0 ? (
              <p className="text-sm text-gray-500">No workouts yet.</p>
            ) : (
              planner[day].map((w, idx) => (
                <div key={idx} className="relative">
                  <WorkoutCard {...w} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeWorkout(day, idx)}
                  >
                    🗑️
                  </Button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
