// WeightChart.tsx
'use client';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchWeightData, Range } from '@/lib/api';

interface RawPoint { date: string; weight: number }
interface Point    { date: string; weight: number | null }

export default function WeightChart({ userId, range }: { userId: string; range: Range }) {
  const [rawData, setRawData] = useState<RawPoint[]>([]);
  const [data,    setData   ] = useState<Point[]>([]);

  // 1) fetch only the points the user logged
  useEffect(() => {
    fetchWeightData(userId, range)
      .then(d => {
      console.log('WeightChart ← data', d);  // ← this tells you if the backend actually returned entries
      setRawData(d);
    })
      .catch(console.error);
  }, [userId, range]);

  // 2) expand to a full series, marking missing days as `null`
  useEffect(() => {
    if (!rawData.length) {
      setData([]); 
      return;
    }

    // compute the start of the window
    let start = moment().startOf('day');
    switch (range) {
      case 'day':   start = start;                            break;
      case 'week':  start = start.subtract(7, 'days');        break;
      case 'month': start = start.subtract(1, 'month');       break;
      case 'year':  start = start.subtract(1, 'year');        break;
    }

    // build every day in [start, today]
    const days: moment.Moment[] = [];
    const end = moment().startOf('day');
    const cursor = start.clone();
    while (cursor <= end) {
      days.push(cursor.clone());
      cursor.add(1, 'day');
    }

    // map rawData by YYYY-MM-DD for quick lookup
    const lookup = new Map(
      rawData.map(p => [moment(p.date).format('YYYY-MM-DD'), p.weight])
    );

    // build final array
    const filled = days.map(d => {
      const key = d.format('YYYY-MM-DD');
      return {
        date:   d.format('MM/DD'),
        weight: lookup.has(key) ? lookup.get(key)! : null
      };
    });

    setData(filled);
  }, [rawData, range]);

  // If truly no historic data at all, fall back to a friendly message:
  if (!data.length) {
    return <p className="text-sm italic text-gray-500">No weight history yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto','auto']} />
        <Tooltip />
        <Area
          type="monotone"        // smooth curves
          dataKey="weight"
          stroke="#3b82f6"
          fill="url(#weightGrad)"
          strokeWidth={2}
          connectNulls            // connect across the nulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
