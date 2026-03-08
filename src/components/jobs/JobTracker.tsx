"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Search,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface JobAnalysis {
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  experienceLevel: string;
  educationRequirements: string[];
}

interface SavedJob {
  id: string;
  description: string;
  analysis: JobAnalysis | null;
  createdAt: Date;
}

export default function JobTracker() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      const newJob: SavedJob = {
        id: Date.now().toString(),
        description: jobDescription,
        analysis: data.result,
        createdAt: new Date(),
      };

      setSavedJobs((prev) => [newJob, ...prev]);
      setExpandedJob(newJob.id);
      setJobDescription("");
      toast.success("Job analyzed successfully!");
    } catch {
      toast.error("Failed to analyze job. Make sure Ollama is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Input */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-600" />
            Paste Job Description
          </h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={12}
            className="w-full border border-gray-200 rounded-lg p-4 text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">
              {jobDescription.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>
        </div>

        {/* Quick tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800">
          <h3 className="font-semibold mb-2">💡 Tips</h3>
          <ul className="space-y-1 text-blue-700">
            <li>• Paste the complete job description for best results</li>
            <li>• AI will extract skills, requirements, and keywords</li>
            <li>• Use the analysis to tailor your resume in the editor</li>
          </ul>
        </div>
      </div>

      {/* Right: Analyzed Jobs */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          Analyzed Jobs ({savedJobs.length})
        </h2>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs analyzed yet</p>
            <p className="text-sm mt-1">Paste a job description and click Analyze</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {job.analysis?.title || "Untitled Job"}
                    </h3>
                    {job.analysis?.company && (
                      <p className="text-sm text-gray-500">{job.analysis.company}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Analyzed {job.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  {expandedJob === job.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {expandedJob === job.id && job.analysis && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                    {/* Required Skills */}
                    {job.analysis.requiredSkills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.analysis.requiredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Skills */}
                    {job.analysis.preferredSkills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          Preferred Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.analysis.preferredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    {job.analysis.keywords.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          ATS Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.analysis.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Level */}
                    {job.analysis.experienceLevel && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Experience Level: </span>
                        <span className="text-gray-600">{job.analysis.experienceLevel}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
