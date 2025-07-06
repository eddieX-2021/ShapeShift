'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  getCurrentUser,
  fetchWeightData,
  fetchBodyFatData,
  fetchTodayIntake,
} from '@/lib/api';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent }          from '@/components/ui/card';
import { Button }                     from '@/components/ui/button';
import { Skeleton }                   from '@/components/ui/skeleton';

import WeightChart   from '@/components/charts/WeightChart';
import BodyFatChart  from '@/components/charts/BodyFatChart';
import BmiGaugeChart from '@/components/charts/BmiSemiCircle';
import TodoExercise  from '@/components/home/TodoExercise';
import TodoDiet      from '@/components/home/TodoDiet';
import type { Range } from '@/lib/api';

export default function HomePage() {
  const [user, setUser]     = useState<{ id: string; name: string } | null>(null);
  const [range, setRange]   = useState<Range>('week');
  const [weightData, setWeightData]   = useState<any[]>([]);
  const [bodyFatData, setBodyFatData] = useState<any[]>([]);
  const [bmi, setBmi]       = useState<number|null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Whenever `range` changes, reload all three
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

  // If not logged in
  if (!user) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold">Welcome to ShapeShift 🏋️</h1>
        <p className="text-muted-foreground">Please log in or register to continue.</p>
        <div className="mt-4 flex gap-4 justify-center">
          <Button onClick={() => router.push('/login')}>Login</Button>
          <Button variant="outline" onClick={() => router.push('/register')}>Register</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="p-6 space-y-10">
      {/* 1) Personalized greeting */}
      <h1 className="text-3xl font-semibold">Welcome, {user.name}!</h1>

      {/* 2) Tabs controlling all three charts */}
      <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Weight Chart */}
      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Weight</h2>
        <Card>
          <CardContent>
            {weightData.length === 0
              ? <Button onClick={() => router.push('/intake')}>Add Weight Entry</Button>
              : <WeightChart userId={user.id} range={range} />
            }
          </CardContent>
        </Card>
      </section>

      {/* Body-Fat Chart */}
      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Body Fat</h2>
        <Card>
          <CardContent>
            {bodyFatData.length === 0
              ? <Button onClick={() => router.push('/intake')}>Add Body Fat</Button>
              : <BodyFatChart userId={user.id} range={range} />
            }
          </CardContent>
        </Card>
      </section>

      {/* BMI Gauge moved below Body-Fat */}
      <section className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">BMI</h2>
        <Card>
          <CardContent>
            {bmi === null
              ? <Button onClick={() => router.push('/intake')}>Add BMI Entry</Button>
              : <BmiGaugeChart bmi={bmi} />
            }
          </CardContent>
        </Card>
      </section>

      {/* To-Do Lists */}
      <TodoExercise userId={user.id} />
      <TodoDiet     userId={user.id} />
    </div>
  );
}
