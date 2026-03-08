import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Pencil,
  Download,
  Trash2,
  Target,
  Shield,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

/* ---------- template accent colours ---------- */
const templateColors: Record<string, { from: string; to: string }> = {
  modern:       { from: "from-teal-500", to: "to-cyan-400" },
  minimalist:   { from: "from-gray-500", to: "to-slate-400" },
  creative:     { from: "from-violet-500", to: "to-pink-400" },
  professional: { from: "from-blue-600", to: "to-indigo-400" },
  tech:         { from: "from-emerald-500", to: "to-lime-400" },
  elegant:      { from: "from-amber-500", to: "to-orange-400" },
  bold:         { from: "from-red-500", to: "to-rose-400" },
  classic:      { from: "from-stone-600", to: "to-stone-400" },
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
      updatedAt: true,
      createdAt: true,
      targetJob: { select: { title: true, company: true } },
    },
  });
}

export default async function DashboardPage() {
  const session = await auth();
  const resumes = await getResumes(session!.user!.id!);
  const firstName = session!.user!.name?.split(" ")[0] ?? "there";

  /* ---------- stats ---------- */
  const atsResumes = resumes.filter((r: { atsScore: number | null }) => r.atsScore);
  const avgAts = atsResumes.length
    ? Math.round(
        resumes.reduce((a: number, r: { atsScore: number | null }) => a + (r.atsScore || 0), 0) /
          atsResumes.length,
      )
    : null;

  /* ---------- getting-started checklist ---------- */
  const steps = [
    { label: "Create your first resume", done: resumes.length > 0, href: "/resumes/new" },
    { label: "Add work experience", done: resumes.length > 0, href: resumes[0] ? `/resumes/${resumes[0].id}/edit` : "/resumes/new" },
    { label: "Optimize with AI suggestions", done: (avgAts ?? 0) >= 60, href: resumes[0] ? `/resumes/${resumes[0].id}/edit` : "/resumes/new" },
    { label: "Export your resume as PDF", done: false, href: resumes[0] ? `/resumes/${resumes[0].id}/edit` : "/resumes/new" },
  ];
  const completedSteps = steps.filter((s) => s.done).length;

  /* ---------- tips ---------- */
  const tips = [
    { text: "Add quantifiable metrics to your bullet points to increase impact by 40%", icon: TrendingUp },
    { text: "Customize your summary for each application to improve ATS match scores", icon: Target },
    { text: "Include keywords from the job description throughout your resume", icon: Zap },
    { text: "Keep your resume to 1-2 pages — recruiters scan for 7 seconds on average", icon: Clock },
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ─── Hero / Welcome ─── */}
        <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 p-8 md:p-10 text-white shadow-xl shadow-teal-500/15">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute right-20 bottom-0 h-32 w-32 rounded-full bg-white/5 blur-xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, {firstName}
              </h1>
              <p className="mt-1 text-teal-100 text-sm md:text-base max-w-lg">
                {resumes.length === 0
                  ? "Create your first resume and let our local AI help you stand out."
                  : `You have ${resumes.length} resume${resumes.length > 1 ? "s" : ""}. Keep refining to land your dream role.`}
              </p>
            </div>

            <Link
              href="/resumes/new"
              className="self-start flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg shadow-black/10 hover:bg-teal-50 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Resume
            </Link>
          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Resumes", value: String(resumes.length), icon: FileText, accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
            { label: "Avg. ATS Score", value: avgAts ? `${avgAts}%` : "—", icon: TrendingUp, accent: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
            { label: "Last Edited", value: resumes[0] ? formatDate(resumes[0].updatedAt) : "—", icon: Clock, accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
            { label: "AI Generations", value: "Unlimited", icon: Sparkles, accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 shadow-sm"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ─── Main Content ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Getting Started (shows when < all steps done) */}
            {completedSteps < steps.length && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Getting Started</h2>
                  <span className="text-xs font-medium text-gray-400">{completedSteps}/{steps.length} complete</span>
                </div>
                {/* progress bar */}
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800 mb-5">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                  />
                </div>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <Link
                      key={i}
                      href={step.href}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                        step.done
                          ? "bg-teal-50/50 dark:bg-teal-900/10"
                          : "hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          step.done
                            ? "bg-teal-500 text-white"
                            : "border-2 border-gray-200 dark:border-slate-700 text-gray-400"
                        }`}
                      >
                        {step.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <span
                        className={`text-sm ${
                          step.done
                            ? "text-gray-400 line-through"
                            : "font-medium text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {step.label}
                      </span>
                      {!step.done && <ArrowRight className="h-3.5 w-3.5 ml-auto text-gray-300" />}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Resumes ─── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Your Resumes
                </h2>
                {resumes.length > 0 && (
                  <Link
                    href="/resumes"
                    className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    View all
                  </Link>
                )}
              </div>

              {resumes.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30">
                    <FileText className="h-8 w-8 text-teal-500" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    No resumes yet
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs mx-auto">
                    Build a professional resume in minutes — our AI runs 100% locally on your machine.
                  </p>
                  <Link
                    href="/resumes/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
                  >
                    <Plus className="h-4 w-4" /> Create My First Resume
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* New Resume Card */}
                  <Link
                    href="/resumes/new"
                    className="group relative rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-teal-400 flex flex-col items-center justify-center min-h-[210px] transition-all hover:bg-teal-50/50 dark:hover:bg-teal-950/20"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors mb-3">
                      <Plus className="h-7 w-7 text-gray-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Create New Resume
                    </span>
                    <span className="text-xs text-gray-400 mt-1">Start from scratch or upload PDF</span>
                  </Link>

                  {resumes.map((resume) => {
                    const colors = templateColors[resume.templateId] ?? templateColors.modern;
                    return (
                      <Link
                        key={resume.id}
                        href={`/resumes/${resume.id}/edit`}
                        className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                      >
                        {/* Template colour accent */}
                        <div className={`h-1.5 bg-gradient-to-r ${colors.from} ${colors.to}`} />

                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {resume.title}
                              </h3>
                              {resume.targetJob ? (
                                <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                                  <Target className="h-3 w-3 flex-shrink-0" />
                                  {resume.targetJob.title}
                                  {resume.targetJob.company ? ` at ${resume.targetJob.company}` : ""}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                  {resume.templateId} template
                                </p>
                              )}
                            </div>
                            {resume.atsScore != null && (
                              <div className="flex-shrink-0 ml-3">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ring-2 ${
                                    resume.atsScore >= 80
                                      ? "bg-green-50 text-green-600 ring-green-200 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800"
                                      : resume.atsScore >= 60
                                      ? "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800"
                                      : "bg-red-50 text-red-600 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800"
                                  }`}
                                >
                                  {resume.atsScore}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                            <Clock className="h-3 w-3" />
                            Edited {formatDate(resume.updatedAt)}
                          </div>

                          {/* Hover overlay actions */}
                          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-slate-800">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 group-hover:underline">
                              <Pencil className="h-3 w-3" /> Edit
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
                              <Download className="h-3 w-3" /> PDF
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">

            {/* AI Tip Card */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-[1px] shadow-lg shadow-teal-500/10">
              <div className="rounded-[calc(1rem-1px)] bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/40">
                    <randomTip.icon className="h-4 w-4 text-teal-500" />
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    Pro Tip
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {randomTip.text}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { label: "Create from scratch", desc: "Blank resume with AI help", href: "/resumes/new", icon: Plus, iconBg: "bg-teal-50 dark:bg-teal-900/40 text-teal-500" },
                  { label: "Upload existing PDF", desc: "Import and enhance", href: "/resumes/new?import=true", icon: FileText, iconBg: "bg-blue-50 dark:bg-blue-900/40 text-blue-500" },
                  { label: "Browse templates", desc: "8 professional designs", href: "/templates", icon: Sparkles, iconBg: "bg-violet-50 dark:bg-violet-900/40 text-violet-500" },
                  { label: "Track job applications", desc: "Manage your targets", href: "/jobs", icon: Target, iconBg: "bg-amber-50 dark:bg-amber-900/40 text-amber-500" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.label}</div>
                      <div className="text-xs text-gray-400 truncate">{action.desc}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto flex-shrink-0 text-gray-300 group-hover:text-teal-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">100% Private</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                All AI processing runs locally via Ollama. Your resume data never leaves your machine — no cloud APIs, no tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
