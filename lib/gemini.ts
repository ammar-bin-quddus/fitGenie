import { ApiError, GoogleGenAI } from "@google/genai";

import type {
  ChatMessage,
  GeneratedMealPlan,
  GeneratedWorkoutPlan,
  MealGenerationParams,
  WorkoutGenerationParams,
} from "@/types";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

function ensureApiKey() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
}

function getClient() {
  ensureApiKey();
  return new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });
}

export function getGeminiErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error
      ? error.message
      : "The Gemini service is unavailable right now. Please try again.";
  }

  const message = error.message || "The Gemini API request failed.";
  const lower = message.toLowerCase();

  if (error.status === 400 && lower.includes("api key")) {
    return "Your Gemini API key is invalid or missing required access.";
  }

  if (error.status === 403) {
    return "Your Gemini project does not have access to this model or API yet.";
  }

  if (error.status === 429) {
    return "Gemini free-tier rate limits were reached. Please wait a bit and try again.";
  }

  if (error.status === 503 || lower.includes("high demand")) {
    return "Gemini is experiencing high demand right now. FitGenie retried automatically, but the service is still busy. Please try again in a moment.";
  }

  if (lower.includes("quota") || lower.includes("rate limit")) {
    return "Gemini quota was reached. Please try again later or switch to a lighter model.";
  }

  return message;
}

function isRetryableGeminiError(error: unknown) {
  if (!(error instanceof ApiError)) return false;
  const lower = (error.message || "").toLowerCase();
  return error.status === 429 || error.status === 500 || error.status === 503 || lower.includes("high demand");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GeminiJsonParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiJsonParseError";
  }
}

function extractBalancedJson(text: string) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

function sanitizeJsonCandidate(text: string) {
  return text
    .replace(/^\uFEFF/, "")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[\u0000-\u0019]+/g, " ")
    .trim();
}

function extractJson<T>(text: string): T {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const candidate = sanitizeJsonCandidate(fencedMatch?.[1] ?? trimmed);

  try {
    return JSON.parse(candidate) as T;
  } catch (error) {
    const balanced = extractBalancedJson(candidate);

    if (balanced) {
      return JSON.parse(sanitizeJsonCandidate(balanced)) as T;
    }

    const message =
      error instanceof Error ? error.message : "Gemini returned malformed JSON.";
    throw new GeminiJsonParseError(message);
  }
}

function isRetryableJsonError(error: unknown) {
  if (!(error instanceof GeminiJsonParseError)) return false;
  const lower = error.message.toLowerCase();
  return (
    lower.includes("unterminated") ||
    lower.includes("unexpected end") ||
    lower.includes("bad control character") ||
    lower.includes("malformed") ||
    lower.includes("expected double-quoted property name")
  );
}

async function generateJsonWithRetry<T>({
  prompt,
  systemInstruction,
  maxOutputTokens,
}: {
  prompt: string;
  systemInstruction: string;
  maxOutputTokens: number;
}) {
  const models = Array.from(new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL]));
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await getClient().models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens,
            responseMimeType: "application/json",
            thinkingConfig: {
              thinkingBudget: 0,
            },
            systemInstruction,
          },
        });

        return extractJson<T>(response.text ?? "");
      } catch (error) {
        lastError = error;

        if (
          (!isRetryableGeminiError(error) && !isRetryableJsonError(error)) ||
          attempt === 3
        ) {
          break;
        }

        await sleep(600 * attempt);
      }
    }
  }

  throw new Error(getGeminiErrorMessage(lastError));
}

export async function generateWorkoutPlan(
  params: WorkoutGenerationParams,
): Promise<GeneratedWorkoutPlan> {
  ensureApiKey();

  return generateJsonWithRetry<GeneratedWorkoutPlan>({
    prompt: `Generate a detailed ${params.durationWeeks}-week ${params.workoutType} workout plan for someone with the following profile:
- Goal: ${params.goal}
- Fitness Level: ${params.level}
- Available Days per Week: ${params.daysPerWeek}
- Session Duration: ${params.sessionDuration} minutes
- Equipment: ${params.equipment}

Return ONLY a valid JSON object with this structure:
{
  "title": "Plan name",
  "description": "Brief overview",
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Monday",
          "focus": "Chest & Triceps",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "12-15",
              "restSeconds": 60,
              "muscleGroup": "Chest",
              "instructions": "Keep core tight..."
            }
          ]
        }
      ]
    }
  ]
}

Keep the JSON compact:
- Limit each workout day to 4-6 exercises.
- Keep each instructions field to one short sentence.
- Do not add any commentary outside the JSON.
- Avoid long descriptions that make the response too large.`,
    systemInstruction:
      "You create safe, realistic, structured fitness plans. Return JSON only with no commentary.",
    maxOutputTokens: 4000,
  });
}

export async function generateMealPlan(
  params: MealGenerationParams,
): Promise<GeneratedMealPlan> {
  ensureApiKey();

  return generateJsonWithRetry<GeneratedMealPlan>({
    prompt: `Create a ${params.days}-day meal plan with the following requirements:
- Dietary Preference: ${params.dietaryPreference}
- Allergies/Restrictions: ${params.allergies}
- Daily Calorie Target: ${params.calorieTarget}
- Fitness Goal: ${params.goal}

Return ONLY a valid JSON object with this structure:
{
  "title": "Meal Plan Name",
  "dailyCalories": 2000,
  "days": [
    {
      "dayNumber": 1,
      "meals": [
        {
          "mealType": "BREAKFAST",
          "name": "Oatmeal with Berries",
          "ingredients": ["1 cup oats", "1/2 cup blueberries"],
          "calories": 350,
          "protein": 12,
          "carbs": 60,
          "fat": 6,
          "recipe": "Step by step instructions..."
        }
      ]
    }
  ],
  "groceryList": [
    {
      "name": "Oats",
      "quantity": "2 cups",
      "category": "Grains"
    }
  ]
}

Keep the JSON compact:
- Limit each day to 4 meals.
- Keep each recipe short, with 1-3 short steps maximum.
- Keep ingredient entries short and practical.
- Do not add any commentary outside the JSON.
- Avoid trailing commas or extra notes.`,
    systemInstruction:
      "You create realistic nutrition plans with grocery grouping and macro estimates. Return JSON only with no commentary.",
    maxOutputTokens: 3200,
  });
}

function toGeminiRole(role: ChatMessage["role"]) {
  return role === "assistant" ? "model" : "user";
}

export async function streamCoachChat(messages: ChatMessage[]) {
  ensureApiKey();

  let lastError: unknown;

  for (const model of Array.from(new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL]))) {
    try {
      return await getClient().models.generateContentStream({
        model,
        contents: messages.map((message) => ({
          role: toGeminiRole(message.role),
          parts: [{ text: message.content }],
        })),
        config: {
          maxOutputTokens: 1024,
          temperature: 0.6,
          thinkingConfig: {
            thinkingBudget: 0,
          },
          systemInstruction: `You are FitGenie, an expert AI fitness coach and nutritionist.
You provide personalized, science-backed fitness and nutrition advice.
Be encouraging, specific, and always prioritize safety.
When creating plans, format them clearly with bullet points or numbered lists.
Always recommend consulting a healthcare provider for medical concerns.`,
        },
      });
    } catch (error) {
      lastError = error;
      if (!isRetryableGeminiError(error)) {
        break;
      }
    }
  }

  throw new Error(getGeminiErrorMessage(lastError));
}

export { GEMINI_MODEL, GEMINI_FALLBACK_MODEL };
