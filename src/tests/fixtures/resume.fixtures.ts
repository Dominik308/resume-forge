import type { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, SkillCategory, ProjectEntry, CertificationEntry, LanguageEntry } from "@/types/resume";

export const MOCK_PERSONAL_INFO: PersonalInfo = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  address: "San Francisco, CA",
  linkedin: "https://linkedin.com/in/johndoe",
  website: "https://johndoe.dev",
  github: "https://github.com/johndoe",
  title: "Senior Software Engineer",
  headline: "Full-stack developer passionate about creating impactful solutions",
  photo: "",
};

export const MOCK_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "exp-1",
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    startDate: "01/2022",
    endDate: "",
    current: true,
    bullets: [
      "Led development of microservices architecture serving 1M+ daily requests",
      "Reduced API response time by 40% through optimization",
      "Mentored team of 5 junior developers",
    ],
  },
  {
    id: "exp-2",
    title: "Software Engineer",
    company: "StartupCo",
    location: "Remote",
    startDate: "06/2019",
    endDate: "12/2021",
    current: false,
    bullets: [
      "Built React-based dashboard used by 500+ enterprise clients",
      "Implemented CI/CD pipeline reducing deployment time by 60%",
    ],
  },
];

export const MOCK_EDUCATION: EducationEntry[] = [
  {
    id: "edu-1",
    degree: "B.S. Computer Science",
    institution: "University of California, Berkeley",
    location: "Berkeley, CA",
    startDate: "08/2015",
    endDate: "05/2019",
    gpa: "3.8",
    highlights: ["Dean's List", "CS Honor Society"],
  },
];

export const MOCK_SKILLS: SkillCategory[] = [
  {
    id: "skill-1",
    category: "Programming Languages",
    items: ["TypeScript", "Python", "Go", "Rust"],
  },
  {
    id: "skill-2",
    category: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Express"],
  },
  {
    id: "skill-3",
    category: "Tools & Platforms",
    items: ["AWS", "Docker", "Kubernetes", "PostgreSQL"],
  },
];

export const MOCK_PROJECTS: ProjectEntry[] = [
  {
    id: "proj-1",
    name: "ResumeForge AI",
    description: "AI-powered resume builder with template system",
    technologies: ["Next.js", "TypeScript", "Ollama", "Prisma"],
    url: "https://resumeforge.dev",
    github: "https://github.com/johndoe/resumeforge",
  },
];

export const MOCK_CERTIFICATIONS: CertificationEntry[] = [
  {
    id: "cert-1",
    name: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    date: "03/2023",
    url: "https://aws.amazon.com/cert/123",
    credentialId: "AWS-SAA-C03",
  },
];

export const MOCK_LANGUAGES: LanguageEntry[] = [
  { id: "lang-1", language: "English", proficiency: "Native" },
  { id: "lang-2", language: "German", proficiency: "Fluent" },
  { id: "lang-3", language: "Spanish", proficiency: "Intermediate" },
];

export const MOCK_RESUME_DATA: ResumeData = {
  id: "resume-1",
  userId: "user-1",
  title: "Senior Software Engineer Resume",
  templateId: "modern",
  personalInfo: MOCK_PERSONAL_INFO,
  summary:
    "Experienced full-stack engineer with 5+ years building scalable web applications. Specialized in React, TypeScript, and cloud architecture. Proven track record of leading teams and delivering high-impact projects.",
  experience: MOCK_EXPERIENCE,
  education: MOCK_EDUCATION,
  skills: MOCK_SKILLS,
  projects: MOCK_PROJECTS,
  certifications: MOCK_CERTIFICATIONS,
  languages: MOCK_LANGUAGES,
  customSections: [],
  colorScheme: {
    primary: "#1a365d",
    secondary: "#2d3748",
    accent: "#319795",
    text: "#1a202c",
    background: "#ffffff",
    sidebar: "#1a365d",
  },
  fontConfig: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "medium",
  },
};

export const MOCK_EMPTY_RESUME: ResumeData = {
  title: "Untitled Resume",
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
  colorScheme: {
    primary: "#1a365d",
    secondary: "#2d3748",
    accent: "#319795",
    text: "#1a202c",
    background: "#ffffff",
    sidebar: "#1a365d",
  },
  fontConfig: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "medium",
  },
};

export const MOCK_JOB_DESCRIPTION = `
Senior Frontend Engineer at Google

We are looking for a Senior Frontend Engineer to join our Cloud team. You will be responsible for building and maintaining complex web applications that serve millions of users.

Requirements:
- 5+ years of experience in frontend development
- Expert knowledge of React, TypeScript, and modern CSS
- Experience with state management (Redux, Zustand, or similar)
- Strong understanding of web performance optimization
- Experience with CI/CD pipelines and testing frameworks
- Excellent communication and collaboration skills

Nice to have:
- Experience with Next.js or similar SSR frameworks
- Knowledge of WebGL or Canvas APIs
- Open source contributions
- Experience with design systems
`;
