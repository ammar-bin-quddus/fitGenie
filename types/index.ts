import type {
  ActivityLevel,
  FitnessGoal,
  FitnessLevel,
  MealType,
  PostCategory,
  Role,
  WorkoutType,
} from "@prisma/client";

export type ActionState<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

export type WorkoutGenerationParams = {
  goal: FitnessGoal;
  level: FitnessLevel;
  daysPerWeek: number;
  sessionDuration: number;
  workoutType: WorkoutType;
  equipment: string;
  durationWeeks: number;
};

export type MealGenerationParams = {
  dietaryPreference: string;
  allergies: string;
  calorieTarget: number;
  days: number;
  goal: FitnessGoal;
};

export type NavItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

export type ProfileStepKey =
  | "personal"
  | "goal"
  | "activity"
  | "diet"
  | "medical";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
  fitnessGoal?: FitnessGoal | null;
  activityLevel?: ActivityLevel | null;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GeneratedWorkoutPlan = {
  title: string;
  description: string;
  weeks: Array<{
    weekNumber: number;
    days: Array<{
      dayNumber: number;
      dayName: string;
      focus: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        restSeconds: number;
        muscleGroup: string;
        instructions?: string;
      }>;
    }>;
  }>;
};

export type GeneratedMealPlan = {
  title: string;
  dailyCalories: number;
  days: Array<{
    dayNumber: number;
    meals: Array<{
      mealType: MealType;
      name: string;
      ingredients: string[];
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      recipe?: string;
    }>;
  }>;
  groceryList: Array<{
    name: string;
    quantity: string;
    category: string;
  }>;
};

export type CommunityFilter = PostCategory;
