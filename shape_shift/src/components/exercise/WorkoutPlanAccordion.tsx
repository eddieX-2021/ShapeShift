"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import WorkoutCard from "./WorkoutCard";
import type { Exercise } from "@/type/exercise";

interface WorkoutPlanAccordionProps {
  plan: { cycleName: string; exercises: Exercise[] };
  onAddAll?: (day: string) => void;
  onAddExercise?: (exercise: Exercise, day: string) => void;
  onSavePlan?: () => void;
  onDeletePlan?: () => void;
  canSave?: boolean;
  isSaved?: boolean;
}

export default function WorkoutPlanAccordion({
  plan,
  onAddAll,
  onAddExercise,
  onSavePlan,
  onDeletePlan,
  canSave = true,
  isSaved = false,
}: WorkoutPlanAccordionProps) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!plan || !Array.isArray(plan.exercises)) return null;

  // Keep reps as number; only clean up name & description strings
  const exercises: Exercise[] = plan.exercises.map((exercise) => ({
    ...exercise,
    name: exercise.name
      .replace(/Sets$/i, "")
      .replace(/^\d+\.\s*/, "")
      .trim(),
    description: exercise.description
      ? exercise.description.replace(/^\*\*\s*/, "").trim()
      : undefined,
  }));

  const toggleExpand = () => setIsExpanded((open) => !open);

  const handleAddAll = () => {
    if (!onAddAll) return;
    const day = selectedDay.charAt(0).toUpperCase() +
      selectedDay.slice(1).toLowerCase();
    onAddAll(day);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className="h-8 w-8"
          >
            {isExpanded ? "▼" : "►"}
          </Button>
          <h2 className="text-xl font-semibold">
            {isSaved ? "💾" : "💡"} {plan.cycleName}
          </h2>
        </div>
        <div className="flex gap-2">
          {isSaved && onDeletePlan && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeletePlan}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {!isSaved && onSavePlan && (
            <Button
              onClick={onSavePlan}
              disabled={!canSave}
              variant={canSave ? "default" : "secondary"}
            >
              {canSave ? "Save Plan" : "Max Plans Saved (2/2)"}
            </Button>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddAll}>
              ➕ Add All to {selectedDay}
            </Button>
          </div>

          <div className="grid gap-3">
            {exercises.map((ex, idx) => (
              <WorkoutCard
                key={idx}
                {...ex}
                onAdd={() =>
                  onAddExercise?.(
                    ex,
                    selectedDay.toLowerCase()
                  )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
