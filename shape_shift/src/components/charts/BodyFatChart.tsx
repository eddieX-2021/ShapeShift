'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import { fetchBodyFatData, Range } from '@/lib/api';

interface Props { userId: string; range: Range; }

export default function BodyFatChart({ userId, range }: Props) {
  const [data, setData] = useState<{ date: string; bodyFat: number }[]>([]);

  useEffect(() => {
    console.log('BodyFatChart ➜ useEffect', { userId, range });
    fetchBodyFatData(userId, range)
      .then(d => {
        console.log('BodyFatChart ← data', d);
        setData(d);
      })
      .catch(e => console.error('BodyFatChart error', e));
  }, [userId, range]);

  if (!data.length) {
    return <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground border rounded-lg">No body-fat data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="5 5"/>
        <XAxis dataKey="date"/>
        <YAxis domain={[0,50]}/>
        <Tooltip/>
        <Line type="monotone" dataKey="bodyFat" stroke="#10b981" strokeWidth={2}/>
      </LineChart>
    </ResponsiveContainer>
  );
}
