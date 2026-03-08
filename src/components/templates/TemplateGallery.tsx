"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/types/template";
import { DEFAULT_RESUME_DATA, DEFAULT_COLOR_SCHEMES } from "@/types/resume";
import ResumePreview from "@/components/resume/ResumePreview";
import { toast } from "sonner";
import { Eye, Plus, Crown, Search } from "lucide-react";

const CATEGORIES = [
  "all",
  "modern",
  "minimalist",
  "creative",
  "professional",
  "tech",
  "elegant",
  "bold",
  "classic",
] as const;

const SAMPLE_DATA = {
  ...DEFAULT_RESUME_DATA,
  personalInfo: {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    address: "New York, NY",
    linkedin: "linkedin.com/in/sarahjohnson",
    website: "sarahjohnson.dev",
    github: "github.com/sarahjohnson",
    title: "Senior Product Designer",
    headline: "Creating user-centered digital experiences that drive business growth",
  },
  summary:
    "Award-winning product designer with 7+ years of experience creating intuitive digital experiences for Fortune 500 companies. Specialized in design systems, user research, and cross-functional team leadership.",
  experience: [
    {
      id: "1",
      title: "Senior Product Designer",
      company: "TechCorp",
      location: "New York, NY",
      startDate: "01/2022",
      endDate: "",
      current: true,
      bullets: [
        "Led redesign of core product reducing user drop-off by 35%",
        "Built and maintained design system used by 12 product teams",
      ],
    },
    {
      id: "2",
      title: "Product Designer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "06/2019",
      endDate: "12/2021",
      current: false,
      bullets: [
        "Designed mobile app reaching 500K+ downloads in first year",
        "Conducted 100+ user interviews to drive product decisions",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "B.A. Interaction Design",
      institution: "Parsons School of Design",
      location: "New York, NY",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.9",
      highlights: ["Summa Cum Laude"],
    },
  ],
  skills: [
    { id: "1", category: "Design", items: ["Figma", "Sketch", "Adobe XD", "Prototyping"] },
    { id: "2", category: "Research", items: ["User Testing", "A/B Testing", "Analytics"] },
  ],
  languages: [
    { id: "1", language: "English", proficiency: "Native" as const },
    { id: "2", language: "Spanish", proficiency: "Advanced" as const },
  ],
  certifications: [
    { id: "1", name: "Google UX Design Certificate", issuer: "Google", date: "2023" },
  ],
};

export default function TemplateGallery() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = async (templateId: string) => {
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Resume",
          templateId,
          colorScheme: DEFAULT_COLOR_SCHEMES[
            TEMPLATES.find((t) => t.id === templateId)?.defaultColorScheme || "default"
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed to create resume");
      const data = await res.json();
      router.push(`/resumes/${data.id}/edit`);
    } catch {
      toast.error("Failed to create resume. Please try again.");
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Preview thumbnail */}
            <div className="relative aspect-[210/297] overflow-hidden bg-gray-50">
              <div className="absolute inset-0 scale-[0.35] origin-top-left" style={{ width: "285%", height: "285%" }}>
                <ResumePreview
                  data={{
                    ...SAMPLE_DATA,
                    templateId: tpl.id,
                    colorScheme:
                      DEFAULT_COLOR_SCHEMES[tpl.defaultColorScheme] || DEFAULT_COLOR_SCHEMES.default,
                  }}
                  isPrint={false}
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPreviewTemplate(tpl.id)}
                  className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Preview"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleUseTemplate(tpl.id)}
                  className="p-2.5 bg-teal-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Use this template"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Pro badge */}
              {tpl.isPro && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Crown className="h-3 w-3" />
                  PRO
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {tpl.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No templates found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                {TEMPLATES.find((t) => t.id === previewTemplate)?.name} Template
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
                >
                  Use Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <ResumePreview
                data={{
                  ...SAMPLE_DATA,
                  templateId: previewTemplate,
                  colorScheme:
                    DEFAULT_COLOR_SCHEMES[
                      TEMPLATES.find((t) => t.id === previewTemplate)?.defaultColorScheme || "default"
                    ] || DEFAULT_COLOR_SCHEMES.default,
                }}
                isPrint={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
