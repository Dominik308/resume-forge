import {
  analyzeResume,
  type SuggestionEngineResult,
} from "@/lib/ai/suggestion-engine";
import { DEFAULT_RESUME_DATA } from "@/types/resume";
import type { ResumeData } from "@/types/resume";

/* ─── Test Fixtures ──────────────────────────────────────────────────────── */

function makeResume(overrides: Partial<ResumeData> = {}): ResumeData {
  return { ...DEFAULT_RESUME_DATA, ...overrides };
}

const FULL_RESUME: ResumeData = {
  ...DEFAULT_RESUME_DATA,
  personalInfo: {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-987-6543",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/janedoe",
    website: "janedoe.dev",
    title: "Senior Software Engineer",
  },
  summary:
    "Senior software engineer with 7+ years of experience building scalable web applications using React, TypeScript and Node.js. Passionate about clean code and delivering high-performance solutions for modern products.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Frontend Engineer",
      company: "TechCo",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "",
      current: true,
      bullets: [
        "Led a team of 5 engineers to redesign the main dashboard, increasing user engagement by 35%",
        "Implemented CI/CD pipeline using GitHub Actions, reducing deploy time by 60%",
        "Developed reusable React component library adopted by 3 product teams",
        "Optimized bundle size by 40% through code splitting and lazy loading strategies",
      ],
    },
    {
      id: "exp-2",
      title: "Software Engineer",
      company: "StartupInc",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2020-12",
      current: false,
      bullets: [
        "Built real-time analytics dashboard serving 10,000+ daily active users",
        "Managed migration from JavaScript to TypeScript across 50+ files",
        "Reduced API response times by 45% through database query optimization",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2014-09",
      endDate: "2018-06",
      gpa: "3.8",
      highlights: ["Dean's List", "Capstone: ML-based Resume Parser"],
    },
  ],
  skills: [
    { id: "sk-1", category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML", "CSS"] },
    { id: "sk-2", category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Redis", "GraphQL"] },
    { id: "sk-3", category: "Tools", items: ["Git", "Docker", "AWS", "CI/CD", "Jira"] },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ResumeForge",
      description: "AI-powered resume builder with local LLM integration",
      technologies: ["Next.js", "TypeScript", "Prisma", "Tailwind"],
    },
  ],
  certifications: [
    { id: "cert-1", name: "AWS Solutions Architect Associate", issuer: "Amazon", date: "2023-03" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
  ],
  customSections: [],
  colorScheme: DEFAULT_RESUME_DATA.colorScheme,
  fontConfig: DEFAULT_RESUME_DATA.fontConfig,
  sectionOrder: DEFAULT_RESUME_DATA.sectionOrder,
  hiddenSections: [],
};

const SAMPLE_JOB_DESCRIPTION = `
  We are looking for a Senior Frontend Engineer with strong experience in React, TypeScript and modern web technologies.
  You will work closely with product and design teams to build performant user interfaces.

  Requirements:
  - 5+ years of experience with React and TypeScript
  - Experience with Next.js and server-side rendering
  - Proficiency in Tailwind CSS or similar utility-first CSS frameworks
  - Familiarity with GraphQL and REST APIs
  - Experience with CI/CD pipelines and cloud services (AWS preferred)
  - Strong testing skills with Jest and Cypress
  - Excellent communication and team collaboration skills

  Nice to have:
  - Experience with Kubernetes and Docker
  - Knowledge of web performance optimization
  - Contributions to open source projects
`;

/* ─── Tests ──────────────────────────────────────────────────────────────── */

describe("Suggestion Engine", () => {
  describe("analyzeResume — basic structure", () => {
    it("returns all required fields", () => {
      const result = analyzeResume(FULL_RESUME);

      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("suggestions");
      expect(result).toHaveProperty("matchedKeywords");
      expect(result).toHaveProperty("missingKeywords");
      expect(result).toHaveProperty("skillGap");

      expect(result.score).toHaveProperty("overall");
      expect(result.score).toHaveProperty("sections");
      expect(result.score.sections).toHaveProperty("summary");
      expect(result.score.sections).toHaveProperty("experience");
      expect(result.score.sections).toHaveProperty("skills");
      expect(result.score.sections).toHaveProperty("education");
      expect(result.score.sections).toHaveProperty("keywords");
      expect(result.score.sections).toHaveProperty("formatting");
    });

    it("scores are numbers between 0 and 100", () => {
      const result = analyzeResume(FULL_RESUME, SAMPLE_JOB_DESCRIPTION);

      expect(result.score.overall).toBeGreaterThanOrEqual(0);
      expect(result.score.overall).toBeLessThanOrEqual(100);

      for (const sectionScore of Object.values(result.score.sections)) {
        expect(sectionScore).toBeGreaterThanOrEqual(0);
        expect(sectionScore).toBeLessThanOrEqual(100);
      }
    });

    it("suggestions have required fields", () => {
      const result = analyzeResume(makeResume()); // empty resume → lots of suggestions

      for (const suggestion of result.suggestions) {
        expect(suggestion).toHaveProperty("id");
        expect(suggestion).toHaveProperty("section");
        expect(suggestion).toHaveProperty("priority");
        expect(suggestion).toHaveProperty("title");
        expect(suggestion).toHaveProperty("description");
        expect(typeof suggestion.id).toBe("string");
        expect(["critical", "high", "medium", "low"]).toContain(suggestion.priority);
      }
    });

    it("sorts suggestions by priority (critical first)", () => {
      const result = analyzeResume(makeResume());
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

      for (let i = 1; i < result.suggestions.length; i++) {
        const prev = priorityOrder[result.suggestions[i - 1].priority];
        const curr = priorityOrder[result.suggestions[i].priority];
        expect(curr).toBeGreaterThanOrEqual(prev);
      }
    });
  });

  describe("Empty resume", () => {
    it("gives low overall score for DEFAULT_RESUME_DATA", () => {
      const result = analyzeResume(makeResume());
      expect(result.score.overall).toBeLessThan(50);
    });

    it("flags missing summary as critical", () => {
      const result = analyzeResume(makeResume());
      const missingSum = result.suggestions.find((s) => s.id === "summary-missing");
      expect(missingSum).toBeDefined();
      expect(missingSum!.priority).toBe("critical");
    });

    it("flags missing experience as critical", () => {
      const result = analyzeResume(makeResume());
      const missingExp = result.suggestions.find((s) => s.id === "exp-missing");
      expect(missingExp).toBeDefined();
      expect(missingExp!.priority).toBe("critical");
    });

    it("flags missing skills as critical", () => {
      const result = analyzeResume(makeResume());
      const missingSkills = result.suggestions.find((s) => s.id === "skills-missing");
      expect(missingSkills).toBeDefined();
      expect(missingSkills!.priority).toBe("critical");
    });

    it("flags missing personal info fields", () => {
      const result = analyzeResume(makeResume());
      const personalSuggestions = result.suggestions.filter((s) => s.section === "personal");
      expect(personalSuggestions.length).toBeGreaterThan(0);
    });
  });

  describe("Full resume without job description", () => {
    it("gives higher score than empty resume", () => {
      const emptyResult = analyzeResume(makeResume());
      const fullResult = analyzeResume(FULL_RESUME);
      expect(fullResult.score.overall).toBeGreaterThan(emptyResult.score.overall);
    });

    it("defaults keyword score to 70 when no JD provided", () => {
      const result = analyzeResume(FULL_RESUME);
      expect(result.score.sections.keywords).toBe(70);
    });

    it("returns empty matched/missing keywords when no JD", () => {
      const result = analyzeResume(FULL_RESUME);
      expect(result.matchedKeywords).toEqual([]);
      expect(result.missingKeywords).toEqual([]);
    });

    it("has no critical suggestions for a well-filled resume", () => {
      const result = analyzeResume(FULL_RESUME);
      const critical = result.suggestions.filter((s) => s.priority === "critical");
      expect(critical).toHaveLength(0);
    });
  });

  describe("Full resume with job description", () => {
    let result: SuggestionEngineResult;

    beforeAll(() => {
      result = analyzeResume(FULL_RESUME, SAMPLE_JOB_DESCRIPTION);
    });

    it("returns matched keywords from the job description", () => {
      expect(result.matchedKeywords.length).toBeGreaterThan(0);
    });

    it("identifies missing keywords", () => {
      // The resume might not contain every single JD keyword
      expect(Array.isArray(result.missingKeywords)).toBe(true);
    });

    it("identifies skill gap", () => {
      expect(result.skillGap).toHaveProperty("required");
      expect(result.skillGap).toHaveProperty("missing");
      expect(result.skillGap.required.length).toBeGreaterThan(0);
    });

    it("detects that React/TypeScript skills match the JD", () => {
      const resumeSkills = FULL_RESUME.skills.flatMap((s) => s.items.map((i) => i.toLowerCase()));
      const requiredSkills = result.skillGap.required;
      const hasReact = requiredSkills.some((s) => s.includes("react"));
      const hasTs = requiredSkills.some((s) => s.includes("typescript"));
      expect(hasReact).toBe(true);
      expect(hasTs).toBe(true);

      // These should NOT appear in the missing list since the resume has them
      const missingNames = result.skillGap.missing.map((m) => m.toLowerCase());
      expect(missingNames).not.toContain("react");
      expect(missingNames).not.toContain("typescript");
    });

    it("scores > 50 overall for a well-matched resume", () => {
      expect(result.score.overall).toBeGreaterThan(50);
    });
  });

  describe("Summary scoring", () => {
    it("penalizes very short summary", () => {
      const resume = makeResume({ summary: "Engineer who codes." });
      const result = analyzeResume(resume);
      const shortSuggestion = result.suggestions.find((s) => s.id === "summary-too-short");
      expect(shortSuggestion).toBeDefined();
      expect(result.score.sections.summary).toBeLessThan(60);
    });

    it("penalizes very long summary", () => {
      const longSummary = Array(100).fill("experienced professional").join(" ");
      const resume = makeResume({ summary: longSummary });
      const result = analyzeResume(resume);
      const longSuggestion = result.suggestions.find((s) => s.id === "summary-too-long");
      expect(longSuggestion).toBeDefined();
    });

    it("detects missing JD keywords in summary", () => {
      const resume = makeResume({
        summary: "I am a professional who likes to work.",
      });
      const result = analyzeResume(resume, SAMPLE_JOB_DESCRIPTION);
      const kwSuggestion = result.suggestions.find((s) => s.id === "summary-keywords");
      expect(kwSuggestion).toBeDefined();
    });
  });

  describe("Experience scoring", () => {
    it("flags low bullet count per role", () => {
      const resume = makeResume({
        experience: [
          {
            id: "e1",
            title: "Dev",
            company: "Co",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: ["Did stuff."],
          },
        ],
      });
      const result = analyzeResume(resume);
      const fewBullets = result.suggestions.find((s) => s.id.startsWith("exp-few-bullets"));
      expect(fewBullets).toBeDefined();
      expect(fewBullets!.priority).toBe("high");
    });

    it("flags missing quantifiable metrics in bullets", () => {
      const resume = makeResume({
        experience: [
          {
            id: "e1",
            title: "Developer",
            company: "Acme",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: [
              "Worked on the frontend",
              "Helped with testing",
              "Participated in code reviews",
            ],
          },
        ],
      });
      const result = analyzeResume(resume);
      const noMetrics = result.suggestions.find((s) => s.id === "exp-no-metrics");
      expect(noMetrics).toBeDefined();
    });

    it("flags weak action verbs", () => {
      const resume = makeResume({
        experience: [
          {
            id: "e1",
            title: "Dev",
            company: "Corp",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: [
              "Was responsible for building features",
              "Helped with the migration",
              "Worked on the dashboard code",
            ],
          },
        ],
      });
      const result = analyzeResume(resume);
      const actionVerbs = result.suggestions.find((s) => s.id === "exp-action-verbs");
      expect(actionVerbs).toBeDefined();
    });

    it("gives higher score for bullets with metrics and action verbs", () => {
      const weakResume = makeResume({
        experience: [
          {
            id: "e1",
            title: "Dev",
            company: "Corp",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: ["Did work", "Helped team", "Was involved"],
          },
        ],
      });

      const strongResume = makeResume({
        experience: [
          {
            id: "e1",
            title: "Dev",
            company: "Corp",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: [
              "Led migration of 200+ API endpoints to GraphQL, reducing response time by 40%",
              "Developed real-time dashboard used by 5,000+ daily active users",
              "Implemented automated testing pipeline achieving 95% code coverage",
            ],
          },
        ],
      });

      const weakResult = analyzeResume(weakResume);
      const strongResult = analyzeResume(strongResume);
      expect(strongResult.score.sections.experience).toBeGreaterThan(
        weakResult.score.sections.experience
      );
    });
  });

  describe("Skills scoring", () => {
    it("gives score 0 when no skills are present", () => {
      const resume = makeResume({ skills: [] });
      const result = analyzeResume(resume);
      expect(result.score.sections.skills).toBe(0);
    });

    it("detects missing job skills", () => {
      const resume = makeResume({
        skills: [{ id: "sk1", category: "Tech", items: ["HTML", "CSS"] }],
      });
      const result = analyzeResume(resume, SAMPLE_JOB_DESCRIPTION);
      const skillGap = result.suggestions.find((s) => s.id === "skills-gap");
      expect(skillGap).toBeDefined();
    });

    it("suggests organizing skills into multiple categories", () => {
      const resume = makeResume({
        skills: [
          { id: "sk1", category: "All Skills", items: ["React", "TypeScript", "Docker", "AWS", "Git"] },
        ],
      });
      const result = analyzeResume(resume);
      const organize = result.suggestions.find((s) => s.id === "skills-organize");
      expect(organize).toBeDefined();
    });

    it("gives higher scores for matching JD skills", () => {
      const noMatchResume = makeResume({
        skills: [{ id: "sk1", category: "Tech", items: ["COBOL", "Fortran"] }],
      });
      const matchResume = makeResume({
        skills: [
          { id: "sk1", category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
        ],
      });

      const noMatchResult = analyzeResume(noMatchResume, SAMPLE_JOB_DESCRIPTION);
      const matchResult = analyzeResume(matchResume, SAMPLE_JOB_DESCRIPTION);
      expect(matchResult.score.sections.skills).toBeGreaterThan(noMatchResult.score.sections.skills);
    });
  });

  describe("Education scoring", () => {
    it("gives a reasonable score even without education", () => {
      const resume = makeResume({ education: [] });
      const result = analyzeResume(resume);
      // Education-less resume still gets 50 for experienced professionals
      expect(result.score.sections.education).toBe(50);
    });

    it("flags missing degree name", () => {
      const resume = makeResume({
        education: [
          {
            id: "edu1",
            degree: "",
            institution: "MIT",
            location: "",
            startDate: "2016-09",
            endDate: "2020-06",
            highlights: [],
          },
        ],
      });
      const result = analyzeResume(resume);
      const noDegree = result.suggestions.find((s) => s.id.startsWith("edu-no-degree"));
      expect(noDegree).toBeDefined();
    });

    it("flags missing institution name", () => {
      const resume = makeResume({
        education: [
          {
            id: "edu1",
            degree: "BS Computer Science",
            institution: "",
            location: "",
            startDate: "2016-09",
            endDate: "2020-06",
            highlights: [],
          },
        ],
      });
      const result = analyzeResume(resume);
      const noInst = result.suggestions.find((s) => s.id.startsWith("edu-no-institution"));
      expect(noInst).toBeDefined();
    });

    it("gives bonus score for GPA and highlights", () => {
      const basicEdu = makeResume({
        education: [
          { id: "e1", degree: "BS CS", institution: "Uni", location: "", startDate: "", endDate: "", highlights: [] },
        ],
      });
      const richEdu = makeResume({
        education: [
          { id: "e1", degree: "BS CS", institution: "Uni", location: "", startDate: "", endDate: "", gpa: "3.9", highlights: ["Summa Cum Laude"] },
        ],
      });

      const basicResult = analyzeResume(basicEdu);
      const richResult = analyzeResume(richEdu);
      expect(richResult.score.sections.education).toBeGreaterThan(basicResult.score.sections.education);
    });
  });

  describe("Formatting / personal info scoring", () => {
    it("flags missing name as critical", () => {
      const resume = makeResume({
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, name: "" },
      });
      const result = analyzeResume(resume);
      const noName = result.suggestions.find((s) => s.id === "fmt-no-name");
      expect(noName).toBeDefined();
      expect(noName!.priority).toBe("critical");
    });

    it("flags missing email as critical", () => {
      const resume = makeResume({
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, email: "" },
      });
      const result = analyzeResume(resume);
      const noEmail = result.suggestions.find((s) => s.id === "fmt-no-email");
      expect(noEmail).toBeDefined();
      expect(noEmail!.priority).toBe("critical");
    });

    it("flags missing phone as high priority", () => {
      const resume = makeResume({
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, name: "John", email: "john@test.com", phone: "" },
      });
      const result = analyzeResume(resume);
      const noPhone = result.suggestions.find((s) => s.id === "fmt-no-phone");
      expect(noPhone).toBeDefined();
      expect(noPhone!.priority).toBe("high");
    });

    it("suggests adding LinkedIn", () => {
      const resume = makeResume({
        personalInfo: {
          ...DEFAULT_RESUME_DATA.personalInfo,
          name: "John",
          email: "john@test.com",
          phone: "555-1234",
          title: "Engineer",
          linkedin: "",
        },
      });
      const result = analyzeResume(resume);
      const noLinkedin = result.suggestions.find((s) => s.id === "fmt-no-linkedin");
      expect(noLinkedin).toBeDefined();
      expect(noLinkedin!.priority).toBe("low");
    });

    it("gives higher formatting score when personal info is complete", () => {
      const incomplete = makeResume();
      const complete = makeResume({
        personalInfo: {
          name: "Jane",
          email: "jane@test.com",
          phone: "555",
          address: "SF",
          linkedin: "linkedin.com/in/jane",
          website: "",
          title: "SWE",
        },
        summary: "An engineer.",
        experience: [{ id: "e1", title: "Dev", company: "Co", location: "", startDate: "", endDate: "", current: false, bullets: [] }],
        education: [{ id: "ed1", degree: "BS", institution: "Uni", location: "", startDate: "", endDate: "", highlights: [] }],
        skills: [{ id: "s1", category: "Tech", items: ["JS"] }],
      });
      const incompleteResult = analyzeResume(incomplete);
      const completeResult = analyzeResume(complete);
      expect(completeResult.score.sections.formatting).toBeGreaterThan(incompleteResult.score.sections.formatting);
    });
  });

  describe("Keyword analysis with JD", () => {
    it("identifies relevant matched keywords", () => {
      const result = analyzeResume(FULL_RESUME, SAMPLE_JOB_DESCRIPTION);
      // Full resume contains React, TypeScript, etc which appear in JD
      expect(result.matchedKeywords.length).toBeGreaterThan(0);
    });

    it("keyword score is 0-100 range", () => {
      const result = analyzeResume(FULL_RESUME, SAMPLE_JOB_DESCRIPTION);
      expect(result.score.sections.keywords).toBeGreaterThanOrEqual(0);
      expect(result.score.sections.keywords).toBeLessThanOrEqual(100);
    });

    it("low keyword match when resume is unrelated to JD", () => {
      const unrelatedResume = makeResume({
        summary: "Expert in pottery and ceramics art.",
        experience: [
          {
            id: "e1",
            title: "Ceramics Artist",
            company: "Clay Studio",
            location: "",
            startDate: "2020-01",
            endDate: "",
            current: true,
            bullets: ["Created handmade pottery sold at local markets", "Taught beginner ceramics workshops"],
          },
        ],
        skills: [{ id: "s1", category: "Art", items: ["Pottery", "Glazing", "Kiln Operation"] }],
      });
      const result = analyzeResume(unrelatedResume, SAMPLE_JOB_DESCRIPTION);
      expect(result.score.sections.keywords).toBeLessThan(30);
    });

    it("flags large number of missing keywords", () => {
      const bareResume = makeResume({
        summary: "A professional.",
        experience: [
          { id: "e1", title: "Worker", company: "Place", location: "", startDate: "", endDate: "", current: false, bullets: ["Worked on tasks"] },
        ],
        skills: [{ id: "s1", category: "General", items: ["Communication"] }],
      });
      const result = analyzeResume(bareResume, SAMPLE_JOB_DESCRIPTION);
      expect(result.missingKeywords.length).toBeGreaterThan(0);
    });
  });

  describe("Overall score weighting", () => {
    it("overall is a weighted combination of section scores", () => {
      const result = analyzeResume(FULL_RESUME);
      const { sections } = result.score;

      // The weights: summary 0.15, experience 0.30, skills 0.25, education 0.05, keywords 0.15, formatting 0.10
      const expected = Math.round(
        sections.summary * 0.15 +
        sections.experience * 0.30 +
        sections.skills * 0.25 +
        sections.education * 0.05 +
        sections.keywords * 0.15 +
        sections.formatting * 0.10
      );
      expect(result.score.overall).toBe(expected);
    });
  });
});
