import {
  SYSTEM_INSTRUCTIONS,
  getSystemInstruction,
  parseAIResponse,
} from "@/lib/ai/system-instructions";

describe("System Instructions", () => {
  describe("SYSTEM_INSTRUCTIONS", () => {
    it("has all required instruction sets", () => {
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("RESUME_EXPERT");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("BULLET_WRITER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("SUMMARY_WRITER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("SKILLS_ADVISOR");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("ATS_ANALYZER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("RESUME_TAILOR");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("COVER_LETTER_WRITER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("TEXT_REWRITER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("TEXT_CONCISER");
      expect(SYSTEM_INSTRUCTIONS).toHaveProperty("JOB_ANALYZER");
    });

    it("all instructions are non-empty strings", () => {
      for (const [key, value] of Object.entries(SYSTEM_INSTRUCTIONS)) {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(50);
      }
    });

    it("BULLET_WRITER mentions action verbs", () => {
      expect(SYSTEM_INSTRUCTIONS.BULLET_WRITER).toContain("action verb");
    });

    it("ATS_ANALYZER mentions JSON output format", () => {
      expect(SYSTEM_INSTRUCTIONS.ATS_ANALYZER).toContain("score");
      expect(SYSTEM_INSTRUCTIONS.ATS_ANALYZER).toContain("breakdown");
    });
  });

  describe("getSystemInstruction", () => {
    it("maps 'bullet' to BULLET_WRITER", () => {
      expect(getSystemInstruction("bullet")).toBe(SYSTEM_INSTRUCTIONS.BULLET_WRITER);
    });

    it("maps 'summary' to SUMMARY_WRITER", () => {
      expect(getSystemInstruction("summary")).toBe(SYSTEM_INSTRUCTIONS.SUMMARY_WRITER);
    });

    it("maps 'skills' to SKILLS_ADVISOR", () => {
      expect(getSystemInstruction("skills")).toBe(SYSTEM_INSTRUCTIONS.SKILLS_ADVISOR);
    });

    it("maps 'ats' to ATS_ANALYZER", () => {
      expect(getSystemInstruction("ats")).toBe(SYSTEM_INSTRUCTIONS.ATS_ANALYZER);
    });

    it("maps 'tailor' to RESUME_TAILOR", () => {
      expect(getSystemInstruction("tailor")).toBe(SYSTEM_INSTRUCTIONS.RESUME_TAILOR);
    });

    it("maps 'cover-letter' to COVER_LETTER_WRITER", () => {
      expect(getSystemInstruction("cover-letter")).toBe(SYSTEM_INSTRUCTIONS.COVER_LETTER_WRITER);
    });

    it("maps 'rewrite' to TEXT_REWRITER", () => {
      expect(getSystemInstruction("rewrite")).toBe(SYSTEM_INSTRUCTIONS.TEXT_REWRITER);
    });

    it("maps 'concise' to TEXT_CONCISER", () => {
      expect(getSystemInstruction("concise")).toBe(SYSTEM_INSTRUCTIONS.TEXT_CONCISER);
    });

    it("maps 'analyze-job' to JOB_ANALYZER", () => {
      expect(getSystemInstruction("analyze-job")).toBe(SYSTEM_INSTRUCTIONS.JOB_ANALYZER);
    });

    it("returns RESUME_EXPERT for unknown action types", () => {
      expect(getSystemInstruction("unknown-action")).toBe(SYSTEM_INSTRUCTIONS.RESUME_EXPERT);
      expect(getSystemInstruction("")).toBe(SYSTEM_INSTRUCTIONS.RESUME_EXPERT);
    });
  });

  describe("parseAIResponse", () => {
    it("parses valid JSON directly", () => {
      const result = parseAIResponse<{ score: number }>('{"score": 85}');
      expect(result).toEqual({ score: 85 });
    });

    it("parses JSON from markdown code blocks", () => {
      const raw = 'Here is the result:\n```json\n{"score": 90}\n```';
      const result = parseAIResponse<{ score: number }>(raw);
      expect(result).toEqual({ score: 90 });
    });

    it("extracts JSON object from surrounding text", () => {
      const raw = 'The analysis shows: {"score": 75, "suggestions": ["improve keywords"]}. That\'s the result.';
      const result = parseAIResponse<{ score: number; suggestions: string[] }>(raw);
      expect(result.score).toBe(75);
      expect(result.suggestions).toEqual(["improve keywords"]);
    });

    it("extracts JSON array from surrounding text", () => {
      const raw = 'Here are the skills: ["TypeScript", "React", "Node.js"]';
      const result = parseAIResponse<string[]>(raw);
      expect(result).toEqual(["TypeScript", "React", "Node.js"]);
    });

    it("throws for completely invalid input", () => {
      expect(() => parseAIResponse("not json at all")).toThrow();
    });

    it("handles nested JSON objects", () => {
      const raw = '{"breakdown": {"keywordMatch": 80, "formatting": 90}, "score": 85}';
      const result = parseAIResponse<Record<string, unknown>>(raw);
      expect(result).toHaveProperty("breakdown");
      expect(result).toHaveProperty("score");
    });
  });
});
