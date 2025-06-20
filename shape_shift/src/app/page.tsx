"use client";

import { useState ,useEffect, use} from "react";
import { getCurrentUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightChart from "@/components/charts/WeightChart";
import BodyFatChart from "@/components/charts/BodyFatChart";
import BmiGaugeChart from "@/components/charts/BmiSemiCircle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
export default function HomePage() {
  const [user, setUser] = useState(null);
  const [range, setRange] = useState("week");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } 
    };
    
    fetchUser();
  }, []);
  if (!user) {
    return (
      <div className="p-10 flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to ShapeShift 🏋️</h1>
        <p className="text-muted-foreground max-w-xl">
          ShapeShift helps you track your weight, BMI, and body fat. Log in or create an account to get started.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/register")}>
            Register
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">📈 Your Progress</h1>

      {/* Range Tabs */}
      <Tabs defaultValue="week" onValueChange={setRange}>
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Weight Chart */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Weight</h2>
        <Card>
          <CardContent>
            <WeightChart range={range} />
          </CardContent>
        </Card>
      </div>

      {/* BMI Gauge */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">BMI</h2>
        <Card>
          <CardContent>
            <BmiGaugeChart />
          </CardContent>
        </Card>
        
      </div>

      {/* Body Fat */}
      <div className="rounded-lg border p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Body Fat</h2>
        
        <Card>
          <CardContent>
            <BodyFatChart range={range} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
