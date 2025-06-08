"use client";

export default function MealPlanner() {
  return (
    <div className="border rounded-lg p-4 shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold">🍽️ Your Meals Today</h2>

      {["Breakfast", "Lunch", "Dinner", "Snacks"].map((section) => (
        <div key={section} className="space-y-2">
          <h3 className="text-md font-medium">{section}</h3>
          <div className="text-sm text-muted-foreground">No items yet.</div>
        </div>
      ))}
    </div>
  );
}
