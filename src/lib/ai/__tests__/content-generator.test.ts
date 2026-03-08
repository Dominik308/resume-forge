/**
 * Tests for the Content Generator layer.
 * We mock the openai module (callAI / callAIJSON) to test function logic.
 */

import { DEFAULT_RESUME_DATA } from "@/types/resume";
import type { ResumeData } from "@/types/resume";

/* ─── Mock AI layer ──────────────────────────────────────────────────────── */

const mockCallAI = jest.fn().mockResolvedValue("AI generated text");
const mockCallAIJSON = jest.fn().mockResolvedValue({});

jest.mock("@/lib/ai/openai", () => ({
  callAI: (...args: unknown[]) => mockCallAI(...args),
  callAIJSON: (...args: unknown[]) => mockCallAIJSON(...args),
}));

import {
  parseResumeText,
  analyzeJobDescription,
  improveBulletPoint,
  improveBulletPoints,
  generateSummary,
  suggestSkills,
  calculateATSScore,
  tailorResume,
  generateCoverLetter,
  rewriteText,
  makeTextConcise,
  optimizeResume,
} from "@/lib/ai/content-generator";

/* ─── Fixtures ───────────────────────────────────────────────────────────── */

const SAMPLE_RESUME: ResumeData = {
  ...DEFAULT_RESUME_DATA,
  personalInfo: {
    name: "Jane Doe",
    email: "jane@test.com",
    phone: "555-1234",
    address: "SF",
    linkedin: "",
    website: "",
    title: "Software Engineer",
  },
  summary: "Experienced software engineer specializing in web development.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Dev",
      company: "TechCo",
      location: "SF",
      startDate: "2020-01",
      endDate: "",
      current: true,
      bullets: ["Led team of 5 engineers", "Improved performance by 30%"],
    },
  ],
  skills: [
    { id: "sk-1", category: "Frontend", items: ["React", "TypeScript"] },
    { id: "sk-2", category: "Backend", items: ["Node.js", "PostgreSQL"] },
  ],
};

const SAMPLE_JOB = "We need a Senior React Developer with TypeScript experience.";

/* ─── Tests ──────────────────────────────────────────────────────────────── */

describe("Content Generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseResumeText", () => {
    it("calls callAIJSON with the resume text", async () => {
      const mockResult = { name: "John", experience: [] };
      mockCallAIJSON.mockResolvedValueOnce(mockResult);

      const result = await parseResumeText("John Doe\nSoftware Engineer");
      expect(mockCallAIJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it("passes low temperature for parsing accuracy", async () => {
      mockCallAIJSON.mockResolvedValueOnce({});
      await parseResumeText("text");
      const options = mockCallAIJSON.mock.calls[0][2];
      expect(options.temperature).toBe(0.1);
    });
  });

  describe("analyzeJobDescription", () => {
    it("calls callAIJSON with the job text", async () => {
      const mockResult = { title: "Dev", skills: [] };
      mockCallAIJSON.mockResolvedValueOnce(mockResult);

      const result = await analyzeJobDescription(SAMPLE_JOB);
      expect(mockCallAIJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe("improveBulletPoint", () => {
    it("sends bullet text to AI", async () => {
      mockCallAI.mockResolvedValueOnce("Improved bullet");
      const result = await improveBulletPoint("Did coding stuff");
      expect(mockCallAI).toHaveBeenCalledTimes(1);
      expect(result).toBe("Improved bullet");
    });

    it("includes job description context when provided", async () => {
      mockCallAI.mockResolvedValueOnce("Better bullet");
      await improveBulletPoint("Did coding stuff", SAMPLE_JOB);
      const userMessage = mockCallAI.mock.calls[0][1];
      expect(userMessage).toContain("Did coding stuff");
      expect(userMessage).toContain("Target job:");
    });
  });

  describe("improveBulletPoints", () => {
    it("improves each bullet sequentially", async () => {
      mockCallAI
        .mockResolvedValueOnce("Better version 1")
        .mockResolvedValueOnce("Better version 2");

      const results = await improveBulletPoints(["Bullet A", "Bullet B"]);
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        original: "Bullet A",
        improved: "Better version 1",
        explanation: "",
      });
      expect(results[1]).toEqual({
        original: "Bullet B",
        improved: "Better version 2",
        explanation: "",
      });
      expect(mockCallAI).toHaveBeenCalledTimes(2);
    });
  });

  describe("generateSummary", () => {
    it("includes resume data in the context", async () => {
      mockCallAI.mockResolvedValueOnce("Generated summary");
      const result = await generateSummary(SAMPLE_RESUME);
      expect(result).toBe("Generated summary");

      const context = mockCallAI.mock.calls[0][1];
      expect(context).toContain("Jane Doe");
      expect(context).toContain("TechCo");
    });

    it("includes target job when provided", async () => {
      mockCallAI.mockResolvedValueOnce("Targeted summary");
      await generateSummary(SAMPLE_RESUME, "React Lead");
      const context = mockCallAI.mock.calls[0][1];
      expect(context).toContain("React Lead");
    });
  });

  describe("suggestSkills", () => {
    it("returns structured skill suggestions", async () => {
      const mockResult = {
        technical: ["GraphQL"],
        soft: ["Leadership"],
        tools: ["Docker"],
        certifications: ["AWS SAA"],
      };
      mockCallAIJSON.mockResolvedValueOnce(mockResult);

      const result = await suggestSkills(SAMPLE_RESUME, SAMPLE_JOB);
      expect(result).toEqual(mockResult);
    });

    it("includes current skills and experience in context", async () => {
      mockCallAIJSON.mockResolvedValueOnce({});
      await suggestSkills(SAMPLE_RESUME);
      const context = mockCallAIJSON.mock.calls[0][1];
      expect(context).toContain("Frontend: React, TypeScript");
    });
  });

  describe("calculateATSScore", () => {
    it("sends resume and JD for scoring", async () => {
      const scoreResult = { score: 82, breakdown: {} };
      mockCallAIJSON.mockResolvedValueOnce(scoreResult);

      const result = await calculateATSScore(SAMPLE_RESUME, SAMPLE_JOB);
      expect(result).toEqual(scoreResult);
      expect(mockCallAIJSON).toHaveBeenCalledTimes(1);
    });

    it("includes resume text in the prompt", async () => {
      mockCallAIJSON.mockResolvedValueOnce({ score: 0 });
      await calculateATSScore(SAMPLE_RESUME, SAMPLE_JOB);
      const userMessage = mockCallAIJSON.mock.calls[0][1];
      expect(userMessage).toContain("Jane Doe");
      expect(userMessage).toContain("React Developer");
    });
  });

  describe("tailorResume", () => {
    it("sends full resume JSON for tailoring", async () => {
      mockCallAIJSON.mockResolvedValueOnce({ tailored: true });
      const result = await tailorResume(SAMPLE_RESUME, SAMPLE_JOB);
      expect(result).toEqual({ tailored: true });
    });
  });

  describe("generateCoverLetter", () => {
    it("generates cover letter from resume and JD", async () => {
      mockCallAI.mockResolvedValueOnce("Dear Hiring Manager...");
      const result = await generateCoverLetter(SAMPLE_RESUME, SAMPLE_JOB);
      expect(result).toBe("Dear Hiring Manager...");
    });

    it("includes candidate info in context", async () => {
      mockCallAI.mockResolvedValueOnce("Letter");
      await generateCoverLetter(SAMPLE_RESUME, SAMPLE_JOB);
      const context = mockCallAI.mock.calls[0][1];
      expect(context).toContain("Jane Doe");
      expect(context).toContain("Software Engineer");
    });
  });

  describe("rewriteText", () => {
    it("rewrites the given text", async () => {
      mockCallAI.mockResolvedValueOnce("Rewritten version");
      const result = await rewriteText("Original text here");
      expect(result).toBe("Rewritten version");
      expect(mockCallAI.mock.calls[0][1]).toBe("Original text here");
    });
  });

  describe("makeTextConcise", () => {
    it("makes text more concise", async () => {
      mockCallAI.mockResolvedValueOnce("Short version");
      const result = await makeTextConcise("Very long and verbose original text");
      expect(result).toBe("Short version");
    });
  });

  describe("optimizeResume", () => {
    it("returns optimization result with required fields", async () => {
      const mockResult = {
        summary: "Optimized summary",
        experience: [],
        skills: [],
        addedSkills: ["GraphQL"],
        changes: [{ section: "summary", description: "Updated summary" }],
      };
      mockCallAIJSON.mockResolvedValueOnce(mockResult);

      const result = await optimizeResume(SAMPLE_RESUME, SAMPLE_JOB);
      expect(result.summary).toBe("Optimized summary");
      expect(result.addedSkills).toContain("GraphQL");
      expect(result.changes).toHaveLength(1);
    });

    it("sends resume and job description", async () => {
      mockCallAIJSON.mockResolvedValueOnce({
        summary: "",
        experience: [],
        skills: [],
        addedSkills: [],
        changes: [],
      });
      await optimizeResume(SAMPLE_RESUME, SAMPLE_JOB);
      const userMessage = mockCallAIJSON.mock.calls[0][1];
      expect(userMessage).toContain("Current Resume:");
      expect(userMessage).toContain("Target Job Description:");
    });
  });
});
