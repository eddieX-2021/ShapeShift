'use client';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchWeightData, Range } from '@/lib/api';

interface Props { userId: string; range: Range; }

export default function WeightChart({ userId, range }: Props) {
  const [data, setData] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    console.log('WeightChart ➜ useEffect', { userId, range });
    fetchWeightData(userId, range)
      .then(d => {
        console.log('WeightChart ← data', d);
        setData(d);
      })
      .catch(e => console.error('WeightChart error', e));
  }, [userId, range]);

  if (!data.length) {
    return <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground border rounded-lg">No weight data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip/>
        <Area type="monotone" dataKey="weight" stroke="#3b82f6" fill="url(#weightGrad)" strokeWidth={2}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}
