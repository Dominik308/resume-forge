import {
  isResumeData,
  isPersonalInfo,
  isSkill,
  DEFAULT_RESUME_DATA,
  DEFAULT_COLOR_SCHEMES,
  DEFAULT_SECTION_ORDER,
} from "@/types/resume";
import type { ResumeData, Skill, PersonalInfo } from "@/types/resume";

describe("Resume Types", () => {
  describe("DEFAULT_RESUME_DATA", () => {
    it("has all required fields", () => {
      expect(DEFAULT_RESUME_DATA).toHaveProperty("title");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("templateId");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("personalInfo");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("summary");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("experience");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("education");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("skills");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("projects");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("certifications");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("languages");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("colorScheme");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("fontConfig");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("sectionOrder");
      expect(DEFAULT_RESUME_DATA).toHaveProperty("hiddenSections");
    });

    it("defaults to modern templateId", () => {
      expect(DEFAULT_RESUME_DATA.templateId).toBe("modern");
    });

    it("has empty arrays for collections", () => {
      expect(DEFAULT_RESUME_DATA.experience).toEqual([]);
      expect(DEFAULT_RESUME_DATA.education).toEqual([]);
      expect(DEFAULT_RESUME_DATA.skills).toEqual([]);
      expect(DEFAULT_RESUME_DATA.projects).toEqual([]);
      expect(DEFAULT_RESUME_DATA.languages).toEqual([]);
      expect(DEFAULT_RESUME_DATA.certifications).toEqual([]);
      expect(DEFAULT_RESUME_DATA.customSections).toEqual([]);
    });

    it("has sectionOrder matching DEFAULT_SECTION_ORDER", () => {
      expect(DEFAULT_RESUME_DATA.sectionOrder).toEqual(DEFAULT_SECTION_ORDER);
    });

    it("has empty hiddenSections", () => {
      expect(DEFAULT_RESUME_DATA.hiddenSections).toEqual([]);
    });

    it("has lineHeight in fontConfig", () => {
      expect(DEFAULT_RESUME_DATA.fontConfig.lineHeight).toBe("normal");
    });
  });

  describe("DEFAULT_COLOR_SCHEMES", () => {
    it("contains all 8 color schemes", () => {
      const keys = Object.keys(DEFAULT_COLOR_SCHEMES);
      expect(keys).toContain("default");
      expect(keys).toContain("ocean");
      expect(keys).toContain("forest");
      expect(keys).toContain("sunset");
      expect(keys).toContain("violet");
      expect(keys).toContain("rose");
      expect(keys).toContain("slate");
      expect(keys).toContain("gold");
      expect(keys).toHaveLength(8);
    });

    it("each scheme has primary, accent, sidebar", () => {
      for (const [, scheme] of Object.entries(DEFAULT_COLOR_SCHEMES)) {
        expect(scheme).toHaveProperty("primary");
        expect(scheme).toHaveProperty("accent");
        expect(scheme).toHaveProperty("sidebar");
        expect(scheme).toHaveProperty("text");
        expect(scheme).toHaveProperty("background");
      }
    });
  });

  describe("DEFAULT_SECTION_ORDER", () => {
    it("has correct sections in order", () => {
      expect(DEFAULT_SECTION_ORDER).toEqual([
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
      ]);
    });
  });

  describe("isResumeData type guard", () => {
    it("returns true for valid resume data", () => {
      expect(isResumeData(DEFAULT_RESUME_DATA)).toBe(true);
    });

    it("returns true for full resume data", () => {
      const fullResume: ResumeData = {
        ...DEFAULT_RESUME_DATA,
        id: "test-1",
        title: "My Resume",
        experience: [
          {
            id: "1",
            title: "Dev",
            company: "Co",
            location: "NY",
            startDate: "01/2022",
            endDate: "",
            current: true,
            bullets: ["Did stuff"],
          },
        ],
      };
      expect(isResumeData(fullResume)).toBe(true);
    });

    it("returns false for null", () => {
      expect(isResumeData(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isResumeData(undefined)).toBe(false);
    });

    it("returns false for non-objects", () => {
      expect(isResumeData("string")).toBe(false);
      expect(isResumeData(123)).toBe(false);
      expect(isResumeData(true)).toBe(false);
    });

    it("returns false for objects missing required fields", () => {
      expect(isResumeData({ title: "test" })).toBe(false);
      expect(isResumeData({ templateId: "modern" })).toBe(false);
      expect(isResumeData({})).toBe(false);
    });
  });

  describe("isPersonalInfo type guard", () => {
    it("returns true for valid personal info", () => {
      const info: PersonalInfo = {
        name: "John",
        email: "john@test.com",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
      };
      expect(isPersonalInfo(info)).toBe(true);
    });

    it("returns false for null/undefined", () => {
      expect(isPersonalInfo(null)).toBe(false);
      expect(isPersonalInfo(undefined)).toBe(false);
    });

    it("returns false for missing name/email", () => {
      expect(isPersonalInfo({ email: "test@test.com" })).toBe(false);
      expect(isPersonalInfo({ name: "John" })).toBe(false);
    });
  });

  describe("isSkill type guard", () => {
    it("returns true for valid skill", () => {
      const skill: Skill = { id: "1", name: "TypeScript", level: 4 };
      expect(isSkill(skill)).toBe(true);
    });

    it("returns false for invalid levels", () => {
      expect(isSkill({ id: "1", name: "TS", level: 0 })).toBe(false);
      expect(isSkill({ id: "1", name: "TS", level: 6 })).toBe(false);
    });

    it("returns true for all valid levels 1-5", () => {
      for (let i = 1; i <= 5; i++) {
        expect(isSkill({ id: "1", name: "test", level: i })).toBe(true);
      }
    });

    it("returns false for non-numeric level", () => {
      expect(isSkill({ id: "1", name: "test", level: "high" })).toBe(false);
    });
  });
});
