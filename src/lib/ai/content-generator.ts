import { callAI, callAIJSON } from "@/lib/ai/openai";
import { PROMPTS } from "@/lib/ai/prompts";
import type { ResumeData } from "@/types/resume";
import type {
  ResumeParseResult,
  JobAnalysisResult,
  ATSScoreResult,
  BulletImprovement,
} from "@/types/ai";

export async function parseResumeText(text: string): Promise<ResumeParseResult> {
  return callAIJSON<ResumeParseResult>(PROMPTS.PARSE_RESUME, text, {
    temperature: 0.1,
    maxTokens: 4096,
  });
}

export async function analyzeJobDescription(jobText: string): Promise<JobAnalysisResult> {
  return callAIJSON<JobAnalysisResult>(
    PROMPTS.ANALYZE_JOB,
    `Analyze this job description:\n\n${jobText}`,
    { temperature: 0.2, maxTokens: 2048 }
  );
}

export async function improveBulletPoint(
  bullet: string,
  jobDescription?: string
): Promise<string> {
  const userMessage = `Bullet point: ${bullet}${
    jobDescription ? `\n\nTarget job: ${jobDescription.slice(0, 500)}` : ""
  }`;
  return callAI(PROMPTS.IMPROVE_BULLET, userMessage, { temperature: 0.7, maxTokens: 256 });
}

export async function improveBulletPoints(
  bullets: string[],
  jobDescription?: string
): Promise<BulletImprovement[]> {
  const results: BulletImprovement[] = [];
  for (const bullet of bullets) {
    const improved = await improveBulletPoint(bullet, jobDescription);
    results.push({ original: bullet, improved, explanation: "" });
  }
  return results;
}

export async function generateSummary(
  resumeData: ResumeData,
  targetJob?: string
): Promise<string> {
  const context = `
Name: ${resumeData.personalInfo.name}
Title: ${resumeData.personalInfo.title || ""}
Experience: ${resumeData.experience.map((e) => `${e.title} at ${e.company}`).join(", ")}
Skills: ${resumeData.skills.map((s) => s.items.join(", ")).join(", ")}
${targetJob ? `Target Job: ${targetJob}` : ""}
  `.trim();

  return callAI(PROMPTS.GENERATE_SUMMARY, context, { temperature: 0.8, maxTokens: 512 });
}

export async function suggestSkills(
  resumeData: ResumeData,
  jobDescription?: string
): Promise<{ technical: string[]; soft: string[]; tools: string[]; certifications: string[] }> {
  const context = `
Experience: ${resumeData.experience.map((e) => `${e.title} at ${e.company}: ${e.bullets.join("; ")}`).join("\n")}
Current skills: ${resumeData.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n")}
${jobDescription ? `Target job:\n${jobDescription.slice(0, 1000)}` : ""}
  `.trim();

  return callAIJSON(PROMPTS.SUGGEST_SKILLS, context, { temperature: 0.5, maxTokens: 1024 });
}

export async function calculateATSScore(
  resumeData: ResumeData,
  jobDescription: string
): Promise<ATSScoreResult> {
  const resumeText = `
${resumeData.personalInfo.name}
${resumeData.summary}
${resumeData.experience.map((e) => `${e.title} at ${e.company}\n${e.bullets.join("\n")}`).join("\n")}
${resumeData.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n")}
  `.trim();

  return callAIJSON<ATSScoreResult>(
    PROMPTS.ATS_SCORE,
    `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
    { temperature: 0.2, maxTokens: 2048 }
  );
}

export async function tailorResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<unknown> {
  const resumeText = JSON.stringify(resumeData, null, 2);
  return callAIJSON(
    PROMPTS.TAILOR_RESUME,
    `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
    { temperature: 0.5, maxTokens: 4096 }
  );
}

export async function generateCoverLetter(
  resumeData: ResumeData,
  jobDescription: string
): Promise<string> {
  const context = `
Candidate: ${resumeData.personalInfo.name}
Title: ${resumeData.personalInfo.title}
Summary: ${resumeData.summary}
Top Experience: ${resumeData.experience.slice(0, 2).map((e) => `${e.title} at ${e.company}: ${e.bullets[0]}`).join("\n")}
Skills: ${resumeData.skills.slice(0, 3).map((s) => s.items.join(", ")).join(", ")}

Job Description:
${jobDescription}
  `.trim();

  return callAI(PROMPTS.COVER_LETTER, context, { temperature: 0.8, maxTokens: 1024 });
}

export async function rewriteText(text: string): Promise<string> {
  return callAI(PROMPTS.REWRITE_TEXT, text, { temperature: 0.7, maxTokens: 512 });
}

export async function makeTextConcise(text: string): Promise<string> {
  return callAI(PROMPTS.MAKE_CONCISE, text, { temperature: 0.6, maxTokens: 512 });
}

export interface OptimizeResult {
  summary: string;
  experience: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  skills: {
    id: string;
    category: string;
    items: string[];
  }[];
  addedSkills: string[];
  changes: { section: string; description: string }[];
}

export async function optimizeResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<OptimizeResult> {
  const resumeText = JSON.stringify({
    summary: resumeData.summary,
    experience: resumeData.experience,
    skills: resumeData.skills,
    personalInfo: {
      name: resumeData.personalInfo.name,
      title: resumeData.personalInfo.title,
    },
  }, null, 2);

  return callAIJSON<OptimizeResult>(
    PROMPTS.OPTIMIZE_RESUME,
    `Current Resume:\n${resumeText}\n\nTarget Job Description:\n${jobDescription}`,
    { temperature: 0.5, maxTokens: 4096 }
  );
}
