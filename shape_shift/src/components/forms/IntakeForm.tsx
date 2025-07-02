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

import {
  checkIntake,
  submitIntakeEntry,
  IntakePayload,
  NavyInputs,
} from "@/lib/api";

export default function IntakeForm() {
  const [submitted, setSubmitted] = useState(false);

  // form state
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [method, setMethod] = useState<"direct" | "navy" | "">("");
  const [bodyFat, setBodyFat] = useState("");

  // navy inputs
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hips, setHips] = useState("");

  const userId = "testUser"; // replace with your auth logic

  // Poll on mount + every 60s
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const done = await checkIntake(userId);
        if (mounted) setSubmitted(done);
      } catch (e) {
        console.error("checkIntake failed", e);
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [userId]);

  const handleSubmit = async () => {
    const base: IntakePayload = {
      userId,
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
    };

    const payload: IntakePayload =
      method === "direct"
        ? { ...base, bodyFat }
        : {
            ...base,
            navyInputs: {
              gender,
              height: Number(height),
              waist: Number(waist),
              neck: Number(neck),
              ...(gender === "female" ? { hip: Number(hips) } : {}),
            } as NavyInputs,
          };

    try {
      const { message } = await submitIntakeEntry(payload);
      console.log(message);
      setSubmitted(true);
    } catch (e) {
      console.error("submitIntakeEntry failed", e);
    }
  };

  if (submitted) {
    return (
      <div className="text-green-600 text-lg">
        ✅ You’ve completed today’s intake!
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Weight */}
      <div className="space-y-2 border rounded p-4">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {/* BMI */}
      <div className="space-y-2 border rounded p-4">
        <Label htmlFor="bmi">BMI</Label>
        <Input
          id="bmi"
          type="number"
          placeholder="Enter BMI"
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
        />
      </div>

      {/* Body Fat */}
      <div className="space-y-2 border rounded p-4">
        <Label>Body Fat Input Method</Label>
        <Select onValueChange={(v) => setMethod(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="direct">Manual %</SelectItem>
            <SelectItem value="navy">Navy Estimate</SelectItem>
          </SelectContent>
        </Select>

        {method === "direct" && (
          <>
            <Label>Body Fat (%)</Label>
            <Input
              type="number"
              step="any"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </>
        )}

        {method === "navy" && (
          <>
            <Label>Gender</Label>
            <Select onValueChange={(v) => setGender(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Label>Height (cm)</Label>
            <Input
              type="number"
              step="any"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />

            <Label>Waist (cm)</Label>
            <Input
              type="number"
              step="any"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />

            <Label>Neck (cm)</Label>
            <Input
              type="number"
              step="any"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
            />

            {gender === "female" && (
              <>
                <Label>Hips (cm)</Label>
                <Input
                  type="number"
                  step="any"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Submit */}
      <div className="col-span-1 md:col-span-3 pt-4">
        <Button type="submit" className="w-full">
          Submit All Intake
        </Button>
      </div>
    </form>
  );
}
