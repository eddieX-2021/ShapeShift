// components/diet/CustomMealForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { MealSection, MealItem, Meals } from '@/lib/api';
import { addCustomMeal } from '@/lib/api';

interface CustomMealFormProps {
  userId: string;
  onAdded: (meals: Meals) => void;
}

export default function CustomMealForm({
  userId,
  onAdded,
}: CustomMealFormProps) {
  const [section, setSection] = useState<MealSection>('breakfast');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const item: MealItem = {
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      description,
    };

    try {
      const meals = await addCustomMeal(userId, section, item);
      onAdded(meals);
    } catch (err) {
      console.error('Add custom meal failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-6 bg-white space-y-4 shadow"
    >
          <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">Add Custom Meal</h3>
    {/* now rely only on the top-right ✕ */}
  </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          value={section}
          onValueChange={(v) => setSection(v as MealSection)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snacks">Snacks</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          placeholder="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
        <Input
          placeholder="Protein (g)"
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          required
        />

        <Input
          placeholder="Carbs (g)"
          type="number"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          required
        />
        <Input
          placeholder="Fats (g)"
          type="number"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
          required
        />

        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="sm:col-span-2"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding…' : 'Add Meal'}
      </Button>
    </form>
  );
}
