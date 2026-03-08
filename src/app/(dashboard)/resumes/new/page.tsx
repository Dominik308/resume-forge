import type { Metadata } from "next";
import ResumeWizard from "@/components/forms/ResumeWizard";

export const metadata: Metadata = { title: "Create New Resume" };

export default function NewResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <ResumeWizard />
    </div>
  );
}
