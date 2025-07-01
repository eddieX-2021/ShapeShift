// components/diet/MealSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import {
  getMealSuggestions,
  MealSection,
} from '@/lib/api';

interface MealSearchProps {
  onAdd: (section: MealSection, name: string) => void;
}

export default function MealSearch({ onAdd }: MealSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<MealSection>(
    'breakfast'
  );

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const list = await getMealSuggestions(query);
        setSuggestions(list);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">🔍 Search Meals</h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Type to search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          value={section}
          onValueChange={(v) =>
            setSection(v as MealSection)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">
              Breakfast
            </SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snacks">Snacks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading…
        </p>
      )}

      <div className="grid grid-cols-1 gap-3">
        {suggestions.map((name, i) => (
          <div
            key={i}
            className="flex justify-between items-center border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-medium">{name}</span>
            <Button
              size="sm"
              onClick={() => onAdd(section, name)}
            >
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
