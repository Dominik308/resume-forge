"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2, X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAIStore } from "@/stores/ai-store";

export default function SkillsForm() {
  const { resume, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const { targetJob } = useAIStore();
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});
  const [isSuggesting, setIsSuggesting] = useState(false);

  const addSkillToCategory = (categoryId: string) => {
    const skill = newSkill[categoryId]?.trim();
    if (!skill) return;
    const category = resume.skills.find((s) => s.id === categoryId);
    if (category) {
      updateSkillCategory(categoryId, { items: [...category.items, skill] });
      setNewSkill({ ...newSkill, [categoryId]: "" });
    }
  };

  const removeSkillFromCategory = (categoryId: string, skill: string) => {
    const category = resume.skills.find((s) => s.id === categoryId);
    if (category) {
      updateSkillCategory(categoryId, { items: category.items.filter((s) => s !== skill) });
    }
  };

  const suggestSkills = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          context: JSON.stringify({ experience: resume.experience.slice(0, 3), skills: resume.skills }),
          jobDescription: targetJob?.rawText || "",
        }),
      });
      const data = await res.json();
      const suggestions = data.result as { technical: string[]; soft: string[]; tools: string[] };

      // Auto-add suggested categories
      if (suggestions.technical?.length) {
        const existing = resume.skills.find((s) => s.category.toLowerCase().includes("technical"));
        if (existing) {
          updateSkillCategory(existing.id, { items: [...new Set([...existing.items, ...suggestions.technical])] });
        } else {
          addSkillCategory();
        }
      }
      toast.success("Skills suggested based on your experience!");
    } catch {
      toast.error("Failed to suggest skills");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500 mt-0.5">Organize your expertise by category</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={suggestSkills}
            disabled={isSuggesting}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI Suggest
          </button>
          <button
            onClick={addSkillCategory}
            className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
          >
            <Plus className="h-4 w-4" /> Category
          </button>
        </div>
      </div>

      {resume.skills.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <p className="text-gray-400 mb-4">No skill categories yet</p>
          <div className="flex gap-2 justify-center">
            {["Technical Skills", "Soft Skills", "Tools & Technologies"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  addSkillCategory();
                }}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors"
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {resume.skills.map((category) => (
            <div key={category.id} className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  value={category.category}
                  onChange={(e) => updateSkillCategory(category.id, { category: e.target.value })}
                  placeholder="e.g. Programming Languages"
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <button
                  onClick={() => removeSkillCategory(category.id)}
                  className="rounded-lg p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkillFromCategory(category.id, skill)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill[category.id] || ""}
                  onChange={(e) => setNewSkill({ ...newSkill, [category.id]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkillToCategory(category.id); } }}
                  placeholder="Add skill..."
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <button
                  onClick={() => addSkillToCategory(category.id)}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
