"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors";

export default function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const improveBullet = async (expId: string, bulletIndex: number, bullet: string) => {
    if (!bullet.trim()) return;
    setLoadingId(`${expId}-${bulletIndex}`);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bullet", context: bullet }),
      });
      const data = await res.json();
      const exp = resume.experience.find((e) => e.id === expId);
      if (exp) {
        const bullets = [...exp.bullets];
        bullets[bulletIndex] = data.result;
        updateExperience(expId, { bullets });
        toast.success("Bullet point improved!");
      }
    } catch {
      toast.error("Failed to improve bullet point");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add your professional history</p>
        </div>
        <button
          onClick={() => {
            addExperience();
            setExpandedId(resume.experience[0]?.id);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {resume.experience.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <p className="text-gray-400 mb-4">No experience added yet</p>
          <button
            onClick={addExperience}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            + Add your first position
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="rounded-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {exp.title || "New Position"} {exp.company ? `@ ${exp.company}` : ""}
                  </div>
                  <div className="text-xs text-gray-400">
                    {exp.startDate || "Start"} — {exp.current ? "Present" : exp.endDate || "End"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="rounded-lg p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {expandedId === exp.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === exp.id && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                        placeholder="Software Engineer"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Company *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="Acme Corp"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        placeholder="Berlin, DE"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="01/2023"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="12/2024"
                        disabled={exp.current}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? "Present" : "" })}
                      className="rounded accent-teal-500"
                    />
                    <span className="text-sm text-gray-600">I currently work here</span>
                  </label>

                  {/* Bullets */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600">Achievements & Responsibilities</label>
                      <button
                        onClick={() => updateExperience(exp.id, { bullets: [...exp.bullets, ""] })}
                        className="text-xs text-teal-600 hover:text-teal-500"
                      >
                        + Add bullet
                      </button>
                    </div>
                    <div className="space-y-2">
                      {exp.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="mt-2.5 text-gray-300">•</span>
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const bullets = [...exp.bullets];
                              bullets[idx] = e.target.value;
                              updateExperience(exp.id, { bullets });
                            }}
                            placeholder="Led cross-functional team to deliver..."
                            rows={2}
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                          />
                          <div className="flex flex-col gap-1 mt-1">
                            <button
                              onClick={() => improveBullet(exp.id, idx, bullet)}
                              disabled={!!loadingId}
                              title="Improve with AI"
                              className="rounded-lg p-1.5 text-teal-500 hover:bg-teal-50 transition-colors disabled:opacity-50"
                            >
                              {loadingId === `${exp.id}-${idx}` ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const bullets = exp.bullets.filter((_, i) => i !== idx);
                                updateExperience(exp.id, { bullets });
                              }}
                              className="rounded-lg p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
