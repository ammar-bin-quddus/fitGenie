import { getProgressLogs } from "@/actions/progress.actions";
import { BMIGauge } from "@/components/progress/BMIGauge";
import { MeasurementsChart } from "@/components/progress/MeasurementsChart";
import { ProgressLogForm } from "@/components/progress/ProgressLogForm";
import { ProgressPhotoUpload } from "@/components/progress/ProgressPhotoUpload";
import { WeightChart } from "@/components/progress/WeightChart";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const logs = await getProgressLogs();
  const latestLog = logs[logs.length - 1];
  const photoLogs = [...logs]
    .reverse()
    .filter((log) => Boolean(log.photoUrl))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress Tracker"
        description="Log body metrics, monitor trends, and compare your progress over time."
      />
      <ProgressLogForm />
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weight progress</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart logs={logs} />
          </CardContent>
        </Card>
        <BMIGauge bmi={latestLog?.bmi} />
        <Card>
          <CardHeader>
            <CardTitle>Body measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <MeasurementsChart log={latestLog} />
          </CardContent>
        </Card>
        <ProgressPhotoUpload logs={photoLogs} />
      </div>
    </div>
  );
}
