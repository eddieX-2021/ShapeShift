"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

export default function WeightChart({ range }: { range: string }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/weight-data/user123?range=${range}`)
      .then((res) => {
        const formatted = res.data.map((d: any) => ({
          date: new Date(d.date).toLocaleDateString(),
          weight: d.weight,
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch weight data:", err);
      });
  }, [range]);

  return (
    <div className="h-[300px] w-full">
      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground border rounded-lg">
          No weight data available for this range.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              fill="url(#weightGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
