"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import type { Range } from "@/lib/api";

import WeightChart from "@/components/charts/WeightChart";
import BodyFatChart from "@/components/charts/BodyFatChart";
import BmiSemiCircle from "@/components/charts/BmiSemiCircle";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ choose from: "day" | "week" | "month" | "year"
  const range: Range = "month";

  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUserId(u?.id ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!userId) return <div className="p-8 text-gray-600">Please log in.</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track your progress and stay consistent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-xl p-4 bg-white shadow-sm">
          <h2 className="font-semibold mb-3">BMI</h2>
          {/* ✅ This component does NOT accept userId */}
          <BmiSemiCircle />
        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm lg:col-span-2">
          <h2 className="font-semibold mb-3">Weight Trend</h2>
          <WeightChart userId={userId} range={range} />
        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm lg:col-span-3">
          <h2 className="font-semibold mb-3">Body Fat</h2>
          <BodyFatChart userId={userId} range={range} />
        </div>
      </div>
    </div>
  );
}
