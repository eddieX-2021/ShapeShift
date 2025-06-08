"use client";

import { useState } from "react";
import WorkoutCard from "./WorkoutCard";

export default function WorkoutPlannerBoard() {
  const [planner, setPlanner] = useState<{ [day: string]: any[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
  });

  const addWorkout = (day: string, workout: any) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: [...prev[day], workout],
    }));
  };

  const dummyWorkout = { name: "Pushups", sets: 3, reps: 15 };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📆 Your Weekly Planner</h2>
        <button
          className="text-sm underline"
          onClick={() => addWorkout("Monday", dummyWorkout)}
        >
          ➕ Add Dummy Workout to Monday
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(planner).map((day) => (
          <div key={day} className="border p-4 rounded-lg shadow bg-muted">
            <h3 className="font-semibold mb-2">{day}</h3>
            {planner[day].length === 0 ? (
              <p className="text-sm text-gray-500">No workouts yet.</p>
            ) : (
              planner[day].map((w, idx) => (
                <WorkoutCard key={idx} {...w} />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
