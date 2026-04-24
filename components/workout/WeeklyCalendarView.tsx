import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyCalendarView({
  exercises,
}: {
  exercises: Array<{ id: string; name: string; muscleGroup: string; day: number }>;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-1">
      {days.map((day, index) => {
        const dayExercises = exercises.filter((exercise) => exercise.day === index + 1);
        return (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-base">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayExercises.length ? (
                dayExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                  >
                    <p className="text-sm font-medium text-white">{exercise.name}</p>
                    <p className="text-xs text-slate-400">{exercise.muscleGroup}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Recovery</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
