"use client";
import WorkoutForm from "@/components/exercise/WorkoutForm";
import WorkoutPlanAccordion from "@/components/exercise/WorkoutPlanAccordion";
import WorkoutPlannerBoard from "@/components/exercise/WorkoutPlannerBoard";
import { useState } from "react";


export default function ExercisePage() {
  const [aiPlan, setAiPlan] = useState<WorkoutPlan | null>(null);
  const [planner, setPlanner] = useState<{ [day: string]: any[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  type WorkoutPlan = {
  cycleName: string;
  exercises: {
    name: string;
    sets: number | string;
    reps: number | string;
    description?: string;
  }[];
};


  const addWorkout = (day: string, workout: any) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: [...prev[day], workout],
    }));
  };
  const removeWorkout = (day: string, index: number) => {
  setPlanner((prev) => ({
    ...prev,
    [day]: prev[day].filter((_, i) => i !== index),
  }));
};
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🏋️ Workout Planner</h1>

      {/* AI Plan Generator */}
      <WorkoutForm onPlanReady= {setAiPlan}/>

      {/* AI Plan Display + Auto-Add */}
      <WorkoutPlanAccordion
        plan={aiPlan}
        onAddExercise={(exercise, day) => addWorkout(day, exercise)}
        onAddAll={() => {
          if (aiPlan?.exercises) {
            aiPlan.exercises.forEach((ex: any) => addWorkout("Monday", ex)); // fallback if needed
          }
        }}
      />

      {/* Manual Planner (To-do/Weekly) */}
      <WorkoutPlannerBoard
        planner={planner}
        addWorkout={addWorkout}
        removeWorkout={removeWorkout}
      />
    </div>
  );
}
