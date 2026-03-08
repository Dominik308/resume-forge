"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2, Sparkles, ExternalLink, Github } from "lucide-react";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors";

export default function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();
  const [improvingId, setImprovingId] = useState<string | null>(null);

  const improveDescription = async (id: string, description: string) => {
    if (!description.trim()) {
      toast.error("Please enter a description first");
      return;
    }
    setImprovingId(id);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rewrite", text: description }),
      });
      const data = await res.json();
      if (data.result) {
        updateProject(id, { description: typeof data.result === "string" ? data.result : description });
        toast.success("Description improved!");
      }
    } catch {
      toast.error("Failed to improve description");
    } finally {
      setImprovingId(null);
    }
  };

  const addTechnology = (id: string, currentTechs: string[], tech: string) => {
    const trimmed = tech.trim();
    if (trimmed && !currentTechs.includes(trimmed)) {
      updateProject(id, { technologies: [...currentTechs, trimmed] });
    }
  };

  const removeTechnology = (id: string, currentTechs: string[], tech: string) => {
    updateProject(id, { technologies: currentTechs.filter((t) => t !== tech) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: "#1a365d" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">Showcase your personal and professional projects.</p>

      {resume.projects.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">No projects yet. Click &quot;Add Project&quot; to get started.</p>
        </div>
      )}

      <div className="space-y-5">
        {resume.projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 truncate">
                {project.name || "New Project"}
              </span>
              <button
                onClick={() => removeProject(project.id)}
                className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                placeholder="ResumeForge AI"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Description</label>
                <button
                  onClick={() => improveDescription(project.id, project.description)}
                  disabled={improvingId === project.id}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded text-white disabled:opacity-50"
                  style={{ backgroundColor: "#319795" }}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {improvingId === project.id ? "Improving…" : "AI Improve"}
                </button>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                placeholder="A brief description of what this project does and its impact…"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Technologies</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(project.id, project.technologies, tech)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a technology and press Enter…"
                className={inputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechnology(project.id, project.technologies, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Live URL
                </label>
                <input
                  type="url"
                  value={project.url || ""}
                  onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  placeholder="https://myproject.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={project.github || ""}
                  onChange={(e) => updateProject(project.id, { github: e.target.value })}
                  placeholder="https://github.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
