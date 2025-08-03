'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface BmiGaugeChartProps {
  bmi?: number;
}

export default function BmiGaugeChart({ bmi }: BmiGaugeChartProps) {
  const isValid = typeof bmi === 'number' && !isNaN(bmi);
  const displayValue = isValid ? Number(bmi!.toFixed(1)) : null;
  const percent = isValid ? Math.min(Math.max(displayValue! / 40, 0), 1) : 0;

  const getCategory = (v: number) => {
    if (v < 18.5) return 'Underweight';
    if (v < 25) return 'Normal';
    if (v < 30) return 'Overweight';
    return 'Obese';
  };
  const category = isValid ? getCategory(displayValue!) : '';

  const data = [
    { name: 'filled', value: percent },
    { name: 'empty',  value: 1 - percent }
  ];

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold mb-2">BMI</h3>

      {isValid ? (
        <>
          <PieChart width={220} height={180} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              cornerRadius={8}
              paddingAngle={2}
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>

          <p className="text-2xl font-bold mt-2">{displayValue}</p>
          <p className="text-sm text-muted-foreground">{category}</p>
        </>
      ) : (
        <p className="text-sm text-center text-muted-foreground">
          No BMI data available.
        </p>
      )}
    </div>
  );
}