import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  FileText,
  Clock,
  Pencil,
  Download,
  Copy,
  Trash2,
  Search,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils/helpers";
import type { Metadata } from "next";
import DeleteResumeButton from "@/components/resumes/DeleteResumeButton";
import DuplicateResumeButton from "@/components/resumes/DuplicateResumeButton";

export const metadata: Metadata = {
  title: "My Resumes",
  description: "Manage all your resumes in one place",
};

async function getResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      templateId: true,
      atsScore: true,
      createdAt: true,
      updatedAt: true,
      targetJob: { select: { title: true, company: true } },
    },
  });
}

export default async function ResumesPage() {
  const session = await auth();
  const resumes = await getResumes(session!.user!.id!);

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Resumes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          href="/resumes/new"
          className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
        >
          <Plus className="h-4 w-4" /> New Resume
        </Link>
      </div>

      {/* Resume list */}
      {resumes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 p-16 text-center">
          <FileText className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No resumes yet
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-md mx-auto">
            Create your first resume and let AI help you craft the perfect
            application for your dream job.
          </p>
          <Link
            href="/resumes/new"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create My First Resume
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* New Resume Card */}
          <Link
            href="/resumes/new"
            className="group rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-teal-500 p-6 flex flex-col items-center justify-center min-h-[220px] transition-all hover:bg-teal-50 dark:hover:bg-teal-950/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors mb-3">
              <Plus className="h-7 w-7 text-gray-400 group-hover:text-teal-500" />
            </div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-teal-600">
              Create New Resume
            </span>
          </Link>

          {/* Existing Resume Cards */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              {/* Template color bar */}
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4" />

              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {resume.title}
                  </h3>
                  {resume.targetJob && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      → {resume.targetJob.title}
                      {resume.targetJob.company
                        ? ` @ ${resume.targetJob.company}`
                        : ""}
                    </p>
                  )}
                </div>
                {resume.atsScore != null && (
                  <div
                    className={`flex-shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                      resume.atsScore >= 80
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : resume.atsScore >= 60
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {resume.atsScore}%
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <Clock className="h-3 w-3" />
                {formatDate(resume.updatedAt)}
                <span className="mx-1">·</span>
                <span className="capitalize">{resume.templateId}</span>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-slate-800">
                <Link
                  href={`/resumes/${resume.id}/edit`}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
                <DuplicateResumeButton resumeId={resume.id} />
                <DeleteResumeButton resumeId={resume.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
