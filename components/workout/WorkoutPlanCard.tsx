import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseCard } from "@/components/workout/ExerciseCard";

export function WorkoutPlanCard({
  plan,
}: {
  plan: {
    title: string;
    description: string | null;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: string;
      restSeconds: number;
      muscleGroup: string;
      instructions?: string | null;
      day: number;
    }>;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
        <CardDescription>{plan.description ?? "AI-generated workout plan"}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {plan.exercises.slice(0, 4).map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </CardContent>
    </Card>
  );
}
