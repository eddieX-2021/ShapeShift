import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
export async function checkIntake(userId: string): Promise<boolean> {
  const res = await axios.get<{ completed: boolean }>("http://localhost:5000/api/intake/check", {
    params: { userId },
  });
  return res.data.completed;
}

export async function submitIntakeEntry(
  payload: IntakePayload
): Promise<SubmitResponse> {
  const res = await axios.post<SubmitResponse>("http://localhost:5000/api/intake/submit", payload);
  return res.data;
}
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.error || 'Login failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
}
export async function getCurrentUser() {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/auth/user",
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
}
export async function registerUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", { email, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
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
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Logout failed');
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error(error.message);
        }
    }
}
export async function generateWorkoutPlan(goal: string, level: string, duration: number) {
    try{ 
      const response = await api.post("/exercise/generate-plan", { goal, level, duration });
      return response.data;
    }catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to generate workout plan');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error(error.message);
      }
    }
  }

export async function getAIPlans(userId: string) {
  try {
    const response = await api.get(`/exercise/ai-plan/${userId}`);
    return response.data.plans;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch AI plans');
  }
}

export async function saveAIPlan(userId: string, cycleName: string, exercises: any[]) {
  try {
    const response = await api.post("/exercise/ai-plan", {
      userId,
      cycleName,
      exercises,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to save AI plan');
  }
}

export async function getManualPlanner(userId: string) {
  try {
    const response = await api.get(`/exercise/manual-planner/${userId}`);
    return response.data.planner || {};
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch manual planner');
  }
}

export async function updatePlannerDay(userId: string, day: string, workouts: any[]) {
  try {
    const response = await api.patch("/exercise/manual-planner/day", {
      userId,
      day,
      workouts,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update planner day');
  }
}

export async function deleteAIPlan(userId: string, planId: string) {
  try {
    const response = await api.delete(`/exercise/ai-plan/${userId}/${planId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to delete AI plan');
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
  const res = await api.post('/diet/plan', {
    userId,
    cycleName,
    meals,
  });
  return res.data.plans as DietPlan[];
}


export async function listDietPlans(
  userId: string
): Promise<DietPlan[]> {
  const res = await api.get(`/diet/plans?userId=${userId}`);
  return res.data.plans as DietPlan[];
}
export async function deleteDietPlan(
  userId: string,
  index: number
): Promise<void> {
  await api.delete('/diet/plan', { data: { userId, index } });
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
  const res = await fetch('/api/diet/meal/search', {
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