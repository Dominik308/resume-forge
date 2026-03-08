"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useResumeStore } from "@/stores/resume-store";
import { useEditorStore } from "@/stores/editor-store";
import ResumePreview from "@/components/resume/ResumePreview";
import {
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Save,
  Download,
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  Award,
  Layers,
  Palette,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Lightbulb,
  Zap,
} from "lucide-react";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import SkillsForm from "@/components/forms/SkillsForm";
import SummaryForm from "@/components/forms/SummaryForm";
import LanguagesForm from "@/components/forms/LanguagesForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import { TEMPLATES } from "@/types/template";
import type { ResumeData } from "@/types/resume";
import { analyzeResume, type SuggestionEngineResult, type Suggestion, type SuggestionPriority } from "@/lib/ai/suggestion-engine";

interface ResumeEditorPageProps {
  resume: {
    id: string;
    title: string;
    personalInfo: Record<string, unknown>;
    experience: Record<string, unknown>[];
    education: Record<string, unknown>[];
    skills: Record<string, unknown>[];
    projects: Record<string, unknown>[];
    certifications: Record<string, unknown>[];
    languages: Record<string, unknown>[];
    customSections: Record<string, unknown>[];
    summary: string | null;
    templateId: string;
    colorScheme: Record<string, unknown> | null;
    fontConfig: Record<string, unknown> | null;
  };
}

const SIDEBAR_SECTIONS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: Layers },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "certifications", label: "Certs", icon: Award },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "design", label: "Design", icon: Palette },
] as const;

type SectionId = typeof SIDEBAR_SECTIONS[number]["id"];

export default function ResumeEditorPage({ resume }: ResumeEditorPageProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    resume: storeResume,
    setResume,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeStore();
  const { zoom, setZoom } = useEditorStore();
  const [activePanel, setActivePanel] = useState<SectionId | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRight, setActiveRight] = useState<"none" | "ai" | "guide">("none");

  // Initialize store with resume data from DB
  useEffect(() => {
    setResume({
      id: resume.id,
      title: resume.title,
      personalInfo: resume.personalInfo as unknown as ResumeData["personalInfo"],
      summary: resume.summary || "",
      experience: (resume.experience as unknown as ResumeData["experience"]) || [],
      education: (resume.education as unknown as ResumeData["education"]) || [],
      skills: (resume.skills as unknown as ResumeData["skills"]) || [],
      projects: (resume.projects as unknown as ResumeData["projects"]) || [],
      certifications: (resume.certifications as unknown as ResumeData["certifications"]) || [],
      languages: (resume.languages as unknown as ResumeData["languages"]) || [],
      customSections: (resume.customSections as unknown as ResumeData["customSections"]) || [],
      templateId: resume.templateId,
      colorScheme: (resume.colorScheme as unknown as ResumeData["colorScheme"]) ?? undefined,
      fontConfig: (resume.fontConfig as unknown as ResumeData["fontConfig"]) ?? undefined,
    });
  }, [resume.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeResume),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Resume saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/resumes/${resume.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf", resumeData: storeResume }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${storeResume.title || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  const renderSidebarContent = () => {
    switch (activePanel) {
      case "personal":
        return <PersonalInfoForm />;
      case "summary":
        return <SummaryForm />;
      case "experience":
        return <ExperienceForm />;
      case "education":
        return <EducationForm />;
      case "skills":
        return <SkillsForm />;
      case "languages":
        return <LanguagesForm />;
      case "certifications":
        return <CertificationsForm />;
      case "projects":
        return <ProjectsForm />;
      case "design":
        return <DesignPanel />;
      default:
        return (
          <div className="p-4 text-sm text-gray-500 text-center mt-8">
            Select a section to edit
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Icon nav */}
      <div className="flex flex-col items-center gap-1 bg-white border-r border-gray-200 py-4 px-2 w-14 shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          title="Back to dashboard"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {SIDEBAR_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePanel(activePanel === id ? null : id as SectionId)}
            title={label}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === id
                ? "text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            style={activePanel === id ? { backgroundColor: "#1a365d" } : {}}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setActiveRight(activeRight === "guide" ? "none" : "guide")}
          title="Resume Guide"
          className={`p-2 rounded-lg transition-colors ${
            activeRight === "guide" ? "text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
          style={activeRight === "guide" ? { backgroundColor: "#d97706" } : {}}
        >
          <Target className="h-4 w-4" />
        </button>
        <button
          onClick={() => setActiveRight(activeRight === "ai" ? "none" : "ai")}
          title="AI Assistant"
          className={`p-2 rounded-lg transition-colors ${
            activeRight === "ai" ? "text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
          style={activeRight === "ai" ? { backgroundColor: "#319795" } : {}}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Left properties sidebar */}
      {activePanel && (
        <div className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-800 capitalize">
              {SIDEBAR_SECTIONS.find((s) => s.id === activePanel)?.label}
            </h2>
            <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-sm">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Center canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center gap-2 px-4 shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button
            onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
            className="p-1.5 rounded hover:bg-gray-100"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-500 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2.5, zoom + 0.1))}
            className="p-1.5 rounded hover:bg-gray-100"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="text-[10px] text-gray-400 hover:text-gray-600 px-1"
          >
            Reset
          </button>
          <div className="flex-1" />
          <div className="text-xs text-gray-500 max-w-xs truncate">{storeResume.title}</div>
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#1a365d" }}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ backgroundColor: "#319795" }}
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </button>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 overflow-auto editor-canvas p-10">
          <div
            className="origin-top mx-auto shadow-2xl"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <ResumePreview data={storeResume} isPrint={false} />
          </div>
        </div>
      </div>

      {/* Right AI panel */}
      {activeRight === "ai" && (
        <div className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: "#319795" }}>
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </h2>
            <button onClick={() => setActiveRight("none")} className="text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AIPanelContent resumeId={resume.id} />
          </div>
        </div>
      )}

      {/* Right Guide panel */}
      {activeRight === "guide" && (
        <div className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: "#d97706" }}>
              <Target className="h-4 w-4" />
              Resume Guide
            </h2>
            <button onClick={() => setActiveRight("none")} className="text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <GuidePanelContent
              onSwitchToAI={() => setActiveRight("ai")}
              onNavigateToSection={(section) => setActivePanel(section as SectionId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────── Design Panel ────────────────
function DesignPanel() {
  const { resume, setTemplate, updateColorScheme } = useResumeStore();

  const colorSchemes = [
    { name: "Default", primary: "#1a365d", accent: "#319795" },
    { name: "Ocean", primary: "#1e3a5f", accent: "#2b6cb0" },
    { name: "Forest", primary: "#1a4731", accent: "#276749" },
    { name: "Sunset", primary: "#7b341e", accent: "#c05621" },
    { name: "Violet", primary: "#44337a", accent: "#6b46c1" },
    { name: "Rose", primary: "#702459", accent: "#b83280" },
    { name: "Slate", primary: "#2d3748", accent: "#4a5568" },
    { name: "Gold", primary: "#744210", accent: "#b7791f" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Template</label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`p-2 rounded-lg border text-xs text-left transition-all ${
                resume.templateId === tpl.id
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="font-medium">{tpl.name}</div>
              {tpl.isPro && (
                <span className="text-[9px] font-bold text-yellow-600 uppercase">Pro</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Color Scheme</label>
        <div className="grid grid-cols-4 gap-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => updateColorScheme({ primary: scheme.primary, accent: scheme.accent, background: "#ffffff", text: "#1a202c" })}
              title={scheme.name}
              className={`h-8 rounded-lg border-2 overflow-hidden transition-all ${
                resume.colorScheme?.primary === scheme.primary
                  ? "border-gray-900 scale-105"
                  : "border-transparent hover:scale-105"
              }`}
            >
              <div className="h-full flex">
                <div className="flex-1" style={{ backgroundColor: scheme.primary }} />
                <div className="flex-1" style={{ backgroundColor: scheme.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────── AI Panel ────────────────
interface OptimizeChange {
  section: string;
  description: string;
}

interface OptimizeResult {
  summary?: string;
  experience?: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  skills?: {
    id: string;
    category: string;
    items: string[];
  }[];
  addedSkills?: string[];
  changes?: OptimizeChange[];
}

interface SkillsSuggestion {
  technical?: string[];
  soft?: string[];
  tools?: string[];
  certifications?: string[];
}

type AIMode = "idle" | "optimizing" | "preview" | "generating" | "result";

function AIPanelContent({ resumeId }: { resumeId: string }) {
  const { resume, updateSummary, updateExperience, addSkillCategory, updateSkillCategory } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>("idle");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [appliedSections, setAppliedSections] = useState<Set<string>>(new Set());
  const [textResult, setTextResult] = useState("");
  const [textResultType, setTextResultType] = useState("");
  const [error, setError] = useState("");
  const [skillsSuggestion, setSkillsSuggestion] = useState<SkillsSuggestion | null>(null);

  // ──── Optimize for Job (full auto-edit) ────
  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }
    setError("");
    setLoading(true);
    setMode("optimizing");
    setAppliedSections(new Set());
    setOptimizeResult(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "optimize",
          resumeData: resume,
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Optimization failed");
      }

      const data = await res.json();
      const result = data.result as OptimizeResult;
      setOptimizeResult(result);
      setMode("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed. Please try again.");
      setMode("idle");
    } finally {
      setLoading(false);
    }
  };

  // ──── Apply individual sections from optimization ────
  const applySummary = () => {
    if (optimizeResult?.summary) {
      updateSummary(optimizeResult.summary);
      setAppliedSections((prev) => new Set(prev).add("summary"));
      toast.success("Summary updated!");
    }
  };

  const applyExperience = () => {
    if (optimizeResult?.experience) {
      for (const exp of optimizeResult.experience) {
        const existing = resume.experience.find((e) => e.id === exp.id);
        if (existing) {
          updateExperience(exp.id, { bullets: exp.bullets });
        }
      }
      setAppliedSections((prev) => new Set(prev).add("experience"));
      toast.success("Experience bullets updated!");
    }
  };

  const applySkills = () => {
    if (optimizeResult?.skills) {
      for (const newSkill of optimizeResult.skills) {
        const existing = resume.skills.find((s) => s.id === newSkill.id);
        if (existing) {
          updateSkillCategory(newSkill.id, { items: newSkill.items });
        } else {
          // Add as a new category
          addSkillCategory();
          const latest = useResumeStore.getState().resume.skills;
          const addedCat = latest[latest.length - 1];
          if (addedCat) {
            updateSkillCategory(addedCat.id, {
              category: newSkill.category,
              items: newSkill.items,
            });
          }
        }
      }
      setAppliedSections((prev) => new Set(prev).add("skills"));
      toast.success("Skills updated!");
    }
  };

  const applyAll = () => {
    if (!optimizeResult) return;
    if (optimizeResult.summary && !appliedSections.has("summary")) applySummary();
    if (optimizeResult.experience && !appliedSections.has("experience")) applyExperience();
    if (optimizeResult.skills && !appliedSections.has("skills")) applySkills();
    toast.success("All changes applied!");
  };

  // ──── Individual AI actions with direct apply ────
  const handleGenerateSummary = async () => {
    setLoading(true);
    setError("");
    setMode("generating");
    setTextResultType("summary");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          resumeData: resume,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate summary");
      const data = await res.json();
      const summaryText = typeof data.result === "string" ? data.result : JSON.stringify(data.result);
      setTextResult(summaryText);
      setMode("result");
    } catch {
      setError("Failed to generate summary. Please try again.");
      setMode("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSkills = async () => {
    setLoading(true);
    setError("");
    setMode("generating");
    setTextResultType("skills");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          resumeData: resume,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to suggest skills");
      const data = await res.json();
      if (typeof data.result === "object" && data.result !== null) {
        setSkillsSuggestion(data.result as SkillsSuggestion);
      } else {
        try {
          setSkillsSuggestion(JSON.parse(data.result) as SkillsSuggestion);
        } catch {
          setTextResult(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
        }
      }
      setMode("result");
    } catch {
      setError("Failed to suggest skills. Please try again.");
      setMode("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleATSScore = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description for ATS analysis.");
      return;
    }
    setLoading(true);
    setError("");
    setMode("generating");
    setTextResultType("ats");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ats",
          resumeData: resume,
          jobDescription: jobDescription.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to calculate ATS score");
      const data = await res.json();
      setTextResult(typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2));
      setMode("result");
    } catch {
      setError("Failed to calculate ATS score. Please try again.");
      setMode("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description to generate a cover letter.");
      return;
    }
    setLoading(true);
    setError("");
    setMode("generating");
    setTextResultType("cover-letter");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover-letter",
          resumeData: resume,
          jobDescription: jobDescription.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate cover letter");
      const data = await res.json();
      setTextResult(typeof data.result === "string" ? data.result : JSON.stringify(data.result));
      setMode("result");
    } catch {
      setError("Failed to generate cover letter. Please try again.");
      setMode("idle");
    } finally {
      setLoading(false);
    }
  };

  const applyTextResult = () => {
    if (textResultType === "summary" && textResult) {
      updateSummary(textResult);
      toast.success("Summary applied to resume!");
      setMode("idle");
      setTextResult("");
    }
  };

  const applySkillsSuggestion = (category: string, skills: string[]) => {
    // Find or create a skill category matching the name
    const existing = resume.skills.find(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    if (existing) {
      const merged = [...new Set([...existing.items, ...skills])];
      updateSkillCategory(existing.id, { items: merged });
    } else {
      addSkillCategory();
      const latest = useResumeStore.getState().resume.skills;
      const addedCat = latest[latest.length - 1];
      if (addedCat) {
        updateSkillCategory(addedCat.id, {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          items: skills,
        });
      }
    }
    toast.success(`${category} skills added!`);
  };

  const resetPanel = () => {
    setMode("idle");
    setOptimizeResult(null);
    setTextResult("");
    setTextResultType("");
    setSkillsSuggestion(null);
    setAppliedSections(new Set());
    setError("");
  };

  // ──── Render ────
  return (
    <div className="space-y-4">
      {/* Job Description Input (always visible) */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
          Target Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here. AI will optimize your resume to match this role…"
          rows={4}
          className="w-full text-xs border border-gray-200 dark:border-slate-700 rounded-lg p-2 resize-none focus:ring-1 focus:outline-none bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
          style={{ "--tw-ring-color": "#319795" } as React.CSSProperties}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-2.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-teal-200 dark:border-teal-800" />
            <div className="absolute inset-0 rounded-full border-2 border-t-teal-500 animate-spin" />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {mode === "optimizing" ? "AI is optimizing your resume…" : "AI is generating…"}
          </span>
          <span className="text-[10px] text-gray-400">This may take 30-60 seconds</span>
        </div>
      )}

      {/* Idle mode — show actions */}
      {mode === "idle" && !loading && (
        <>
          {/* Primary action: Full Optimize */}
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50"
            style={{ backgroundColor: "#319795", boxShadow: "0 4px 14px rgba(49,151,149,0.3)" }}
          >
            <span className="text-base">🚀</span>
            Optimize Resume for Job
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-gray-400">or individual actions</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors text-left"
            >
              <span>✨</span> Generate Summary
              <span className="ml-auto text-[10px] text-teal-500 font-bold">AUTO-APPLY</span>
            </button>
            <button
              onClick={handleSuggestSkills}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors text-left"
            >
              <span>💡</span> Suggest Skills
              <span className="ml-auto text-[10px] text-teal-500 font-bold">AUTO-APPLY</span>
            </button>
            <button
              onClick={handleATSScore}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors text-left"
            >
              <span>📊</span> ATS Score Analysis
            </button>
            <button
              onClick={handleCoverLetter}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors text-left"
            >
              <span>📝</span> Generate Cover Letter
            </button>
          </div>
        </>
      )}

      {/* Preview mode — show optimization results with Apply/Reject per section */}
      {mode === "preview" && optimizeResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              Optimization Preview
            </h3>
            <button onClick={resetPanel} className="text-[10px] text-gray-400 hover:text-gray-600">Back</button>
          </div>

          {/* Changes summary */}
          {optimizeResult.changes && optimizeResult.changes.length > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-2.5">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Changes Made</div>
              <ul className="space-y-0.5">
                {optimizeResult.changes.map((c, i) => (
                  <li key={i} className="text-[10px] text-blue-700 dark:text-blue-300">
                    • <strong>{c.section}:</strong> {c.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply All button */}
          <button
            onClick={applyAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "#319795" }}
          >
            ✅ Apply All Changes
          </button>

          {/* Summary section */}
          {optimizeResult.summary && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Summary</span>
                {appliedSections.has("summary") ? (
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">✓ Applied</span>
                ) : (
                  <button
                    onClick={applySummary}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{optimizeResult.summary}</p>
              {resume.summary && (
                <details className="mt-2">
                  <summary className="text-[10px] text-gray-400 cursor-pointer">Show original</summary>
                  <p className="text-[10px] text-gray-400 mt-1 line-through">{resume.summary}</p>
                </details>
              )}
            </div>
          )}

          {/* Experience section */}
          {optimizeResult.experience && optimizeResult.experience.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Experience Bullets</span>
                {appliedSections.has("experience") ? (
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">✓ Applied</span>
                ) : (
                  <button
                    onClick={applyExperience}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {optimizeResult.experience.map((exp) => (
                  <div key={exp.id} className="text-[10px]">
                    <div className="font-medium text-gray-700 dark:text-gray-200">{exp.title} @ {exp.company}</div>
                    <ul className="mt-0.5 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="text-gray-500 dark:text-gray-400 pl-2 border-l border-teal-300 dark:border-teal-600">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills section */}
          {optimizeResult.skills && optimizeResult.skills.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Skills</span>
                {appliedSections.has("skills") ? (
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">✓ Applied</span>
                ) : (
                  <button
                    onClick={applySkills}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              {optimizeResult.skills.map((s) => (
                <div key={s.id} className="text-[10px] mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{s.category}: </span>
                  <span className="text-gray-500 dark:text-gray-400">{s.items.join(", ")}</span>
                </div>
              ))}
              {optimizeResult.addedSkills && optimizeResult.addedSkills.length > 0 && (
                <div className="mt-1.5 text-[10px] text-teal-600 dark:text-teal-400">
                  <span className="font-bold">New:</span> {optimizeResult.addedSkills.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Result mode — single action results */}
      {mode === "result" && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              {textResultType === "summary" && "Generated Summary"}
              {textResultType === "skills" && "Suggested Skills"}
              {textResultType === "ats" && "ATS Analysis"}
              {textResultType === "cover-letter" && "Cover Letter"}
            </h3>
            <button onClick={resetPanel} className="text-[10px] text-gray-400 hover:text-gray-600">Back</button>
          </div>

          {/* Summary result with apply button */}
          {textResultType === "summary" && textResult && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{textResult}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={applyTextResult}
                  className="flex-1 text-xs font-bold py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: "#319795" }}
                >
                  ✅ Apply to Resume
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(textResult)}
                  className="px-3 py-2 text-xs text-gray-400 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Skills result with apply buttons per category */}
          {textResultType === "skills" && skillsSuggestion && (
            <div className="space-y-2">
              {Object.entries(skillsSuggestion).map(([category, skills]) => {
                if (!skills || !Array.isArray(skills) || skills.length === 0) return null;
                return (
                  <div key={category} className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase capitalize">{category}</span>
                      <button
                        onClick={() => applySkillsSuggestion(category, skills)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                      >
                        Add All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill: string, i: number) => (
                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ATS / Cover Letter — read-only with copy */}
          {(textResultType === "ats" || textResultType === "cover-letter") && textResult && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{textResult}</p>
              <button
                onClick={() => navigator.clipboard.writeText(textResult)}
                className="mt-2 text-[10px] text-gray-400 hover:text-gray-600"
              >
                Copy to clipboard
              </button>
            </div>
          )}

          {/* Fallback text result */}
          {textResultType === "skills" && !skillsSuggestion && textResult && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{textResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────── Guide Panel (Suggestion Engine) ────────────────

function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
        <span className="text-[8px] text-gray-400 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

function SectionScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-20 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-medium text-gray-600 w-6 text-right">{score}</span>
    </div>
  );
}

const PRIORITY_CONFIG: Record<SuggestionPriority, { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }> = {
  critical: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Critical" },
  high: { icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "High" },
  medium: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Medium" },
  low: { icon: Lightbulb, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", label: "Tip" },
};

function SuggestionCard({
  suggestion,
  onAction,
  expanded,
  onToggle,
}: {
  suggestion: Suggestion;
  onAction?: (s: Suggestion) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const config = PRIORITY_CONFIG[suggestion.priority];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden transition-all`}>
      <button onClick={onToggle} className="w-full flex items-start gap-2 p-2.5 text-left">
        <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-700">{suggestion.title}</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" /> : <ChevronRight className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />}
      </button>
      {expanded && (
        <div className="px-2.5 pb-2.5 pt-0">
          <p className="text-[10px] text-gray-600 leading-relaxed ml-5.5 pl-[22px]">{suggestion.description}</p>
          {suggestion.actionLabel && onAction && (
            <button
              onClick={() => onAction(suggestion)}
              className="mt-2 ml-[22px] flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md text-white transition-colors"
              style={{ backgroundColor: "#319795" }}
            >
              <Zap className="h-3 w-3" />
              {suggestion.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function GuidePanelContent({
  onSwitchToAI,
  onNavigateToSection,
}: {
  onSwitchToAI: () => void;
  onNavigateToSection: (section: string) => void;
}) {
  const { resume } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<string>("all");

  // Real-time analysis — recalculates when resume or JD changes
  const analysis = useMemo<SuggestionEngineResult>(
    () => analyzeResume(resume, jobDescription || undefined),
    [resume, jobDescription]
  );

  const filteredSuggestions = useMemo(() => {
    if (filterSection === "all") return analysis.suggestions;
    return analysis.suggestions.filter((s) => s.section === filterSection);
  }, [analysis.suggestions, filterSection]);

  const handleSuggestionAction = useCallback((suggestion: Suggestion) => {
    // Navigate to the relevant section in the editor
    const sectionMap: Record<string, string> = {
      summary: "summary",
      experience: "experience",
      skills: "skills",
      education: "education",
      personal: "personal",
      keywords: "skills",
      formatting: "personal",
    };
    const target = sectionMap[suggestion.section];
    if (target) onNavigateToSection(target);

    // For AI-fixable suggestions, switch to AI panel
    if (suggestion.autoFixable) {
      onSwitchToAI();
    }
  }, [onNavigateToSection, onSwitchToAI]);

  const criticalCount = analysis.suggestions.filter((s) => s.priority === "critical").length;
  const highCount = analysis.suggestions.filter((s) => s.priority === "high").length;

  return (
    <div className="space-y-0">
      {/* Job Description Input */}
      <div className="p-4 border-b border-gray-100">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
          Target Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for personalized guidance..."
          rows={3}
          className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:ring-1 focus:outline-none bg-white text-gray-700"
          style={{ "--tw-ring-color": "#d97706" } as React.CSSProperties}
        />
        {jobDescription && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span className="text-[10px] text-green-600 font-medium">
              Analyzing against {analysis.matchedKeywords.length + analysis.missingKeywords.length} keywords
            </span>
          </div>
        )}
      </div>

      {/* Score Overview */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <ScoreRing score={analysis.score.overall} />
          <div className="flex-1 space-y-1.5">
            <SectionScoreBar label="Summary" score={analysis.score.sections.summary} />
            <SectionScoreBar label="Experience" score={analysis.score.sections.experience} />
            <SectionScoreBar label="Skills" score={analysis.score.sections.skills} />
            <SectionScoreBar label="Keywords" score={analysis.score.sections.keywords} />
            <SectionScoreBar label="Formatting" score={analysis.score.sections.formatting} />
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis (when JD provided) */}
      {jobDescription && analysis.skillGap.missing.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Target className="h-3 w-3" />
            Skill Gap ({analysis.skillGap.missing.length} missing)
          </h3>
          <div className="flex flex-wrap gap-1">
            {analysis.skillGap.missing.slice(0, 10).map((skill) => (
              <span key={skill} className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          {analysis.matchedKeywords.length > 0 && (
            <>
              <h4 className="text-[10px] font-bold text-gray-400 mt-2 mb-1">Matched</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.matchedKeywords.slice(0, 8).map((kw) => (
                  <span key={kw} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                    {kw}
                  </span>
                ))}
                {analysis.matchedKeywords.length > 8 && (
                  <span className="text-[10px] text-gray-400">+{analysis.matchedKeywords.length - 8} more</span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        {criticalCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
            <AlertTriangle className="h-3 w-3" /> {criticalCount} critical
          </span>
        )}
        {highCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
            <TrendingUp className="h-3 w-3" /> {highCount} important
          </span>
        )}
        {criticalCount === 0 && highCount === 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
            <CheckCircle2 className="h-3 w-3" /> Looking great!
          </span>
        )}
        <div className="flex-1" />
        <span className="text-[10px] text-gray-400">{analysis.suggestions.length} suggestions</span>
      </div>

      {/* Section Filter */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1 overflow-x-auto">
        {[
          { value: "all", label: "All" },
          { value: "summary", label: "Summary" },
          { value: "experience", label: "Exp" },
          { value: "skills", label: "Skills" },
          { value: "personal", label: "Info" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterSection(f.value)}
            className={`text-[10px] font-medium px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
              filterSection === f.value
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-0.5 opacity-60">
                ({analysis.suggestions.filter((s) => s.section === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="p-3 space-y-2">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-600">No issues found</p>
            <p className="text-[10px] text-gray-400 mt-1">This section looks good!</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              expanded={expandedSuggestion === suggestion.id}
              onToggle={() => setExpandedSuggestion(expandedSuggestion === suggestion.id ? null : suggestion.id)}
              onAction={handleSuggestionAction}
            />
          ))
        )}
      </div>

      {/* AI CTA */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onSwitchToAI}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "#319795" }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fix Issues with AI
        </button>
      </div>
    </div>
  );
}
