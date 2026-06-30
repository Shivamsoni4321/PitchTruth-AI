import { PitchTruthDashboard } from "@/components/pitchtruth-dashboard";

export default function DashboardPage({
  searchParams
}: {
  searchParams?: { stadium?: string; question?: string };
}) {
  return (
    <PitchTruthDashboard
      initialQuestion={searchParams?.question}
      initialStadium={searchParams?.stadium}
    />
  );
}
