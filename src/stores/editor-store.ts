import { create } from "zustand";

type PanelType = "sections" | "design" | "elements" | null;
type RightPanelType = "properties" | "ai" | null;
type ActiveTab = "content" | "design" | "ai";

interface EditorStore {
  zoom: number;
  selectedSectionId: string | null;
  selectedElementId: string | null;
  activePanel: PanelType;
  activeRightPanel: RightPanelType;
  activeTab: ActiveTab;
  showGrid: boolean;
  showRuler: boolean;
  isFullscreen: boolean;
  isAIPanelOpen: boolean;
  isPreviewing: boolean;

  // Actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  selectSection: (id: string | null) => void;
  selectElement: (id: string | null) => void;
  setActivePanel: (panel: PanelType) => void;
  setActiveRightPanel: (panel: RightPanelType) => void;
  setActiveTab: (tab: ActiveTab) => void;
  toggleGrid: () => void;
  toggleRuler: () => void;
  toggleFullscreen: () => void;
  toggleAIPanel: () => void;
  togglePreview: () => void;
}

export const useEditorStore = create<EditorStore>()((set, get) => ({
  zoom: 1,
  selectedSectionId: null,
  selectedElementId: null,
  activePanel: "sections",
  activeRightPanel: null,
  activeTab: "content",
  showGrid: false,
  showRuler: false,
  isFullscreen: false,
  isAIPanelOpen: false,
  isPreviewing: false,

  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.25), 2.5) }),
  zoomIn: () => set({ zoom: Math.min(get().zoom + 0.1, 2.5) }),
  zoomOut: () => set({ zoom: Math.max(get().zoom - 0.1, 0.25) }),
  resetZoom: () => set({ zoom: 1 }),

  selectSection: (id) =>
    set({ selectedSectionId: id, selectedElementId: null }),

  selectElement: (id) => set({ selectedElementId: id }),

  setActivePanel: (panel) =>
    set({ activePanel: panel === get().activePanel ? null : panel }),

  setActiveRightPanel: (panel) =>
    set({ activeRightPanel: panel === get().activeRightPanel ? null : panel }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleGrid: () => set({ showGrid: !get().showGrid }),
  toggleRuler: () => set({ showRuler: !get().showRuler }),
  toggleFullscreen: () => set({ isFullscreen: !get().isFullscreen }),
  toggleAIPanel: () => set({ isAIPanelOpen: !get().isAIPanelOpen }),
  togglePreview: () => set({ isPreviewing: !get().isPreviewing }),
}));

export type { PanelType, RightPanelType, ActiveTab };
