// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCurrentUser } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import WeightChart from "@/components/charts/WeightChart";
import BodyFatChart from "@/components/charts/BodyFatChart";
import BmiGaugeChart from "@/components/charts/BmiSemiCircle";
import TodoExercise from "@/components/home/TodoExercise";
import TodoDiet from "@/components/home/TodoDiet";

export default function HomePage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [range, setRange] = useState<"day"|"week"|"month"|"year">("week");

  const [weightData, setWeightData] = useState<any[]>([]);
  const [bodyFatData, setBodyFatData] = useState<any[]>([]);
  const [bmi, setBmi] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1) Fetch user and all three summaries
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        const [wRes, bfRes, intakeRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/weight-data/${userData.id}?range=${range}`),
          axios.get(`http://localhost:5000/api/body-fat-data/${userData.id}?range=${range}`),
          axios.get(`http://localhost:5000/api/intake/today?userId=${userData.id}`),
        ]);
        setWeightData(wRes.data);
        setBodyFatData(bfRes.data);
        setBmi(intakeRes.data?.bmi ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [range]);

  if (!user) {
    return (
      <div className="p-10 flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to ShapeShift 🏋️</h1>
        <p className="text-muted-foreground max-w-xl">
          ShapeShift helps you track your weight, BMI, and body fat. Log in or create an
          account to get started.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/register")}>
            Register
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">📈 Your Progress</h1>

      {/* — Range selector — */}
      <Tabs value={range} onValueChange={setRange}>
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* — Weight — */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Weight</h2>
        <Card>
          <CardContent>
            {weightData.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">No weight data yet.</p>
                <Button onClick={() => router.push("/intake")}>
                  Add Weight Entry
                </Button>
              </div>
            ) : (
              <WeightChart range={range} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* — BMI — */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">BMI</h2>
        <Card>
          <CardContent>
            {bmi === null ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">No BMI data yet.</p>
                <Button onClick={() => router.push("/intake")}>
                  Add BMI Entry
                </Button>
              </div>
            ) : (
              <BmiGaugeChart bmi={bmi} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* — Body Fat — */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Body Fat</h2>
        <Card>
          <CardContent>
            {bodyFatData.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">
                  No body-fat data yet.
                </p>
                <Button onClick={() => router.push("/intake")}>
                  Add Body Fat
                </Button>
              </div>
            ) : (
              <BodyFatChart range={range} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* — Today’s Exercise To-Do — */}
      <TodoExercise userId={user.id} />

      {/* — Today’s Diet To-Do — */}
      <TodoDiet userId={user.id} />
    </div>
  );
}
