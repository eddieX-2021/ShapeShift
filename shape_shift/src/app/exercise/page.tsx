"use client";

import { useState, useEffect } from "react";
import WorkoutForm from "@/components/exercise/WorkoutForm";
import WorkoutPlanAccordion from "@/components/exercise/WorkoutPlanAccordion";
import WorkoutPlannerBoard from "@/components/exercise/WorkoutPlannerBoard";
import {
  getCurrentUser,
  getAIPlans,
  saveAIPlan,
  deleteAIPlan,
  getManualPlanner,
  updatePlannerDay,
} from "@/lib/api";

type WorkoutPlan = {
  _id?: string;
  cycleName: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
  }[];
};

// Define the shape of what your API returns for the manual planner
type ManualPlannerResponse = Record<
  "monday" |
  "tuesday" |
  "wednesday" |
  "thursday" |
  "friday" |
  "saturday" |
  "sunday",
  any[]
>;

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [aiSuggestedPlan, setAiSuggestedPlan] = useState<WorkoutPlan | null>(
    null
  );
  const [savedPlans, setSavedPlans] = useState<WorkoutPlan[]>([]);
  // Now our planner state is explicit Title-cased keys → array
  const [planner, setPlanner] = useState<Record<string, any[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [isAddingAll, setIsAddingAll] = useState(false);

  useEffect(() => {
    async function fetchEverything() {
      // 1) Load user & AI plans
      const user = await getCurrentUser();
      setUserId(user._id!);

      const aiPlans = await getAIPlans(user._id!);
      setSavedPlans(aiPlans);
      if (aiPlans.length) setAiSuggestedPlan(aiPlans[0]);

      // 2) Load manual planner and cast it to our known type
      const manual = (await getManualPlanner(
        user._id!
      )) as ManualPlannerResponse;

      // 3) Convert lowercase keys → Title-case
      const formatted: Record<string, any[]> = {};
      (Object.entries(manual) as [keyof ManualPlannerResponse, any[]][]).forEach(
        ([key, val]) => {
          const title = key.charAt(0).toUpperCase() + key.slice(1);
          formatted[title] = val;
        }
      );

      // 4) Merge into your initial state (so any missing days remain empty arrays)
      setPlanner((prev) => ({ ...prev, ...formatted }));
    }

    fetchEverything();
  }, []);

  const addWorkout = async (day: string, workout: any) => {
    if (!userId) return;
    const current = planner[day] || [];
    const exists = current.some(
      (w) =>
        w.name === workout.name &&
        w.sets === workout.sets &&
        w.reps === workout.reps
    );
    if (!exists) {
      const updated = [...current, workout];
      setPlanner((prev) => ({ ...prev, [day]: updated }));
      try {
        await updatePlannerDay(userId, day.toLowerCase(), updated);
      } catch (err) {
        console.error("Error saving updated planner day", err);
      }
    }
  };

  const removeWorkout = async (day: string, index: number) => {
    if (!userId) return;
    const updated = (planner[day] || []).filter((_, i) => i !== index);
    setPlanner((prev) => ({ ...prev, [day]: updated }));
    try {
      await updatePlannerDay(userId, day.toLowerCase(), updated);
    } catch (err) {
      console.error("Error removing workout", err);
    }
  };

  const handleAddAll = async (day: string) => {
    if (!aiSuggestedPlan?.exercises || isAddingAll || !userId) return;
    setIsAddingAll(true);
    try {
      const current = planner[day] || [];
      const unique = aiSuggestedPlan.exercises.filter((newEx) =>
        !current.some(
          (w) =>
            w.name === newEx.name &&
            w.sets === newEx.sets &&
            w.reps === newEx.reps
        )
      );
      if (unique.length === 0) return;
      const updated = [...current, ...unique];
      setPlanner((prev) => ({ ...prev, [day]: updated }));
      await updatePlannerDay(userId, day.toLowerCase(), updated);
    } catch (err) {
      console.error("Error adding all exercises", err);
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleAIPlanGenerated = (plan: WorkoutPlan) => {
    setAiSuggestedPlan(plan);
  };

  const handleSavePlan = async (plan: WorkoutPlan) => {
    if (!userId || savedPlans.length >= 2) return;
    try {
      await saveAIPlan(userId, plan.cycleName, plan.exercises);
      const plans = await getAIPlans(userId);
      setSavedPlans(plans);
      setAiSuggestedPlan(null);
    } catch (err) {
      console.error("Error saving AI plan", err);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!userId || !planId) return;
    try {
      await deleteAIPlan(userId, planId);
      setSavedPlans((prev) => prev.filter((p) => p._id !== planId));
    } catch (err) {
      console.error("Error deleting plan", err);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🏋️ Workout Planner</h1>

      <WorkoutForm onPlanReady={handleAIPlanGenerated} />

      {aiSuggestedPlan && (
        <WorkoutPlanAccordion
          key="ai-temp"
          plan={aiSuggestedPlan}
          onAddExercise={(ex, day) => addWorkout(day, ex)}
          onAddAll={handleAddAll}
          onSavePlan={() => handleSavePlan(aiSuggestedPlan)}
          canSave={savedPlans.length < 2}
          isSaved={false}
        />
      )}

      {savedPlans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            💾 Saved Plans ({savedPlans.length}/2)
          </h2>
          {savedPlans.map((plan) => (
            <WorkoutPlanAccordion
              key={plan._id}
              plan={plan}
              onAddExercise={(ex, day) => addWorkout(day, ex)}
              onAddAll={handleAddAll}
              onDeletePlan={() => handleDeletePlan(plan._id!)}
              isSaved={true}
            />
          ))}
        </div>
      )}

      <WorkoutPlannerBoard
        planner={planner}
        addWorkout={addWorkout}
        removeWorkout={removeWorkout}
      />
    </div>
  );
}
