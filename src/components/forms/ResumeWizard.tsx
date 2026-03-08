"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResumeStore } from "@/stores/resume-store";
import { generateId } from "@/lib/utils/helpers";
import { toast } from "sonner";
import {
  User, Briefcase, GraduationCap, Star, FolderOpen, Languages, ChevronRight, ChevronLeft, Check, Upload, Sparkles
} from "lucide-react";
import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import Link from "next/link";
import ResumePreview from "@/components/resume/ResumePreview";
import { TEMPLATES } from "@/types/template";
import { DEFAULT_COLOR_SCHEMES } from "@/types/resume";

const STEPS = [
  { id: "import", label: "Import", icon: Upload, description: "Import or start fresh" },
  { id: "personal", label: "Personal", icon: User, description: "Your contact details" },
  { id: "experience", label: "Experience", icon: Briefcase, description: "Work history" },
  { id: "education", label: "Education", icon: GraduationCap, description: "Academic background" },
  { id: "skills", label: "Skills", icon: Star, description: "Your expertise" },
  { id: "template", label: "Design", icon: FolderOpen, description: "Choose your template" },
];

export default function ResumeWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openImport = searchParams.get("import") === "true";
  const { resume, updateResume } = useResumeStore();

  const [currentStep, setCurrentStep] = useState(openImport ? 0 : 1);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("My Resume");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/resume", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Populate store with parsed data
      const parsed = data.parsed;
      updateResume({
        personalInfo: {
          name: parsed.personalInfo?.name || "",
          email: parsed.personalInfo?.email || "",
          phone: parsed.personalInfo?.phone || "",
          address: parsed.personalInfo?.address || "",
          linkedin: parsed.personalInfo?.linkedin || "",
          website: parsed.personalInfo?.website || "",
          title: parsed.personalInfo?.title || "",
          photo: "",
        },
        summary: parsed.summary || "",
        experience: (parsed.experience || []).map((e: unknown) => ({ id: generateId(), ...(e as object) })),
        education: (parsed.education || []).map((e: unknown) => ({ id: generateId(), ...(e as object) })),
        skills: (parsed.skills || []).map((s: unknown) => ({ id: generateId(), ...(s as object) })),
        certifications: (parsed.certifications || []).map((c: unknown) => ({ id: generateId(), ...(c as object) })),
        languages: (parsed.languages || []).map((l: unknown) => ({ id: generateId(), ...(l as object) })),
        projects: (parsed.projects || []).map((p: unknown) => ({ id: generateId(), ...(p as object) })),
      });

      toast.success("Resume imported successfully!");
      setCurrentStep(1);
    } catch {
      toast.error("Failed to import resume. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resume, title }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      toast.success("Resume created!");
      router.push(`/resumes/${data.id}/edit`);
    } catch {
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center max-w-lg mx-auto py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 mx-auto mb-6">
              <Upload className="h-8 w-8 text-teal-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import your existing resume</h2>
            <p className="text-gray-500 mb-8">Upload a PDF and we&apos;ll extract all your information automatically with AI.</p>

            <label className="block w-full cursor-pointer">
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              <div className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-teal-500 hover:bg-teal-50 p-10 transition-all">
                {isImporting ? (
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="h-5 w-5 text-teal-500 animate-pulse" />
                    <span className="font-medium text-teal-600">AI is extracting your data...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-600">Click to upload PDF</p>
                    <p className="text-sm text-gray-400 mt-1">or drag & drop here</p>
                  </>
                )}
              </div>
            </label>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Start from scratch
            </button>
          </div>
        );
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <ExperienceForm />;
      case 3:
        return <EducationForm />;
      case 4:
        return <SkillsForm />;
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Choose your template & design</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => updateResume({
                    templateId: template.id,
                    colorScheme: DEFAULT_COLOR_SCHEMES[template.defaultColorScheme] || DEFAULT_COLOR_SCHEMES.default
                  })}
                  className={`group rounded-xl overflow-hidden border-2 transition-all ${
                    resume.templateId === template.id
                      ? "border-teal-500 shadow-lg shadow-teal-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-[3/4] bg-gradient-to-b from-gray-100 to-gray-200 relative">
                    <div
                      className="absolute top-0 inset-x-0 h-1/3"
                      style={{ backgroundColor: DEFAULT_COLOR_SCHEMES[template.defaultColorScheme]?.primary || "#1a365d" }}
                    >
                      <div className="p-3">
                        <div className="h-2 w-3/4 rounded bg-white/70 mb-1.5"></div>
                        <div className="h-1.5 w-1/2 rounded bg-white/40"></div>
                      </div>
                    </div>
                    <div className="absolute inset-x-3 top-1/3 mt-3 space-y-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-1 rounded bg-gray-300" style={{ width: `${55 + i * 8}%` }}></div>
                      ))}
                    </div>
                    {resume.templateId === template.id && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 bg-white text-xs font-medium text-gray-700 text-left">
                    {template.name}
                    {template.isPro && (
                      <span className="ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-700">PRO</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Resume title</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer Resume 2026"
                className="w-full max-w-sm rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col">
        {/* Progress */}
        <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  currentStep === index
                    ? "bg-teal-500 text-white shadow-sm"
                    : currentStep > index
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {currentStep > index ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <step.icon className="h-3.5 w-3.5" />
                )}
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-2xl">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-400 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Create Resume →"}
            </button>
          )}
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="hidden xl:flex w-[420px] flex-col bg-gray-50 border-l border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-white">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live Preview</p>
        </div>
        <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
          <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
            <ResumePreview data={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
