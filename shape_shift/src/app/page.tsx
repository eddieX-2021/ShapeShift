"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  fetchWeightData,
  fetchBodyFatData,
  fetchTodayIntake,
} from "@/lib/api";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import WeightChart from "@/components/charts/WeightChart";
import BodyFatChart from "@/components/charts/BodyFatChart";
import BmiGaugeChart from "@/components/charts/BmiSemiCircle";
import TodoExercise from "@/components/home/TodoExercise";
import TodoDiet from "@/components/home/TodoDiet";
import type { Range } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(
    null
  );
  const [range, setRange] = useState<Range>("week");
  const [weightData, setWeightData] = useState<
    { date: string; weight: number }[]
  >([]);
  const [bodyFatData, setBodyFatData] = useState<
    { date: string; bodyFat: number }[]
  >([]);
  const [bmi, setBmi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const u = await getCurrentUser();
        setUser(u);
        const [w, f, t] = await Promise.all([
          fetchWeightData(u.id, range),
          fetchBodyFatData(u.id, range),
          fetchTodayIntake(u.id),
        ]);
        setWeightData(w);
        setBodyFatData(f);
        setBmi(t.bmi ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  if (!user) {
    return (
      <div className="p-10 text-center space-y-8">
        <h1 className="text-4xl font-bold">Welcome to ShapeShift 🏋️</h1>
        <div className="mt-8 flex justify-center gap-6">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Your AI-powered fitness assistant: track progress, plan
          workouts, and eat healthier.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="flex flex-col items-center">
              <div className="relative h-32 w-full mb-4 rounded overflow-hidden">
                <Image
                  src="/stat.jpg"
                  alt="Track Progress"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Log weight, BMI & body fat over time.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="flex flex-col items-center">
              <div className="relative h-32 w-full mb-4 rounded overflow-hidden">
                <Image
                  src="/workout.jpg"
                  alt="AI Workout"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI Workout Plans
              </h3>
              <p className="text-sm text-muted-foreground">
                Get personalized AI-generated workouts.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow hover:shadow-lg transition">
            <CardContent className="flex flex-col items-center">
              <div className="relative h-32 w-full mb-4 rounded overflow-hidden">
                <Image
                  src="/food.jpg"
                  alt="Nutrition Planner"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Diet & Nutrition
              </h3>
              <p className="text-sm text-muted-foreground">
                Plan meals & analyze macros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-semibold">
        Welcome, {user.name}!
      </h1>

      <Tabs
        value={range}
        onValueChange={(v) => setRange(v as Range)}
      >
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Weight</h2>
        <Card>
          <CardContent>
            {weightData.length === 0 ? (
              <Button onClick={() => router.push("/intake")}>
                Add Weight Entry
              </Button>
            ) : (
              <WeightChart userId={user.id} range={range} />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">
          Body Fat
        </h2>
        <Card>
          <CardContent>
            {bodyFatData.length === 0 ? (
              <Button onClick={() => router.push("/intake")}>
                Add Body Fat
              </Button>
            ) : (
              <BodyFatChart userId={user.id} range={range} />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">BMI</h2>
        <Card>
          <CardContent>
            {bmi === null ? (
              <Button onClick={() => router.push("/intake")}>
                Add BMI Entry
              </Button>
            ) : (
              <BmiGaugeChart bmi={bmi} />
            )}
          </CardContent>
        </Card>
      </section>

      <TodoExercise userId={user.id} />
      <TodoDiet userId={user.id} />
    </div>
  );
}
