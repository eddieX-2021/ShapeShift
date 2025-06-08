"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import WorkoutCard from "./WorkoutCard";
import { Button } from "@/components/ui/button";

const samplePlan = [
  {
    day: "Day 1",
    exercises: [
      { name: "Pushups", sets: 3, reps: 12 },
      { name: "Squats", sets: 4, reps: 15 },
    ],
  },
  {
    day: "Day 2",
    exercises: [
      { name: "Plank", sets: 3, reps: 60 }, // seconds
      { name: "Lunges", sets: 3, reps: 12 },
    ],
  },
];

export default function WorkoutPlanAccordion({ onAddAll }: { onAddAll?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">💡 AI Suggested Plan</h2>
        {onAddAll && <Button onClick={onAddAll}>➕ Add All to Planner</Button>}
      </div>

      <Accordion type="multiple">
        {samplePlan.map((day, i) => (
          <AccordionItem key={i} value={`day-${i}`}>
            <AccordionTrigger>{day.day}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3">
                {day.exercises.map((ex, idx) => (
                  <WorkoutCard key={idx} {...ex} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
