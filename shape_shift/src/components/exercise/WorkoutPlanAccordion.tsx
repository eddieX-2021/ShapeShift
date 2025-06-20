"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import WorkoutCard from "./WorkoutCard";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function WorkoutPlanAccordion({
  plan,
  onAddAll,
  onAddExercise,
}: {
  plan: any;
  onAddAll?: () => void;
  onAddExercise?: (exercise: any, day: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState("Monday");

  if (!plan || !Array.isArray(plan.exercises)) return null;

  const exercises = plan.exercises.map((ex: any) => ({
    ...ex,
    name: ex.name?.replace(/Sets$/i, "").replace(/^\d+\.\s*/, "").trim(),
    reps: ex.reps?.replace(/^\*\*\s*/, "").trim(),
    description: ex.description?.replace(/^\*\*\s*/, "").trim(),
  }));

  const handleAddAll = () => {
    if (!onAddExercise) return;
    exercises.forEach((ex: any) => onAddExercise(ex, selectedDay));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          💡 AI Suggested Plan — {plan.cycleName}
        </h2>
        <div className="flex items-center gap-2">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddAll}>➕ Add All to {selectedDay}</Button>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="day-1">
          <AccordionTrigger>Recommended Exercises</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3">
              {exercises.map((ex: any, idx: number) => (
                <WorkoutCard
                  key={idx}
                  {...ex}
                  onAdd={() => onAddExercise?.(ex, selectedDay)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
