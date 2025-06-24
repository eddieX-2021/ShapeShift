"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import WorkoutCard from "./WorkoutCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function WorkoutPlanAccordion({
  plan,
  onAddAll,
  onAddExercise,
  onSavePlan,
  onDeletePlan,
  canSave = true,
  isSaved = false,
  planIndex,
}: {
  plan: any;
  onAddAll?: (day: string) => void;
  onAddExercise?: (exercise: any, day: string) => void;
  onSavePlan?: () => void;
  onDeletePlan?: () => void;
  canSave?: boolean;
  isSaved?: boolean;
  planIndex?: number;
}) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!plan || !Array.isArray(plan.exercises)) return null;

  const exercises = plan.exercises.map((ex: any) => ({
    ...ex,
    name: ex.name?.replace(/Sets$/i, "").replace(/^\d+\.\s*/, "").trim(),
    reps: String(ex.reps || "").replace(/^\*\*\s*/, "").trim(),
    description: String(ex.description || "").replace(/^\*\*\s*/, "").trim(),
  }));

  const handleAddAll = () => {
  if (onAddAll) {
    const formattedDay = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1).toLowerCase();
    onAddAll(formattedDay);
  }
};

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 shadow bg-white">
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
            {isSaved ? "💾 " : "💡 "}
            {plan.cycleName}
          </h2>
        </div>

        <div className="flex gap-2">
          {isSaved && onDeletePlan && (
            <Button variant="destructive" size="sm" onClick={onDeletePlan}>
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

      {isExpanded && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddAll}>➕ Add All to {selectedDay}</Button>
          </div>

          <div className="grid gap-3">
            {exercises.map((ex: any, idx: number) => (
              <WorkoutCard
                key={idx}
                {...ex}
                onAdd={() => onAddExercise?.(ex, selectedDay.toLowerCase())}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
