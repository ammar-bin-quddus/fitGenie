import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your training, nutrition, and progress tracking."
      alternateLabel="Create one"
      alternateHref="/register"
      alternateText="Need an account?"
    >
      <LoginForm />
    </AuthShell>
  );
}
