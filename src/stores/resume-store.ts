import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, Skill } from "@/types/resume";
import { DEFAULT_RESUME_DATA, DEFAULT_SECTION_ORDER } from "@/types/resume";
import { generateId } from "@/lib/utils/helpers";

const MAX_HISTORY = 50;

interface ResumeStore {
  resume: ResumeData;
  history: ResumeData[];
  historyIndex: number;
  isDirty: boolean;
  isLoading: boolean;
  lastSaved: Date | null;

  // Actions
  setResume: (resume: ResumeData) => void;
  updateResume: (updates: Partial<ResumeData>) => void;
  resetResume: () => void;
  loadResume: (resume: ResumeData) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;

  // Summary
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeData["experience"][0]>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (ids: string[]) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeData["education"][0]>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<ResumeData["skills"][0]>) => void;
  removeSkillCategory: (id: string) => void;
  addSkillToCategory: (categoryId: string, skill: Skill) => void;
  removeSkillFromCategory: (categoryId: string, skillId: string) => void;
  updateSkillInCategory: (categoryId: string, skillId: string, data: Partial<Skill>) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeData["projects"][0]>) => void;
  removeProject: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<ResumeData["certifications"][0]>) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<ResumeData["languages"][0]>) => void;
  removeLanguage: (id: string) => void;

  // Design
  updateColorScheme: (scheme: Partial<ResumeData["colorScheme"]>) => void;
  updateFontConfig: (config: Partial<ResumeData["fontConfig"]>) => void;
  setTemplate: (templateId: string) => void;

  // Section ordering & visibility
  reorderSections: (newOrder: string[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  isSectionHidden: (sectionId: string) => boolean;

  // History
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Persistence
  markSaved: () => void;
  setLoading: (loading: boolean) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: DEFAULT_RESUME_DATA,
      history: [DEFAULT_RESUME_DATA],
      historyIndex: 0,
      isDirty: false,
      isLoading: false,
      lastSaved: null,

      setResume: (resume) => {
        set({ resume, isDirty: true });
        get().saveSnapshot();
      },

      updateResume: (updates) => {
        const newResume = { ...get().resume, ...updates };
        set({ resume: newResume, isDirty: true });
        get().saveSnapshot();
      },

      resetResume: () => {
        set({ resume: DEFAULT_RESUME_DATA, history: [DEFAULT_RESUME_DATA], historyIndex: 0, isDirty: false });
      },

      loadResume: (resume) => {
        set({ resume, history: [resume], historyIndex: 0, isDirty: false });
      },

      updatePersonalInfo: (info) => {
        const newResume = { ...get().resume, personalInfo: { ...get().resume.personalInfo, ...info } };
        set({ resume: newResume, isDirty: true });
        get().saveSnapshot();
      },

      updateSummary: (summary) => {
        const newResume = { ...get().resume, summary };
        set({ resume: newResume, isDirty: true });
        get().saveSnapshot();
      },

      addExperience: () => {
        const newExp = {
          id: generateId(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""],
        };
        const newResume = { ...get().resume, experience: [newExp, ...get().resume.experience] };
        set({ resume: newResume, isDirty: true });
        get().saveSnapshot();
      },

      updateExperience: (id, data) => {
        const experience = get().resume.experience.map((e) =>
          e.id === id ? { ...e, ...data } : e
        );
        set({ resume: { ...get().resume, experience }, isDirty: true });
        get().saveSnapshot();
      },

      removeExperience: (id) => {
        set({
          resume: {
            ...get().resume,
            experience: get().resume.experience.filter((e) => e.id !== id),
          },
          isDirty: true,
        });
        get().saveSnapshot();
      },

      reorderExperience: (ids) => {
        const experience = ids.map((id) => get().resume.experience.find((e) => e.id === id)!).filter(Boolean);
        set({ resume: { ...get().resume, experience }, isDirty: true });
      },

      addEducation: () => {
        const newEdu = {
          id: generateId(),
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
          highlights: [],
        };
        set({ resume: { ...get().resume, education: [...get().resume.education, newEdu] }, isDirty: true });
        get().saveSnapshot();
      },

      updateEducation: (id, data) => {
        const education = get().resume.education.map((e) =>
          e.id === id ? { ...e, ...data } : e
        );
        set({ resume: { ...get().resume, education }, isDirty: true });
        get().saveSnapshot();
      },

      removeEducation: (id) => {
        set({
          resume: {
            ...get().resume,
            education: get().resume.education.filter((e) => e.id !== id),
          },
          isDirty: true,
        });
        get().saveSnapshot();
      },

      addSkillCategory: () => {
        const newSkill = { id: generateId(), category: "Technical Skills", items: [] };
        set({ resume: { ...get().resume, skills: [...get().resume.skills, newSkill] }, isDirty: true });
        get().saveSnapshot();
      },

      updateSkillCategory: (id, data) => {
        const skills = get().resume.skills.map((s) =>
          s.id === id ? { ...s, ...data } : s
        );
        set({ resume: { ...get().resume, skills }, isDirty: true });
        get().saveSnapshot();
      },

      removeSkillCategory: (id) => {
        set({
          resume: { ...get().resume, skills: get().resume.skills.filter((s) => s.id !== id) },
          isDirty: true,
        });
        get().saveSnapshot();
      },

      addSkillToCategory: (categoryId, skill) => {
        const skills = get().resume.skills.map((s) =>
          s.id === categoryId
            ? { ...s, skillItems: [...(s.skillItems || []), skill], items: [...s.items, skill.name] }
            : s
        );
        set({ resume: { ...get().resume, skills }, isDirty: true });
        get().saveSnapshot();
      },

      removeSkillFromCategory: (categoryId, skillId) => {
        const skills = get().resume.skills.map((s) => {
          if (s.id !== categoryId) return s;
          const skillItems = (s.skillItems || []).filter((sk) => sk.id !== skillId);
          const removedName = (s.skillItems || []).find((sk) => sk.id === skillId)?.name;
          const items = removedName ? s.items.filter((i) => i !== removedName) : s.items;
          return { ...s, skillItems, items };
        });
        set({ resume: { ...get().resume, skills }, isDirty: true });
        get().saveSnapshot();
      },

      updateSkillInCategory: (categoryId, skillId, data) => {
        const skills = get().resume.skills.map((s) => {
          if (s.id !== categoryId) return s;
          const skillItems = (s.skillItems || []).map((sk) =>
            sk.id === skillId ? { ...sk, ...data } : sk
          );
          return { ...s, skillItems };
        });
        set({ resume: { ...get().resume, skills }, isDirty: true });
        get().saveSnapshot();
      },

      addProject: () => {
        const newProject = {
          id: generateId(), name: "", description: "", technologies: [], url: "",
        };
        set({ resume: { ...get().resume, projects: [...get().resume.projects, newProject] }, isDirty: true });
        get().saveSnapshot();
      },

      updateProject: (id, data) => {
        const projects = get().resume.projects.map((p) => p.id === id ? { ...p, ...data } : p);
        set({ resume: { ...get().resume, projects }, isDirty: true });
        get().saveSnapshot();
      },

      removeProject: (id) => {
        set({ resume: { ...get().resume, projects: get().resume.projects.filter((p) => p.id !== id) }, isDirty: true });
        get().saveSnapshot();
      },

      addCertification: () => {
        const newCert = { id: generateId(), name: "", issuer: "", date: "", url: "" };
        set({ resume: { ...get().resume, certifications: [...get().resume.certifications, newCert] }, isDirty: true });
        get().saveSnapshot();
      },

      updateCertification: (id, data) => {
        const certifications = get().resume.certifications.map((c) => c.id === id ? { ...c, ...data } : c);
        set({ resume: { ...get().resume, certifications }, isDirty: true });
        get().saveSnapshot();
      },

      removeCertification: (id) => {
        set({ resume: { ...get().resume, certifications: get().resume.certifications.filter((c) => c.id !== id) }, isDirty: true });
        get().saveSnapshot();
      },

      addLanguage: () => {
        const newLang = { id: generateId(), language: "", proficiency: "Intermediate" as const };
        set({ resume: { ...get().resume, languages: [...get().resume.languages, newLang] }, isDirty: true });
        get().saveSnapshot();
      },

      updateLanguage: (id, data) => {
        const languages = get().resume.languages.map((l) => l.id === id ? { ...l, ...data } : l);
        set({ resume: { ...get().resume, languages }, isDirty: true });
        get().saveSnapshot();
      },

      removeLanguage: (id) => {
        set({ resume: { ...get().resume, languages: get().resume.languages.filter((l) => l.id !== id) }, isDirty: true });
        get().saveSnapshot();
      },

      updateColorScheme: (scheme) => {
        const colorScheme = { ...get().resume.colorScheme, ...scheme };
        set({ resume: { ...get().resume, colorScheme }, isDirty: true });
        get().saveSnapshot();
      },

      updateFontConfig: (config) => {
        const fontConfig = { ...get().resume.fontConfig, ...config };
        set({ resume: { ...get().resume, fontConfig }, isDirty: true });
        get().saveSnapshot();
      },

      setTemplate: (templateId) => {
        set({ resume: { ...get().resume, templateId }, isDirty: true });
        get().saveSnapshot();
      },

      reorderSections: (newOrder) => {
        set({ resume: { ...get().resume, sectionOrder: newOrder }, isDirty: true });
        get().saveSnapshot();
      },

      toggleSectionVisibility: (sectionId) => {
        const hidden = get().resume.hiddenSections || [];
        const newHidden = hidden.includes(sectionId)
          ? hidden.filter((s) => s !== sectionId)
          : [...hidden, sectionId];
        set({ resume: { ...get().resume, hiddenSections: newHidden }, isDirty: true });
        get().saveSnapshot();
      },

      isSectionHidden: (sectionId) => {
        return (get().resume.hiddenSections || []).includes(sectionId);
      },

      saveSnapshot: () => {
        const { resume, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ ...resume });
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({ resume: history[newIndex], historyIndex: newIndex, isDirty: true });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({ resume: history[newIndex], historyIndex: newIndex, isDirty: true });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      markSaved: () => set({ isDirty: false, lastSaved: new Date() }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "resume-store",
      partialize: (state) => ({ resume: state.resume }),
    }
  )
);
