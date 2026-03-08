export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ResumeParseResult {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
    highlights: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url: string;
  }[];
}

export interface JobAnalysisResult {
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  experienceLevel: string;
  educationRequirements: string[];
  companyCulture: string[];
}

export interface ATSScoreResult {
  score: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    completeness: number;
    readability: number;
  };
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
}

export interface AIGenerateRequest {
  type: "bullet" | "summary" | "skills" | "cover-letter" | "tailor";
  context: string;
  jobDescription?: string;
  resumeData?: unknown;
  existingText?: string;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  explanation: string;
}
