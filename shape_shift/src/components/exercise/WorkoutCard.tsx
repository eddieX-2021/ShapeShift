"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type WorkoutCardProps = {
  name: string;
  sets: number | string;
  reps: number | string;
  description?: string;
  onAdd?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
};

export default function WorkoutCard({ 
  name, 
  sets, 
  reps, 
  description, 
  onAdd,
  showDelete = false,
  onDelete 
}: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-xl p-4 shadow bg-white hover:shadow-md transition relative">
      <div className="flex justify-between items-start">
        <button 
          className="text-lg font-semibold text-left flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {name}
        </button>
        <div className="flex gap-2">
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              ➕ Add
            </Button>
          )}
        </div>
      </div>

      {/* Animation wrapper around the expandable content */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
        <div className="space-y-2 pt-2"> {/* Added pt-2 for spacing when expanded */}
          <p className="text-sm text-muted-foreground">
            <strong>Sets:</strong> {sets} &nbsp;&nbsp;&nbsp;
            <strong>Reps:</strong> {reps}
          </p>

          {description && (
            <p className="text-sm text-gray-700 leading-snug">
              {description}
            </p>
          )}
        </div>
      </div>

      {showDelete && onDelete && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onDelete}
        >
          🗑️
        </Button>
      )}
    </div>
  );
}