import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import JobTracker from "@/components/jobs/JobTracker";

export const metadata: Metadata = {
  title: "Job Tracker - ResumeForge",
  description: "Track job applications and tailor your resumes",
};

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-gray-500 mt-2">
            Paste job descriptions, let AI analyze them, and tailor your resumes automatically.
          </p>
        </div>
        <JobTracker />
      </div>
    </div>
  );
}
