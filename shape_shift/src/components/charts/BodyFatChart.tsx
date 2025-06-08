"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function BodyFatChart({ range }: { range: string }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/body-fat-data/user123?range=${range}`).then((res) => {
      const formatted = res.data.map((d: any) => ({
        date: new Date(d.date).toLocaleDateString(),
        bodyFat: d.body_fat,
      }));
      setData(formatted);
    });
  }, [range]);

  return (
    <div className="h-[300px] w-full">
      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground border rounded-lg">
          No body fat data available for this range.
        </div>
      ) : (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 50]} />
        <Tooltip />
        <Line type="monotone" dataKey="bodyFat" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
    )}
    </div>
  );
}
