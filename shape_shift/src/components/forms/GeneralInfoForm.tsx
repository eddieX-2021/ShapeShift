"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

export function GeneralInfoForm() {
  const [formData, setFormData] = useState({
    gender: "",
    height: "",
    goal: "",
  });

  useEffect(() => {
    // Optional: fetch existing user profile settings
    axios.get("/api/user-info").then(res => setFormData(res.data));
  }, []);

  const handleSubmit = async () => {
    await axios.post("/api/save-user-info", formData);
  };

  return (
    <div className="rounded-lg border p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold">General Info</h2>

      <div>
        <Label>Gender</Label>
        <Select onValueChange={(val) => setFormData({ ...formData, gender: val })} defaultValue={formData.gender}>
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
        />
      </div>


      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
}
