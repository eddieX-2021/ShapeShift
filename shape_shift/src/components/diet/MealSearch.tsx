'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MealSearchProps {
  onAdd: (section: 'breakfast' | 'lunch' | 'dinner' | 'snacks', name: string) => void;
}

const staticMeals = [
  'Grilled Chicken',
  'Oatmeal',
  'Tuna Salad',
  'Avocado Toast',
  'Smoothie',
];

export default function MealSearch({ onAdd }: MealSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = staticMeals.filter((m) =>
    m.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">🔍 Search Meals</h2>
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-2">
        {filtered.map((name, i) => (
          <div key={i} className="flex justify-between items-center border p-2 rounded">
            <div>{name}</div>
            <Button size="sm" onClick={() => onAdd('breakfast', name)}>
              Add to Breakfast
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}