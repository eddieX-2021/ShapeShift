"use client";

export default function BmiGaugeChart({ bmi }: { bmi?: number }) {
  const isValid = typeof bmi === "number" && !isNaN(bmi);
  const percent = isValid ? Math.min(Math.max(bmi! / 40, 0), 1) : 0;
  const angle = 180 * percent;
  const radius = 100;
  const x = radius + radius * Math.cos(Math.PI * (1 - percent));
  const y = radius - radius * Math.sin(Math.PI * (1 - percent));

  const category = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="h-[300px] w-full">
      {!isValid ? (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground border rounded-lg">
          No BMI data available.
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg width="220" height="120">
            <path
              d="M 10 110 A 100 100 0 0 1 210 110"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            <path
              d={`M 10 110 A 100 100 0 ${angle > 180 ? 1 : 0} 1 ${x} ${y}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="20"
            />
          </svg>
          <div className="text-center mt-2">
            <p className="text-xl font-semibold">{bmi!.toFixed(1)}</p>
            <p className="text-sm text-gray-500">{category(bmi!)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
