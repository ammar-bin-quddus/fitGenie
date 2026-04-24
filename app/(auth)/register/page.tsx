import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your FitGenie account"
      description="Join the platform and start building a personalized plan."
      alternateLabel="Sign in"
      alternateHref="/login"
      alternateText="Already have an account?"
    >
      <RegisterForm />
    </AuthShell>
  );
}
