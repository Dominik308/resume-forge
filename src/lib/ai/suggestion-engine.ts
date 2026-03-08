/**
 * Suggestion Engine — Real-time resume guidance based on job descriptions.
 * Runs entirely client-side for instant feedback. No AI API calls needed.
 * Analyzes resume data vs job description and provides section-by-section actionable suggestions.
 */

import type { ResumeData } from "@/types/resume";

// ─── Types ──────────────────────────────────────────────────────────────────

export type SuggestionPriority = "critical" | "high" | "medium" | "low";
export type SuggestionSection =
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "personal"
  | "general"
  | "keywords"
  | "formatting";

export interface Suggestion {
  id: string;
  section: SuggestionSection;
  priority: SuggestionPriority;
  title: string;
  description: string;
  actionLabel?: string; // e.g., "Add Skill", "Rewrite Summary"
  autoFixable?: boolean;
  data?: Record<string, unknown>; // Extra data for auto-fix
}

export interface ResumeScore {
  overall: number;
  sections: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
    keywords: number;
    formatting: number;
  };
}

export interface SuggestionEngineResult {
  score: ResumeScore;
  suggestions: Suggestion[];
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGap: { required: string[]; missing: string[] };
}

// ─── Keyword Extraction ─────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "shall",
  "should", "may", "might", "must", "can", "could", "and", "but", "or",
  "nor", "not", "so", "yet", "for", "of", "in", "on", "at", "to", "from",
  "by", "with", "as", "into", "through", "during", "before", "after",
  "above", "below", "between", "under", "over", "this", "that", "these",
  "those", "it", "its", "we", "our", "you", "your", "they", "their",
  "who", "which", "what", "when", "where", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "no", "only",
  "own", "same", "than", "too", "very", "also", "just", "about", "up",
  "out", "if", "then", "them", "him", "her", "any", "many", "much",
  "well", "new", "work", "working", "ability", "strong", "etc", "e.g",
  "i.e", "including", "requirements", "required", "preferred", "minimum",
  "experience", "years", "year", "responsibilities", "qualifications",
  "job", "position", "role", "company", "team", "candidate", "looking",
  "join", "apply", "opportunity", "based", "will", "using",
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Also extract multi-word phrases (bigrams for technical terms)
  const bigrams: string[] = [];
  const wordArray = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < wordArray.length - 1; i++) {
    const bigram = `${wordArray[i]} ${wordArray[i + 1]}`.replace(/[^a-z0-9+#.\s-]/g, "");
    if (bigram.length > 5) bigrams.push(bigram);
  }

  return [...new Set([...words, ...bigrams])];
}

function extractSkillsFromText(text: string): string[] {
  // Common technical skills patterns
  const skillPatterns = [
    /\b(?:javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r|matlab)\b/gi,
    /\b(?:react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|rails|laravel)\b/gi,
    /\b(?:aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd|devops)\b/gi,
    /\b(?:sql|nosql|mongodb|postgresql|mysql|redis|elasticsearch|dynamodb|graphql)\b/gi,
    /\b(?:html|css|sass|tailwind|bootstrap|figma|sketch|adobe)\b/gi,
    /\b(?:git|github|gitlab|jira|confluence|agile|scrum|kanban)\b/gi,
    /\b(?:machine learning|deep learning|data science|artificial intelligence|ai|ml|nlp)\b/gi,
    /\b(?:rest|api|microservices|serverless|cloud|saas|paas)\b/gi,
    /\b(?:linux|unix|windows|macos|networking|security|cybersecurity)\b/gi,
    /\b(?:project management|product management|stakeholder|leadership|communication)\b/gi,
    /\b(?:testing|qa|automation|selenium|cypress|jest|pytest)\b/gi,
    /\b(?:data analysis|analytics|tableau|power bi|excel|statistics)\b/gi,
  ];

  const skills: string[] = [];
  for (const pattern of skillPatterns) {
    const matches = text.match(pattern);
    if (matches) skills.push(...matches.map((m) => m.toLowerCase()));
  }
  return [...new Set(skills)];
}

// ─── Resume Text Extraction ─────────────────────────────────────────────────

function getResumeFullText(resume: ResumeData): string {
  const parts: string[] = [];

  if (resume.summary) parts.push(resume.summary);

  for (const exp of resume.experience) {
    parts.push(exp.title, exp.company);
    parts.push(...exp.bullets);
  }

  for (const edu of resume.education) {
    parts.push(edu.degree, edu.institution);
    if (edu.highlights) parts.push(...edu.highlights);
  }

  for (const skill of resume.skills) {
    parts.push(skill.category);
    parts.push(...skill.items);
  }

  for (const proj of resume.projects) {
    parts.push(proj.name, proj.description || "");
    if (proj.technologies) parts.push(...proj.technologies);
  }

  for (const cert of resume.certifications) {
    parts.push(cert.name, cert.issuer || "");
  }

  return parts.join(" ");
}

// ─── Scoring Functions ──────────────────────────────────────────────────────

function scoreSummary(resume: ResumeData, jobKeywords: string[]): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = [];
  let score = 0;

  if (!resume.summary || resume.summary.trim().length === 0) {
    suggestions.push({
      id: "summary-missing",
      section: "summary",
      priority: "critical",
      title: "Add a Professional Summary",
      description: "A strong summary is the first thing recruiters read. It should highlight your key qualifications in 3-4 sentences.",
      actionLabel: "Generate Summary",
      autoFixable: true,
    });
    return { score: 0, suggestions };
  }

  // Length check
  const wordCount = resume.summary.split(/\s+/).length;
  if (wordCount < 20) {
    score += 20;
    suggestions.push({
      id: "summary-too-short",
      section: "summary",
      priority: "high",
      title: "Summary Too Short",
      description: `Your summary has only ${wordCount} words. Aim for 40-60 words to make a strong first impression.`,
      actionLabel: "Expand Summary",
      autoFixable: true,
    });
  } else if (wordCount > 80) {
    score += 40;
    suggestions.push({
      id: "summary-too-long",
      section: "summary",
      priority: "medium",
      title: "Summary Too Long",
      description: `Your summary has ${wordCount} words. Keep it concise at 40-60 words for maximum impact.`,
    });
  } else {
    score += 60;
  }

  // Keyword presence in summary
  const summaryLower = resume.summary.toLowerCase();
  const matchedInSummary = jobKeywords.filter((kw) => summaryLower.includes(kw));
  const keywordRatio = jobKeywords.length > 0 ? matchedInSummary.length / Math.min(jobKeywords.length, 5) : 0.5;
  score += Math.round(keywordRatio * 40);

  if (keywordRatio < 0.3 && jobKeywords.length > 0) {
    const topMissing = jobKeywords.filter((kw) => !summaryLower.includes(kw)).slice(0, 3);
    suggestions.push({
      id: "summary-keywords",
      section: "summary",
      priority: "high",
      title: "Add Job Keywords to Summary",
      description: `Your summary is missing key terms: ${topMissing.join(", ")}. Incorporate these naturally.`,
      actionLabel: "Rewrite Summary",
      autoFixable: true,
      data: { missingKeywords: topMissing },
    });
  }

  return { score: Math.min(100, score), suggestions };
}

function scoreExperience(resume: ResumeData, jobKeywords: string[]): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = [];
  let score = 0;

  if (resume.experience.length === 0) {
    suggestions.push({
      id: "exp-missing",
      section: "experience",
      priority: "critical",
      title: "Add Work Experience",
      description: "Work experience is the most important section. Add at least one position with 3-5 bullet points.",
    });
    return { score: 0, suggestions };
  }

  // Has experience
  score += 30;

  // Check bullet quality
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let bulletsWithActionVerbs = 0;
  let shortBullets = 0;

  const actionVerbs = [
    "led", "developed", "managed", "created", "implemented", "designed",
    "increased", "reduced", "improved", "built", "established", "generated",
    "delivered", "achieved", "launched", "optimized", "streamlined",
    "orchestrated", "spearheaded", "transformed", "automated", "drove",
    "negotiated", "mentored", "analyzed", "resolved", "collaborated",
  ];

  for (const exp of resume.experience) {
    for (const bullet of exp.bullets) {
      totalBullets++;
      const bulletLower = bullet.toLowerCase().trim();

      // Check for metrics/numbers
      if (/\d+%|\$\d+|\d+\+|\d+x|million|billion/i.test(bullet)) {
        bulletsWithMetrics++;
      }

      // Check for action verbs
      const firstWord = bulletLower.split(/\s/)[0];
      if (actionVerbs.some((v) => firstWord?.startsWith(v))) {
        bulletsWithActionVerbs++;
      }

      // Check length
      if (bulletLower.split(/\s+/).length < 8) {
        shortBullets++;
      }
    }

    // Check for too few bullets
    if (exp.bullets.length < 2) {
      suggestions.push({
        id: `exp-few-bullets-${exp.id}`,
        section: "experience",
        priority: "high",
        title: `Add More Bullets: ${exp.title}`,
        description: `"${exp.title}" at ${exp.company} only has ${exp.bullets.length} bullet point(s). Aim for 3-5 per role.`,
      });
    }
  }

  // Metrics scoring
  if (totalBullets > 0) {
    const metricRatio = bulletsWithMetrics / totalBullets;
    score += Math.round(metricRatio * 25);
    if (metricRatio < 0.3) {
      suggestions.push({
        id: "exp-no-metrics",
        section: "experience",
        priority: "high",
        title: "Add Quantifiable Metrics",
        description: `Only ${Math.round(metricRatio * 100)}% of your bullets include numbers/metrics. Aim for 50%+ with specific achievements like "increased revenue by 30%".`,
        actionLabel: "Improve Bullets",
        autoFixable: true,
      });
    }
  }

  // Action verbs scoring
  if (totalBullets > 0) {
    const actionRatio = bulletsWithActionVerbs / totalBullets;
    score += Math.round(actionRatio * 20);
    if (actionRatio < 0.5) {
      suggestions.push({
        id: "exp-action-verbs",
        section: "experience",
        priority: "medium",
        title: "Use Stronger Action Verbs",
        description: "Start bullet points with powerful action verbs like Led, Developed, Implemented, Achieved.",
      });
    }
  }

  // Keyword match in experience
  const expText = resume.experience.map((e) => [e.title, ...e.bullets].join(" ")).join(" ").toLowerCase();
  const matchedInExp = jobKeywords.filter((kw) => expText.includes(kw));
  const expKeywordRatio = jobKeywords.length > 0 ? matchedInExp.length / jobKeywords.length : 0.5;
  score += Math.round(expKeywordRatio * 25);

  if (expKeywordRatio < 0.4 && jobKeywords.length > 3) {
    const missing = jobKeywords.filter((kw) => !expText.includes(kw)).slice(0, 5);
    suggestions.push({
      id: "exp-keywords",
      section: "experience",
      priority: "high",
      title: "Incorporate Job Keywords",
      description: `Your experience section is missing these terms from the job: ${missing.join(", ")}`,
      data: { missingKeywords: missing },
    });
  }

  // Short bullets warning
  if (shortBullets > 2) {
    suggestions.push({
      id: "exp-short-bullets",
      section: "experience",
      priority: "medium",
      title: "Expand Thin Bullet Points",
      description: `${shortBullets} bullet points are too brief. Add context, impact, and results to make them more compelling.`,
    });
  }

  return { score: Math.min(100, score), suggestions };
}

function scoreSkills(resume: ResumeData, jobSkills: string[]): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = [];
  let score = 0;

  const allResumeSkills = resume.skills.flatMap((s) => s.items.map((i) => i.toLowerCase()));

  if (allResumeSkills.length === 0) {
    suggestions.push({
      id: "skills-missing",
      section: "skills",
      priority: "critical",
      title: "Add Skills Section",
      description: "Most ATS systems scan for specific skills. Add a categorized skills section with relevant technical and soft skills.",
      actionLabel: "Suggest Skills",
      autoFixable: true,
    });
    return { score: 0, suggestions };
  }

  score += 30;

  // Skill match analysis
  const matched = jobSkills.filter((js) =>
    allResumeSkills.some((rs) => rs.includes(js) || js.includes(rs))
  );
  const missing = jobSkills.filter((js) =>
    !allResumeSkills.some((rs) => rs.includes(js) || js.includes(rs))
  );

  const matchRatio = jobSkills.length > 0 ? matched.length / jobSkills.length : 0.5;
  score += Math.round(matchRatio * 50);

  if (missing.length > 0) {
    const criticalMissing = missing.slice(0, 6);
    suggestions.push({
      id: "skills-gap",
      section: "skills",
      priority: missing.length > 3 ? "critical" : "high",
      title: `Missing ${missing.length} Job Skills`,
      description: `Add these skills if you have them: ${criticalMissing.join(", ")}${missing.length > 6 ? ` +${missing.length - 6} more` : ""}`,
      actionLabel: "Add Missing Skills",
      autoFixable: true,
      data: { missingSkills: missing },
    });
  }

  // Category organization
  if (resume.skills.length === 1) {
    score += 5;
    suggestions.push({
      id: "skills-organize",
      section: "skills",
      priority: "low",
      title: "Organize Skills into Categories",
      description: "Group skills into categories like Technical, Tools, Frameworks, Soft Skills for better readability.",
    });
  } else {
    score += 20;
  }

  return { score: Math.min(100, score), suggestions };
}

function scoreEducation(resume: ResumeData): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = [];
  let score = 0;

  if (resume.education.length === 0) {
    suggestions.push({
      id: "edu-missing",
      section: "education",
      priority: "medium",
      title: "Add Education",
      description: "While not always required, listing your education helps ATS matching and credibility.",
    });
    return { score: 50, suggestions }; // Still okay for experienced professionals
  }

  score += 70;

  for (const edu of resume.education) {
    if (!edu.degree) {
      suggestions.push({
        id: `edu-no-degree-${edu.id}`,
        section: "education",
        priority: "medium",
        title: "Specify Degree",
        description: `Add the degree name for your education at ${edu.institution || "your institution"}.`,
      });
    }
    if (!edu.institution) {
      suggestions.push({
        id: `edu-no-institution-${edu.id}`,
        section: "education",
        priority: "medium",
        title: "Add Institution Name",
        description: "Specify the school or university name for each education entry.",
      });
    }
    if (edu.highlights && edu.highlights.length > 0) {
      score += 15;
    }
    if (edu.gpa) {
      score += 15;
    }
  }

  return { score: Math.min(100, score), suggestions };
}

function scoreFormatting(resume: ResumeData): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = [];
  let score = 60; // Base formatting score

  // Personal info completeness
  const pi = resume.personalInfo;
  if (!pi.name) {
    suggestions.push({ id: "fmt-no-name", section: "personal", priority: "critical", title: "Add Your Name", description: "Your name is the most basic requirement." });
    score -= 20;
  }
  if (!pi.email) {
    suggestions.push({ id: "fmt-no-email", section: "personal", priority: "critical", title: "Add Email Address", description: "Recruiters need your email to contact you." });
    score -= 15;
  }
  if (!pi.phone) {
    suggestions.push({ id: "fmt-no-phone", section: "personal", priority: "high", title: "Add Phone Number", description: "Most employers prefer a phone number for quick contact." });
    score -= 10;
  }
  if (!pi.title) {
    suggestions.push({ id: "fmt-no-title", section: "personal", priority: "high", title: "Add Professional Title", description: "A title like 'Software Engineer' immediately tells recruiters your role." });
    score -= 10;
  }

  // LinkedIn
  if (pi.linkedin) {
    score += 10;
  } else {
    suggestions.push({
      id: "fmt-no-linkedin",
      section: "personal",
      priority: "low",
      title: "Add LinkedIn Profile",
      description: "87% of recruiters use LinkedIn. Adding your profile URL shows professionalism.",
    });
  }

  // Section completeness
  const sectionCount = [
    resume.summary ? 1 : 0,
    resume.experience.length > 0 ? 1 : 0,
    resume.education.length > 0 ? 1 : 0,
    resume.skills.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  score += sectionCount * 10;

  return { score: Math.min(100, Math.max(0, score)), suggestions };
}

// ─── Main Engine ─────────────────────────────────────────────────────────────

export function analyzeResume(
  resume: ResumeData,
  jobDescription?: string
): SuggestionEngineResult {
  // Extract keywords from job description
  const jobText = jobDescription || "";
  const jobKeywords = jobText ? extractKeywords(jobText).slice(0, 30) : [];
  const jobSkills = jobText ? extractSkillsFromText(jobText) : [];

  // Get resume text for comparison
  const resumeText = getResumeFullText(resume).toLowerCase();

  // Score each section
  const summaryResult = scoreSummary(resume, jobKeywords);
  const experienceResult = scoreExperience(resume, jobKeywords);
  const skillsResult = scoreSkills(resume, jobSkills);
  const educationResult = scoreEducation(resume);
  const formattingResult = scoreFormatting(resume);

  // Keyword analysis
  const matchedKeywords = jobKeywords.filter((kw) => resumeText.includes(kw));
  const missingKeywords = jobKeywords.filter((kw) => !resumeText.includes(kw));

  // Keyword score
  const keywordScore = jobKeywords.length > 0
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 70; // Default when no JD provided

  // Overall score (weighted)
  const overall = Math.round(
    summaryResult.score * 0.15 +
    experienceResult.score * 0.30 +
    skillsResult.score * 0.25 +
    educationResult.score * 0.05 +
    keywordScore * 0.15 +
    formattingResult.score * 0.10
  );

  // Combine all suggestions, sorted by priority
  const priorityOrder: Record<SuggestionPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const allSuggestions = [
    ...summaryResult.suggestions,
    ...experienceResult.suggestions,
    ...skillsResult.suggestions,
    ...educationResult.suggestions,
    ...formattingResult.suggestions,
  ].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Add missing keyword suggestion if significant
  if (missingKeywords.length > 5 && jobDescription) {
    allSuggestions.splice(2, 0, {
      id: "keywords-missing",
      section: "keywords",
      priority: "high",
      title: `${missingKeywords.length} Missing Keywords`,
      description: `Your resume is missing ${missingKeywords.length} keywords from the job description. Top missing: ${missingKeywords.slice(0, 5).join(", ")}`,
      data: { missingKeywords },
    });
  }

  return {
    score: {
      overall,
      sections: {
        summary: summaryResult.score,
        experience: experienceResult.score,
        skills: skillsResult.score,
        education: educationResult.score,
        keywords: keywordScore,
        formatting: formattingResult.score,
      },
    },
    suggestions: allSuggestions,
    matchedKeywords,
    missingKeywords,
    skillGap: {
      required: jobSkills,
      missing: jobSkills.filter(
        (js) => !resume.skills.flatMap((s) => s.items.map((i) => i.toLowerCase())).some(
          (rs) => rs.includes(js) || js.includes(rs)
        )
      ),
    },
  };
}
