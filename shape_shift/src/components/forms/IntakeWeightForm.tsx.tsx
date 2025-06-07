"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const intakeSchema = z.object({
  weight: z.number().min(1),
  height: z.number().optional(),
  goal: z.enum(["lose", "maintain", "gain"]),
  activity: z.enum(["low", "moderate", "high"]),
});

type IntakeData = z.infer<typeof intakeSchema>;

export function IntakeForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IntakeData>({
    resolver: zodResolver(intakeSchema),
  });

  const onSubmit = (data: IntakeData) => {
    console.log("Submitted intake:", data);
    // TODO: Send to backend API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div>
        <Label>Weight (kg)</Label>
        <Input type="number" {...register("weight", { valueAsNumber: true })} />
        {errors.weight && <p className="text-sm text-red-500">Weight is required</p>}
      </div>

      <div>
        <Label>Height (cm)</Label>
        <Input type="number" {...register("height", { valueAsNumber: true })} />
      </div>

      <div>
        <Label>Goal</Label>
        <Select onValueChange={(val) => setValue("goal", val as any)}>
          <SelectTrigger>{watch("goal") || "Select goal"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="lose">Lose Weight</SelectItem>
            <SelectItem value="maintain">Maintain</SelectItem>
            <SelectItem value="gain">Gain Muscle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Activity Level</Label>
        <Select onValueChange={(val) => setValue("activity", val as any)}>
          <SelectTrigger>{watch("activity") || "Select activity level"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
