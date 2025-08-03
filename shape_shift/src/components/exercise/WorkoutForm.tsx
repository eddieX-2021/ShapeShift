"use client";

import { useState } from "react";
import { generateWorkoutPlan } from "@/lib/api"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
type GeneratedPlan = {
  cycleName: string;
  exercises: { name: string; sets: number; reps: number; description?: string }[];
};
export default function WorkoutForm({onPlanReady,}: { onPlanReady: (plan: GeneratedPlan) => void;}) {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generateWorkoutPlan(goal, level, parseInt(duration));
      console.log("Generated Plan:", data.plan);
      onPlanReady(data.plan);
    }catch (error) {
      console.error("Error generating workout plan:", error);
      alert("Failed to generate workout plan. Please try again.");
    }finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 shadow">
      <h2 className="text-xl font-semibold">AI Workout Generator</h2>

      <Select onValueChange={setGoal}>
        <SelectTrigger><SelectValue placeholder="Select your goal" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="lose_fat">Lose Fat</SelectItem>
          <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
          <SelectItem value="maintain">Maintain</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setLevel}>
        <SelectTrigger><SelectValue placeholder="Fitness level" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      <Input type="number" placeholder="Workout duration (mins)" onChange={(e) => setDuration(e.target.value)} />

      <Button onClick={handleGenerate} disabled= {loading}>{loading ? "Generating..." : "Generate Plan"}</Button>
    </div>
  );
}
