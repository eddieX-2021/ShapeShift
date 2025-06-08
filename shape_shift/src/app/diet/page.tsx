import NutritionSummary from "@/components/diet/NutritionSummary";
import FoodUpload from "@/components/diet/FoodUpload";
import MealSearch from "@/components/diet/MealSearch";
import MealPlanner from "@/components/diet/MealPlanner";

export default function DietPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🥗 Diet Planner</h1>
      <NutritionSummary />
      <FoodUpload />
      <MealSearch />
      <MealPlanner />
    </div>
  );
}
