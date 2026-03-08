export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  photo?: string;
  title?: string;
  headline?: string;
  github?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  description?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
  skillItems?: Skill[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  credentialId?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  sidebar?: string;
}

export interface FontConfig {
  headingFont: string;
  bodyFont: string;
  fontSize: "small" | "medium" | "large";
  lineHeight?: "compact" | "normal" | "spacious";
}

export const DEFAULT_SECTION_ORDER = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export interface ResumeData {
  id?: string;
  userId?: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  customSections: CustomSection[];
  editorState?: EditorState;
  colorScheme: ColorScheme;
  fontConfig: FontConfig;
  sectionOrder?: string[];
  hiddenSections?: string[];
  targetJobId?: string;
  atsScore?: number;
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditorState {
  sectionOrder: string[];
  zoom: number;
  selectedSection?: string;
  history: ResumeData[];
  historyIndex: number;
}

export const DEFAULT_COLOR_SCHEMES: Record<string, ColorScheme> = {
  default: {
    primary: "#1a365d",
    secondary: "#2d3748",
    accent: "#319795",
    text: "#1a202c",
    background: "#ffffff",
    sidebar: "#1a365d",
  },
  ocean: {
    primary: "#1e40af",
    secondary: "#1e3a5f",
    accent: "#0ea5e9",
    text: "#1e293b",
    background: "#ffffff",
    sidebar: "#1e40af",
  },
  forest: {
    primary: "#14532d",
    secondary: "#1a3a2a",
    accent: "#16a34a",
    text: "#1a2e1e",
    background: "#ffffff",
    sidebar: "#14532d",
  },
  sunset: {
    primary: "#9a3412",
    secondary: "#7c2d12",
    accent: "#f97316",
    text: "#1c1917",
    background: "#ffffff",
    sidebar: "#9a3412",
  },
  violet: {
    primary: "#4c1d95",
    secondary: "#3b0764",
    accent: "#8b5cf6",
    text: "#1e1b4b",
    background: "#ffffff",
    sidebar: "#4c1d95",
  },
  rose: {
    primary: "#881337",
    secondary: "#9f1239",
    accent: "#f43f5e",
    text: "#1c1917",
    background: "#ffffff",
    sidebar: "#881337",
  },
  slate: {
    primary: "#1e293b",
    secondary: "#334155",
    accent: "#64748b",
    text: "#0f172a",
    background: "#ffffff",
    sidebar: "#1e293b",
  },
  gold: {
    primary: "#78350f",
    secondary: "#451a03",
    accent: "#d97706",
    text: "#1c1917",
    background: "#ffffff",
    sidebar: "#78350f",
  },
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  title: "My Resume",
  templateId: "modern",
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    github: "",
    headline: "",
    title: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  colorScheme: DEFAULT_COLOR_SCHEMES.default,
  fontConfig: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "medium",
    lineHeight: "normal",
  },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: [],
};

// ─── Type Guards ───────────────────────────────────────────────────────────

export function isResumeData(obj: unknown): obj is ResumeData {
  if (!obj || typeof obj !== "object") return false;
  const data = obj as Record<string, unknown>;
  return (
    typeof data.title === "string" &&
    typeof data.templateId === "string" &&
    typeof data.personalInfo === "object" &&
    data.personalInfo !== null &&
    Array.isArray(data.experience) &&
    Array.isArray(data.education) &&
    Array.isArray(data.skills)
  );
}

export function isPersonalInfo(obj: unknown): obj is PersonalInfo {
  if (!obj || typeof obj !== "object") return false;
  const data = obj as Record<string, unknown>;
  return typeof data.name === "string" && typeof data.email === "string";
}

export function isSkill(obj: unknown): obj is Skill {
  if (!obj || typeof obj !== "object") return false;
  const data = obj as Record<string, unknown>;
  return (
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.level === "number" &&
    data.level >= 1 &&
    data.level <= 5
  );
}
