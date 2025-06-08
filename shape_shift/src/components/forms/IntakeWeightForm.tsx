"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

export function IntakeWeightForm() {
  const [weight, setWeight] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // fetch if already submitted today (mocked)
    const today = new Date().toISOString().split("T")[0];
    axios.get(`/api/check-weight?date=${today}`).then((res) => {
      if (res.data.exists) setSubmitted(true);
    });
  }, []);

  const handleSubmit = async () => {
    await axios.post("/api/log-weight", {
      weight: parseFloat(weight),
      date: new Date().toISOString().split("T")[0],
    });
    setSubmitted(true);
  };

  if (submitted) return <p className="text-green-600">✅ Weight logged today!</p>;

  return (
    <div className="space-y-4">
      <Label htmlFor="weight">Weight (kg)</Label>
      <Input
        id="weight"
        type="number"
        placeholder="Enter weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
