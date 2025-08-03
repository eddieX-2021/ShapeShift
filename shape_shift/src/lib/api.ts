import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
export type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description?: string;
}

export interface Meals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}
export interface ExercisePlan {
  name: string;
  sets: number;
  reps: number;
  description?: string;
}
export interface MealItemBrief {
  name: string;
  calories: number;
}
export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietPlan {
  _id: string;
  cycleName: string;
  meals: Meals;
  createdAt: string;
}
export type NavyInputs = {
  gender: "male" | "female";
  height: number;
  waist: number;
  neck: number;
  hip?: number;
};
export interface IntakePayload {
  userId: string;
  weight: number;
  bmi: number;
  // either `bodyFat` _or_ `navyInputs`
  bodyFat?: string;
  navyInputs?: NavyInputs;
}
export interface SubmitResponse {
  message: string;
}
export type Range = 'day' | 'week' | 'month' | 'year';
export async function createCheckoutSession(): Promise<string> {
  const { data } = await api.post<{ url: string }>('/stripe/checkout');
  return data.url;
}
export async function sendFeedback( message: string) {
  await api.post('/feedback/', { message });
}

export async function getSuggestedCalories(userId: string): Promise<number> {
  try {
    // note: `api` is the axios instance with baseURL http://localhost:5000/api
    const { data } = await api.get<{ weight?: number }>(
      '/intake/latest-weight',
      { params: { userId } }
    );
    const w = data.weight;
    if (typeof w === 'number' && w > 0) {
      return Math.round(w * 12);
    }
  } catch (err) {
    console.warn('Could not fetch weight, using default goal', err);
  }
  return 2000;
}
export async function fetchWeightData(
  userId: string,
  range: Range
): Promise<{ date: string; weight: number }[]> {
  console.log('API ➜ fetchWeightData', { userId, range });
  const { data } = await api.get('/home/weight-data', { params: { userId, range } });
  console.log('API ← fetchWeightData', data);
  return data;
}

export async function fetchBodyFatData(
  userId: string,
  range: Range
): Promise<{ date: string; bodyFat: number }[]> {
  console.log('API ➜ fetchBodyFatData', { userId, range });
  const { data } = await api.get('/home/body-fat-data', { params: { userId, range } });
  console.log('API ← fetchBodyFatData', data);
  return data;
}
export async function fetchTodayIntake(
  userId: string
): Promise<{ bmi?: number }> {
  const res = await api.get(`/home/intake/today`, { params: { userId } });
  return res.data;
}

export async function fetchTodayExercises(
  userId: string
): Promise<{ id: string; name: string }[]> {
  const res = await api.get(`/home/exercise/today`, { params: { userId } });
  return res.data;
}

export async function completeExercise(
  userId: string,
  taskId: string
): Promise<{ success: boolean }> {
  const res = await api.post(`/home/exercise/complete`, { userId, taskId });
  return res.data;
}

export async function fetchTodayMeals(
  userId: string
): Promise<{ id: string; name: string; mealType: string; calories: number }[]> {
  console.log('API ➜ fetchTodayMeals', { userId });
  const { data } = await api.get('/home/diet/meals/today', { params: { userId } });
  console.log('API ← fetchTodayMeals raw', data);
  const mealsObj = data.meals ?? { breakfast: [], lunch: [], dinner: [], snacks: [] };
  const out: {
    id: string;
    name: string;
    mealType: string;
    calories: number;
  }[] = [];
  for (const mealType of ['breakfast','lunch','dinner','snacks']) {
    (mealsObj[mealType] || []).forEach((item:MealItemBrief, idx: number) =>
      out.push({
        id: `${mealType}-${idx}-${item.name}`,
        name: item.name,
        mealType,
        calories: item.calories,
      })
    );
  }
  console.log('API ← fetchTodayMeals transformed', out);
  return out;
}
export async function fetchNutrition(userId: string) {
  const [nutri, target] = await Promise.all([
    api.get<{ calories:number }>('/home/diet/nutrition', { params:{userId} }),
    getSuggestedCalories(userId)
  ]);
  return { consumed: nutri.data.calories, target };
}
export async function checkIntake(userId: string): Promise<boolean> {
  const { data } = await api.get<{ completed: boolean }>('/intake/check', {
    params: { userId },
  });
  return data.completed;
}

export async function submitIntakeEntry(
  payload: IntakePayload
): Promise<SubmitResponse> {
  const { data } = await api.post<SubmitResponse>('/intake/submit', payload);
  return data;
}
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}
export async function getCurrentUser(): Promise<CurrentUser> {
  // tell TS you expect an _id, name, and email
  try{
  const { data } = await api.get<{
    _id: string;
    name: string;
    email: string;
  }>('/auth/user');

  // map _id → id and pass name + email through
  return {
    id: data._id,
    name: data.name,
    email: data.email
  };}
  catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function logoutUser() {
    try {
        const response = await api.post("/auth/logout");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return response.data;
    } catch (error) {
        if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
    }
}
export async function generateWorkoutPlan(goal: string, level: string, duration: number) {
    try{ 
      const response = await api.post("/exercise/generate-plan", { goal, level, duration });
      return response.data;
    }catch (error) {
      if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
    }
  }

export async function getAIPlans(userId: string) {
  try {
    const response = await api.get(`/exercise/ai-plan/${userId}`);
    return response.data.plans;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function saveAIPlan(
  userId: string,
  cycleName: string,
  exercises: ExercisePlan[]
) {
  try {
    const response = await api.post("/exercise/ai-plan", {
      userId,
      cycleName,
      exercises,
    });
    return response.data;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function getManualPlanner(userId: string) {
  try {
    const response = await api.get(`/exercise/manual-planner/${userId}`);
    return response.data.planner || {};
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function updatePlannerDay(
  userId: string,
  day: string,
  workouts: ExercisePlan[]
) {
  try {
    const response = await api.patch("/exercise/manual-planner/day", {
      userId,
      day,
      workouts,
    });
    return response.data;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function deleteAIPlan(userId: string, planId: string) {
  try {
    const response = await api.delete(`/exercise/ai-plan/${userId}/${planId}`);
    return response.data;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}


export async function addWorkoutToDays(
  userId: string,
  days: string[],
  workout: {
    name: string;
    sets: number;
    reps: number;
    description?: string;
  }
) {
  const res = await api.post("/exercise/manual-planner/add", {
    userId,
    days: days.map(d => d.toLowerCase()),
    workout,
  });
  if (!res.data) throw new Error("Failed to add workout to days");
  return res.data;
}



//
// ─── DIET ───────────────────────────────────────────────────────────────────────
//
export async function getTodayMeals(userId: string): Promise<Meals> {
  const res = await api.get(`/diet/meals/today?userId=${userId}`);
  return res.data.meals as Meals;
}
export async function getDietNutrition(userId: string): Promise<Nutrition> {
  const res = await api.get(`/diet/nutrition?userId=${userId}`);
  return res.data as Nutrition;
}


// export async function addCustomMeal(
//   userId: string,
//   section: keyof Meals,
//   item: DietMealItem
// ): Promise<Meals> {
//   const res = await api.post('/diet/meal/custom', { userId, section, item });
//   return res.data.meals as Meals;
// }
export type DietPlanResponse = {
  cycleName: string;
  meals: Meals;
};
export async function deleteDietMealItem(
  userId: string,
  section: MealSection,
  index: number
): Promise<Meals> {
  const res = await api.delete('/diet/meal', {
    data: { userId, section, index },
  });
  return res.data.meals as Meals;
}

export async function generateDietPlan(
  userId: string,
  goal: string,
  description: string,
  dietRestriction: string
): Promise<Meals> {
  const res = await api.post('/diet/generate', {
    userId,
    goal,
    description,
    dietRestriction,
  });
  return res.data.meals as Meals;
}
export async function saveDietPlan(
  userId: string,
  cycleName: string,
  meals: Meals
): Promise<DietPlan[]> {
  try {
    const res = await api.post<{ plans: DietPlan[] }>('/diet/plan', {
      userId,
      cycleName,
      meals,
    });
    return res.data.plans;
  } catch (error) {
    if (
       axios.isAxiosError(error) &&
       error.response?.data?.error
     ) {
       throw new Error(error.response.data.error);
     }
     throw error;
  }
}

export async function listDietPlans(userId: string): Promise<DietPlan[]> {
  const res = await api.get<{ plans: DietPlan[] }>('/diet/plans', {
    params: { userId },
  });
  return res.data.plans;
}
export async function deleteDietPlan(
  userId: string,
  index: number
): Promise<DietPlan[]> {
  const res = await api.delete<{ plans: DietPlan[] }>('/diet/plan', {
    data: { userId, index },
  });
  return res.data.plans;
}
export async function applyDietPlanToToday(userId: string, planId: string) {
  const res = await api.post('/diet/plan/apply', { userId, planId });
  return res.data.meals as Meals;
}
export async function getMealSuggestions(
  query: string
): Promise<string[]> {
  const res = await api.get(
    `/diet/meal/suggestions?query=${encodeURIComponent(query)}`
  );
  return res.data.suggestions as string[];
}

export async function searchMeal(
  userId: string,
  mealName: string,
  section: MealSection
) {
  const res = await fetch('/diet/meal/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, mealName, section }),
  });
  return res.json();
}

export async function addMealFromSearch(
  userId: string,
  mealName: string,
  section: MealSection
): Promise<Meals> {
  const res = await api.post('/diet/meal/add', {
    userId,
    mealName,
    section,
  });
  return res.data.meals as Meals;
}

export async function applyGeneratedPlan(
  userId: string,
  meals: Meals
): Promise<Meals> {
  const res = await api.post('/diet/plan/apply-generated', { userId, meals });
  return res.data.meals as Meals;
}
export async function addCustomMeal(
  userId: string,
  section: MealSection,
  item: MealItem
): Promise<Meals> {
  const res = await api.post('/diet/meal/custom', {
    userId,
    section,
    item,
  });
  return res.data.meals as Meals;
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ msg: string }> {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}


export async function resetPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  const res = await api.post('/auth/reset-password', { token, password });
  return res.data;
}

export async function scanFoodImage(
  file: File
): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingQty: number;
  servingUnit: string;
}> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/diet/scan', formData);
  return res.data;
}