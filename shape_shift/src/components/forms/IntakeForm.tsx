"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select, 
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
}from "@/components/ui/select";
import axios from "axios";

export default function IntakeForm() {
    const [submitted, setSubmitted] = useState(false);
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [method, setMethod] = useState<"direct" | "navy" | "">("");

    // Navy inputs
    const [gender, setGender] = useState<"male" | "female" | "">("");
    const [waist, setWaist] = useState("");
    const [neck, setNeck] = useState("");
    const [hips, setHips] = useState("");
    const [height, setHeight] = useState("");

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => { 
        // Check if already submitted today
        axios.get(`/api/intake/check?userId=testUser`).then((res) => {
            if (res.data.completed) setSubmitted(true);
        });
    },[]);

    const handleSubmit = async () => {
        let bodyFatData = undefined;
        let navyData = undefined;
        if (method === "direct") {
            bodyFatData = { bodyFat: parseFloat(bodyFat), date: today };
        } else if (method === "navy") {
            navyData = {
                gender,
                height: Number(height),
                waist: Number(waist),
                neck: Number(neck),
                ...(gender === "female" && hips && { hip: Number(hips) }),
            };
        }
        await axios.post("/api/intake/submit", {
            userId: "testUser", // Replace with actual user ID, fixed after login 
            weight: parseFloat(weight),
            bmi: parseFloat(bmi),
            ...(bodyFatData && { bodyFat: bodyFatData }),
            ...(navyData && { navyInputs: navyData }),
        });

        setSubmitted(true);
    };
    if (submitted) return <div className="text-green-600 text-xl">✅ You’ve completed today’s intake!</div>;

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight */}
        <div className="space-y-2 border rounded p-4">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="Enter weight" />
        </div>

        {/* BMI */}
        <div className="space-y-2 border rounded p-4">
            <Label htmlFor="bmi">BMI</Label>
            <Input value={bmi} onChange={(e) => setBmi(e.target.value)} type="number" placeholder="Enter BMI" />
        </div>

        {/* Body Fat */}
        <div className="space-y-2 border rounded p-4">
            <Label>Body Fat Input Method</Label>
            <Select onValueChange={(val) => setMethod(val as "direct" | "navy")}>
            <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="direct">Manual %</SelectItem>
                <SelectItem value="navy">Navy Estimate</SelectItem>
            </SelectContent>
            </Select>

            {method === "direct" && (
            <>
                <Label>Body Fat (%)</Label>
                <Input value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} type="number" />
            </>
            )}

            {method === "navy" && (
            <>
                <Label>Gender</Label>
                <Select onValueChange={(val) => setGender(val as "male" | "female")}>
                <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                </SelectContent>
                </Select>
                <Label>Height (cm)</Label>
                <Input value={height} onChange={(e) => setHeight(e.target.value)} type="number" />
                <Label>Waist (cm)</Label>
                <Input value={waist} onChange={(e) => setWaist(e.target.value)} type="number" />
                <Label>Neck (cm)</Label>
                <Input value={neck} onChange={(e) => setNeck(e.target.value)} type="number" />
                {gender === "female" && (
                <>
                    <Label>Hips (cm)</Label>
                    <Input value={hips} onChange={(e) => setHips(e.target.value)} type="number" />
                </>
                )}
            </>
            )}
        </div>

        {/* Submit */}
        <div className="col-span-1 md:col-span-3 pt-4">
            <Button type="submit" className="w-full">Submit All Intake</Button>
        </div>
        </form>
    );
}