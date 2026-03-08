"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume-store";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function SummaryForm() {
  const { resume, updateSummary } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summary", resumeData: resume }),
      });
      const data = await res.json();
      if (data.result) {
        updateSummary(typeof data.result === "string" ? data.result : data.result.summary || "");
        toast.success("Summary generated!");
      }
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Summary</h2>
      <p className="text-sm text-gray-500 mb-6">
        A compelling 2–4 sentence overview of your career, skills, and goals.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Summary</label>
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "#319795" }}
            >
              <Sparkles className="h-3 w-3" />
              {isGenerating ? "Generating…" : "AI Generate"}
            </button>
          </div>
          <textarea
            value={resume.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications…"
            rows={7}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors resize-none"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            {resume.summary.length} characters · Aim for 300–600 for best ATS results
          </p>
        </div>
      </div>
    </div>
  );
}
