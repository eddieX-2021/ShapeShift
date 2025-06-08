"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FoodUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = () => {
    if (!file) return;
    setTimeout(() => {
      setResult("🍕 Detected: Pizza — 300 kcal");
    }, 1000);
  };

  return (
    <div className="border rounded-lg p-4 shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold">📸 Food Scanner</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload} disabled={!file}>Analyze</Button>
      {result && <p className="text-sm text-green-600">{result}</p>}
    </div>
  );
}
