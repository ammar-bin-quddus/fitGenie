import { getProfile } from "@/actions/profile.actions";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default async function ProfileSetupPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Setup"
        description="Complete your onboarding details so FitGenie can personalize plans."
      />
      <OnboardingForm initialValues={profile} />
    </div>
  );
}
