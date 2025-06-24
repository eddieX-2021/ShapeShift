"use client";
import AddWorkoutToDaysForm from "./AddWorkoutToDaysForm";  
import WorkoutCard from "./WorkoutCard";
import { Button } from "@/components/ui/button";
// In WorkoutPlannerBoard.tsx
export default function WorkoutPlannerBoard({
  planner,
  addWorkout,
  removeWorkout,
}: {
  planner: { [day: string]: any[] };
  addWorkout: (day: string, workout: any) => void;
  removeWorkout: (day: string, index: number) => void;
}) {
  // Define the days in the correct order and casing
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

   const handleAddToDays = (
   workout: { name:string, sets:number, reps:number, description?:string },
   daysArr: string[]
 ) => {
   daysArr.forEach((day) => addWorkout(day, workout));
 };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📆 Your Weekly Planner</h2>
     {/* new custom-add form above your grid */}
     <AddWorkoutToDaysForm onAddToDays={handleAddToDays} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {days.map(day => (
          <div key={day} className="border p-4 rounded-lg shadow bg-muted">
            <h3 className="font-semibold mb-2">{day}</h3>
            {(!planner[day] || planner[day].length === 0) ? (
              <p className="text-sm text-gray-500">No workouts yet.</p>
            ) : (
              <div className="space-y-3">
                {planner[day].map((w, idx) => (
                  <WorkoutCard
                    key={`${day}-${idx}`}
                    {...w}
                    showDelete
                    onDelete={() => removeWorkout(day, idx)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}