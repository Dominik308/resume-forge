"use client";

import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2 } from "lucide-react";
import type { LanguageEntry } from "@/types/resume";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors";

const PROFICIENCY_LEVELS: LanguageEntry["proficiency"][] = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
];

export default function LanguagesForm() {
  const { resume, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Languages</h2>
        <button
          onClick={addLanguage}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: "#1a365d" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Language
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">List the languages you speak and your proficiency level.</p>

      {resume.languages.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">No languages yet. Click &quot;Add Language&quot; to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {resume.languages.map((lang) => (
          <div key={lang.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{lang.language || "New Language"}</span>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                  placeholder="e.g. German"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Proficiency</label>
                <select
                  value={lang.proficiency}
                  onChange={(e) =>
                    updateLanguage(lang.id, { proficiency: e.target.value as LanguageEntry["proficiency"] })
                  }
                  className={inputClass}
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual proficiency bar */}
            <div>
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width:
                      lang.proficiency === "Native"
                        ? "100%"
                        : lang.proficiency === "Fluent"
                        ? "85%"
                        : lang.proficiency === "Advanced"
                        ? "70%"
                        : lang.proficiency === "Intermediate"
                        ? "50%"
                        : "30%",
                    backgroundColor: "#319795",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
