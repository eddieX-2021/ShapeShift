import WorkoutForm from "@/components/exercise/WorkoutForm";
import WorkoutPlanAccordion from "@/components/exercise/WorkoutPlanAccordion";
import WorkoutPlannerBoard from "@/components/exercise/WorkoutPlannerBoard";

export default function ExercisePage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🏋️ Workout Planner</h1>

      {/* AI Plan Generator */}
      <WorkoutForm />

      {/* AI Plan Display + Auto-Add */}
      <WorkoutPlanAccordion />

      {/* Manual Planner (To-do/Weekly) */}
      <WorkoutPlannerBoard />
    </div>
  );
}
