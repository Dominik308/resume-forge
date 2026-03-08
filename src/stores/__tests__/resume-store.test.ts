import { useResumeStore } from "@/stores/resume-store";
import { DEFAULT_RESUME_DATA } from "@/types/resume";
import { act } from "@testing-library/react";

// Reset store between tests
beforeEach(() => {
  act(() => {
    useResumeStore.getState().resetResume();
  });
});

describe("Resume Store", () => {
  describe("Initial state", () => {
    it("starts with DEFAULT_RESUME_DATA", () => {
      const { resume } = useResumeStore.getState();
      expect(resume.title).toBe(DEFAULT_RESUME_DATA.title);
      expect(resume.templateId).toBe("modern");
    });

    it("starts with isDirty = false", () => {
      expect(useResumeStore.getState().isDirty).toBe(false);
    });

    it("starts with isLoading = false", () => {
      expect(useResumeStore.getState().isLoading).toBe(false);
    });
  });

  describe("Personal Info", () => {
    it("updates personal info fields", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "John Doe" });
      });
      expect(useResumeStore.getState().resume.personalInfo.name).toBe("John Doe");
    });

    it("marks as dirty after update", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ email: "john@test.com" });
      });
      expect(useResumeStore.getState().isDirty).toBe(true);
    });

    it("merges partial updates without overwriting other fields", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "John", email: "john@test.com" });
      });
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ phone: "555-1234" });
      });
      const { personalInfo } = useResumeStore.getState().resume;
      expect(personalInfo.name).toBe("John");
      expect(personalInfo.email).toBe("john@test.com");
      expect(personalInfo.phone).toBe("555-1234");
    });
  });

  describe("Summary", () => {
    it("updates summary text", () => {
      act(() => {
        useResumeStore.getState().updateSummary("Senior engineer with 5+ years.");
      });
      expect(useResumeStore.getState().resume.summary).toBe("Senior engineer with 5+ years.");
    });
  });

  describe("Experience CRUD", () => {
    it("adds a new experience entry", () => {
      act(() => {
        useResumeStore.getState().addExperience();
      });
      expect(useResumeStore.getState().resume.experience).toHaveLength(1);
      expect(useResumeStore.getState().resume.experience[0]).toHaveProperty("id");
      expect(useResumeStore.getState().resume.experience[0].title).toBe("");
    });

    it("updates an experience entry by id", () => {
      act(() => {
        useResumeStore.getState().addExperience();
      });
      const id = useResumeStore.getState().resume.experience[0].id;
      act(() => {
        useResumeStore.getState().updateExperience(id, { title: "Senior Dev", company: "TechCo" });
      });
      const exp = useResumeStore.getState().resume.experience[0];
      expect(exp.title).toBe("Senior Dev");
      expect(exp.company).toBe("TechCo");
    });

    it("removes an experience entry by id", () => {
      act(() => {
        useResumeStore.getState().addExperience();
        useResumeStore.getState().addExperience();
      });
      expect(useResumeStore.getState().resume.experience).toHaveLength(2);
      const idToRemove = useResumeStore.getState().resume.experience[0].id;
      act(() => {
        useResumeStore.getState().removeExperience(idToRemove);
      });
      expect(useResumeStore.getState().resume.experience).toHaveLength(1);
    });

    it("reorders experience entries", () => {
      act(() => {
        useResumeStore.getState().addExperience();
        useResumeStore.getState().addExperience();
      });
      const ids = useResumeStore.getState().resume.experience.map((e) => e.id);
      act(() => {
        useResumeStore.getState().reorderExperience([ids[1], ids[0]]);
      });
      const reordered = useResumeStore.getState().resume.experience.map((e) => e.id);
      expect(reordered[0]).toBe(ids[1]);
      expect(reordered[1]).toBe(ids[0]);
    });
  });

  describe("Education CRUD", () => {
    it("adds education entry", () => {
      act(() => {
        useResumeStore.getState().addEducation();
      });
      expect(useResumeStore.getState().resume.education).toHaveLength(1);
    });

    it("updates education entry", () => {
      act(() => {
        useResumeStore.getState().addEducation();
      });
      const id = useResumeStore.getState().resume.education[0].id;
      act(() => {
        useResumeStore.getState().updateEducation(id, { degree: "B.S. CS" });
      });
      expect(useResumeStore.getState().resume.education[0].degree).toBe("B.S. CS");
    });

    it("removes education entry", () => {
      act(() => {
        useResumeStore.getState().addEducation();
      });
      const id = useResumeStore.getState().resume.education[0].id;
      act(() => {
        useResumeStore.getState().removeEducation(id);
      });
      expect(useResumeStore.getState().resume.education).toHaveLength(0);
    });
  });

  describe("Skills CRUD", () => {
    it("adds a skill category", () => {
      act(() => {
        useResumeStore.getState().addSkillCategory();
      });
      expect(useResumeStore.getState().resume.skills).toHaveLength(1);
      expect(useResumeStore.getState().resume.skills[0].category).toBe("Technical Skills");
    });

    it("updates skill category name", () => {
      act(() => {
        useResumeStore.getState().addSkillCategory();
      });
      const id = useResumeStore.getState().resume.skills[0].id;
      act(() => {
        useResumeStore.getState().updateSkillCategory(id, { category: "Frontend" });
      });
      expect(useResumeStore.getState().resume.skills[0].category).toBe("Frontend");
    });

    it("removes skill category", () => {
      act(() => {
        useResumeStore.getState().addSkillCategory();
      });
      const id = useResumeStore.getState().resume.skills[0].id;
      act(() => {
        useResumeStore.getState().removeSkillCategory(id);
      });
      expect(useResumeStore.getState().resume.skills).toHaveLength(0);
    });

    it("adds skill to category with skillItems", () => {
      act(() => {
        useResumeStore.getState().addSkillCategory();
      });
      const catId = useResumeStore.getState().resume.skills[0].id;
      act(() => {
        useResumeStore.getState().addSkillToCategory(catId, {
          id: "skill-1",
          name: "TypeScript",
          level: 4,
        });
      });
      const cat = useResumeStore.getState().resume.skills[0];
      expect(cat.skillItems).toHaveLength(1);
      expect(cat.skillItems![0].name).toBe("TypeScript");
      expect(cat.items).toContain("TypeScript");
    });

    it("removes skill from category", () => {
      act(() => {
        useResumeStore.getState().addSkillCategory();
      });
      const catId = useResumeStore.getState().resume.skills[0].id;
      act(() => {
        useResumeStore.getState().addSkillToCategory(catId, {
          id: "skill-1",
          name: "TypeScript",
          level: 4,
        });
      });
      act(() => {
        useResumeStore.getState().removeSkillFromCategory(catId, "skill-1");
      });
      const cat = useResumeStore.getState().resume.skills[0];
      expect(cat.skillItems).toHaveLength(0);
      expect(cat.items).not.toContain("TypeScript");
    });
  });

  describe("Projects CRUD", () => {
    it("adds and removes projects", () => {
      act(() => {
        useResumeStore.getState().addProject();
      });
      expect(useResumeStore.getState().resume.projects).toHaveLength(1);
      const id = useResumeStore.getState().resume.projects[0].id;
      act(() => {
        useResumeStore.getState().removeProject(id);
      });
      expect(useResumeStore.getState().resume.projects).toHaveLength(0);
    });
  });

  describe("Languages CRUD", () => {
    it("adds a language with default proficiency", () => {
      act(() => {
        useResumeStore.getState().addLanguage();
      });
      expect(useResumeStore.getState().resume.languages).toHaveLength(1);
      expect(useResumeStore.getState().resume.languages[0].proficiency).toBe("Intermediate");
    });
  });

  describe("Certifications CRUD", () => {
    it("adds and updates certifications", () => {
      act(() => {
        useResumeStore.getState().addCertification();
      });
      const id = useResumeStore.getState().resume.certifications[0].id;
      act(() => {
        useResumeStore.getState().updateCertification(id, { name: "AWS SAA" });
      });
      expect(useResumeStore.getState().resume.certifications[0].name).toBe("AWS SAA");
    });
  });

  describe("Design", () => {
    it("updates color scheme", () => {
      act(() => {
        useResumeStore.getState().updateColorScheme({ primary: "#ff0000" });
      });
      expect(useResumeStore.getState().resume.colorScheme.primary).toBe("#ff0000");
    });

    it("updates font config", () => {
      act(() => {
        useResumeStore.getState().updateFontConfig({ fontSize: "large" });
      });
      expect(useResumeStore.getState().resume.fontConfig.fontSize).toBe("large");
    });

    it("switches template", () => {
      act(() => {
        useResumeStore.getState().setTemplate("minimalist");
      });
      expect(useResumeStore.getState().resume.templateId).toBe("minimalist");
    });
  });

  describe("Section ordering & visibility", () => {
    it("reorders sections", () => {
      const newOrder = ["experience", "skills", "education", "personal", "summary", "projects", "certifications", "languages"];
      act(() => {
        useResumeStore.getState().reorderSections(newOrder);
      });
      expect(useResumeStore.getState().resume.sectionOrder).toEqual(newOrder);
    });

    it("toggles section visibility", () => {
      act(() => {
        useResumeStore.getState().toggleSectionVisibility("projects");
      });
      expect(useResumeStore.getState().resume.hiddenSections).toContain("projects");
      expect(useResumeStore.getState().isSectionHidden("projects")).toBe(true);

      // Toggle back
      act(() => {
        useResumeStore.getState().toggleSectionVisibility("projects");
      });
      expect(useResumeStore.getState().resume.hiddenSections).not.toContain("projects");
      expect(useResumeStore.getState().isSectionHidden("projects")).toBe(false);
    });
  });

  describe("Undo / Redo", () => {
    it("starts with canUndo = false", () => {
      expect(useResumeStore.getState().canUndo()).toBe(false);
    });

    it("starts with canRedo = false", () => {
      expect(useResumeStore.getState().canRedo()).toBe(false);
    });

    it("undo reverts last change", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "John" });
      });
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "Jane" });
      });
      expect(useResumeStore.getState().resume.personalInfo.name).toBe("Jane");

      act(() => {
        useResumeStore.getState().undo();
      });
      expect(useResumeStore.getState().resume.personalInfo.name).toBe("John");
    });

    it("redo re-applies undone change", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "John" });
      });
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "Jane" });
      });
      act(() => {
        useResumeStore.getState().undo();
      });
      act(() => {
        useResumeStore.getState().redo();
      });
      expect(useResumeStore.getState().resume.personalInfo.name).toBe("Jane");
    });
  });

  describe("Persistence", () => {
    it("marks as saved and updates lastSaved", () => {
      act(() => {
        useResumeStore.getState().updatePersonalInfo({ name: "Test" });
      });
      expect(useResumeStore.getState().isDirty).toBe(true);
      act(() => {
        useResumeStore.getState().markSaved();
      });
      expect(useResumeStore.getState().isDirty).toBe(false);
      expect(useResumeStore.getState().lastSaved).toBeInstanceOf(Date);
    });
  });

  describe("loadResume", () => {
    it("loads resume and resets history", () => {
      const resume = {
        ...DEFAULT_RESUME_DATA,
        title: "Loaded Resume",
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, name: "Loaded User" },
      };
      act(() => {
        useResumeStore.getState().loadResume(resume);
      });
      expect(useResumeStore.getState().resume.title).toBe("Loaded Resume");
      expect(useResumeStore.getState().isDirty).toBe(false);
      expect(useResumeStore.getState().canUndo()).toBe(false);
    });
  });
});
