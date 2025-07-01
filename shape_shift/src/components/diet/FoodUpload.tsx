// components/diet/FoodUpload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function FoodUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/scan',
        form
      );
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">
        📸 Food Scanner
      </h2>
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />
      <Button
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </Button>

      {result && (
        <div className="border p-4 rounded-lg bg-gray-50 space-y-2 mt-4">
          <h3 className="font-semibold text-lg">
            {result.name}
          </h3>
          <p className="text-sm text-gray-700">
            {result.calories} kcal • {result.protein}g P •{' '}
            {result.carbs}g C • {result.fats}g F
          </p>
          <p className="text-sm text-muted-foreground">
            Serving: {result.servingQty}{' '}
            {result.servingUnit}
          </p>
        </div>
      )}
    </div>
  );
}
