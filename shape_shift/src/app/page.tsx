"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightChart from "@/components/charts/WeightChart";
import BodyFatChart from "@/components/charts/BodyFatChart";
import BmiGaugeChart from "@/components/charts/BmiSemiCircle";
import { Card, CardContent } from "@/components/ui/card";
export default function HomePage() {
  const [range, setRange] = useState("week");

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
