// BodyFatChart.tsx
'use client';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import { fetchBodyFatData, Range } from '@/lib/api';

interface RawPoint { date: string; bodyFat: number }
interface Point    { date: string; bodyFat: number | null }

export default function BodyFatChart({ userId, range }: { userId: string; range: Range }) {
  const [rawData, setRawData] = useState<RawPoint[]>([]);
  const [data,    setData   ] = useState<Point[]>([]);

  useEffect(() => {
    fetchBodyFatData(userId, range)
      .then(setRawData)
      .catch(console.error);
  }, [userId, range]);

  useEffect(() => {
    if (!rawData.length) {
      setData([]);
      return;
    }
    let start = moment().startOf('day');
    switch (range) {
      case 'day':   start = start;                      break;
      case 'week':  start = start.subtract(7,'days');  break;
      case 'month': start = start.subtract(1,'month'); break;
      case 'year':  start = start.subtract(1,'year');  break;
    }
    const days: moment.Moment[] = [];
    const end = moment().startOf('day');
    let cur = start.clone();
    while (cur <= end) {
      days.push(cur.clone());
      cur.add(1, 'day');
    }
    const lookup = new Map(
      rawData.map(p => [moment(p.date).format('YYYY-MM-DD'), p.bodyFat])
    );
    const filled = days.map(d => {
      const key = d.format('YYYY-MM-DD');
      return {
        date:    d.format('MM/DD'),
        bodyFat: lookup.has(key) ? lookup.get(key)! : null
      };
    });
    setData(filled);
  }, [rawData, range]);

  if (!data.length) {
    return <p className="text-sm italic text-gray-500">No body‐fat history yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 'auto']} />
        <Tooltip />
        <Line
          type="monotone"      // smooth curves
          dataKey="bodyFat"
          stroke="#10B981"
          strokeWidth={2}
          dot={false}
          connectNulls         // connect across null days
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
