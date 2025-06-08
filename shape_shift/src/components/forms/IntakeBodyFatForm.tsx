"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// ✅ Validation schema (combined for both methods)
const combinedSchema = z
  .object({
    method: z.enum(["direct", "navy"]),
    bodyFat: z.coerce.number().optional(),
    gender: z.enum(["male", "female"]).optional(),
    height: z.coerce.number().optional(),
    waist: z.coerce.number().optional(),
    neck: z.coerce.number().optional(),
    hips: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "direct") {
      if (data.bodyFat === undefined || data.bodyFat < 1 || data.bodyFat > 50) {
        ctx.addIssue({
          path: ["bodyFat"],
          code: z.ZodIssueCode.custom,
          message: "Body fat must be between 1–50%",
        });
      }
    }

    if (data.method === "navy") {
      const requiredFields = ["gender", "height", "waist", "neck"] as const;
      requiredFields.forEach((f) => {
        if (!data[f]) {
          ctx.addIssue({
            path: [f],
            code: z.ZodIssueCode.custom,
            message: `${f} is required`,
          });
        }
      });

      if (data.gender === "female" && !data.hips) {
        ctx.addIssue({
          path: ["hips"],
          code: z.ZodIssueCode.custom,
          message: "Hips are required for females",
        });
      }
    }
  });

type FormData = z.infer<typeof combinedSchema>;

export function IntakeBodyFatForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"direct" | "navy" | "">("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      method: undefined,
      bodyFat: undefined,
      gender: undefined,
      height: undefined,
      waist: undefined,
      neck: undefined,
      hips: undefined,
    },
  });

  const gender = watch("gender");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    axios.get(`/api/check-body-fat?date=${today}`).then((res) => {
      if (res.data.exists) setSubmitted(true);
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    await axios.post("/api/log-body-fat", {
      ...data,
      date: new Date().toISOString().split("T")[0],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-green-600">✅ Body Fat logged today!</p>;
  }

  return (
    <div className="space-y-4">
      <Label>Choose Method</Label>
      <Select
        onValueChange={(val) => {
          setSelectedMethod(val as "direct" | "navy");
          setValue("method", val as "direct" | "navy");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="direct">Direct Body Fat (%)</SelectItem>
          <SelectItem value="navy">Navy Method Estimate</SelectItem>
        </SelectContent>
      </Select>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {selectedMethod === "direct" && (
          <>
            <Label htmlFor="bodyFat">Body Fat (%)</Label>
            <Input type="number" {...register("bodyFat")} placeholder="e.g. 18.5" />
            {errors.bodyFat && (
              <p className="text-sm text-red-500">{errors.bodyFat.message}</p>
            )}
          </>
        )}

        {selectedMethod === "navy" && (
          <>
            <Label>Gender</Label>
            <Select
              onValueChange={(val) => setValue("gender", val as "male" | "female")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}

            <Label htmlFor="height">Height (cm)</Label>
            <Input type="number" {...register("height")} />
            {errors.height && (
              <p className="text-sm text-red-500">{errors.height.message}</p>
            )}

            <Label htmlFor="waist">Waist (cm)</Label>
            <Input type="number" {...register("waist")} />
            {errors.waist && (
              <p className="text-sm text-red-500">{errors.waist.message}</p>
            )}

            <Label htmlFor="neck">Neck (cm)</Label>
            <Input type="number" {...register("neck")} />
            {errors.neck && (
              <p className="text-sm text-red-500">{errors.neck.message}</p>
            )}

            {gender === "female" && (
              <>
                <Label htmlFor="hips">Hips (cm)</Label>
                <Input type="number" {...register("hips")} />
                {errors.hips && (
                  <p className="text-sm text-red-500">{errors.hips.message}</p>
                )}
              </>
            )}
          </>
        )}

        {selectedMethod && <Button type="submit">Submit</Button>}
      </form>
    </div>
  );
}
