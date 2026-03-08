import { useEditorStore } from "@/stores/editor-store";
import { act } from "@testing-library/react";

describe("Editor Store", () => {
  beforeEach(() => {
    // Reset to initial state
    act(() => {
      useEditorStore.setState({
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
      });
    });
  });

  describe("Zoom", () => {
    it("sets zoom within bounds", () => {
      act(() => {
        useEditorStore.getState().setZoom(1.5);
      });
      expect(useEditorStore.getState().zoom).toBe(1.5);
    });

    it("clamps zoom to minimum 0.25", () => {
      act(() => {
        useEditorStore.getState().setZoom(0.1);
      });
      expect(useEditorStore.getState().zoom).toBe(0.25);
    });

    it("clamps zoom to maximum 2.5", () => {
      act(() => {
        useEditorStore.getState().setZoom(3.0);
      });
      expect(useEditorStore.getState().zoom).toBe(2.5);
    });

    it("zoomIn increases by 0.1", () => {
      act(() => {
        useEditorStore.getState().zoomIn();
      });
      expect(useEditorStore.getState().zoom).toBeCloseTo(1.1, 1);
    });

    it("zoomOut decreases by 0.1", () => {
      act(() => {
        useEditorStore.getState().zoomOut();
      });
      expect(useEditorStore.getState().zoom).toBeCloseTo(0.9, 1);
    });

    it("resetZoom returns to 1", () => {
      act(() => {
        useEditorStore.getState().setZoom(1.5);
      });
      act(() => {
        useEditorStore.getState().resetZoom();
      });
      expect(useEditorStore.getState().zoom).toBe(1);
    });
  });

  describe("Section selection", () => {
    it("selects a section and clears element selection", () => {
      act(() => {
        useEditorStore.getState().selectElement("elem-1");
      });
      act(() => {
        useEditorStore.getState().selectSection("section-1");
      });
      expect(useEditorStore.getState().selectedSectionId).toBe("section-1");
      expect(useEditorStore.getState().selectedElementId).toBeNull();
    });

    it("deselects section with null", () => {
      act(() => {
        useEditorStore.getState().selectSection("section-1");
      });
      act(() => {
        useEditorStore.getState().selectSection(null);
      });
      expect(useEditorStore.getState().selectedSectionId).toBeNull();
    });
  });

  describe("Panels", () => {
    it("toggles active panel on/off", () => {
      act(() => {
        useEditorStore.getState().setActivePanel("design");
      });
      expect(useEditorStore.getState().activePanel).toBe("design");

      // Toggle off by setting same panel
      act(() => {
        useEditorStore.getState().setActivePanel("design");
      });
      expect(useEditorStore.getState().activePanel).toBeNull();
    });

    it("switches between panels", () => {
      act(() => {
        useEditorStore.getState().setActivePanel("sections");
      });
      act(() => {
        useEditorStore.getState().setActivePanel("design");
      });
      expect(useEditorStore.getState().activePanel).toBe("design");
    });

    it("toggles AI panel", () => {
      expect(useEditorStore.getState().isAIPanelOpen).toBe(false);
      act(() => {
        useEditorStore.getState().toggleAIPanel();
      });
      expect(useEditorStore.getState().isAIPanelOpen).toBe(true);
      act(() => {
        useEditorStore.getState().toggleAIPanel();
      });
      expect(useEditorStore.getState().isAIPanelOpen).toBe(false);
    });
  });

  describe("Active tab", () => {
    it("sets active tab", () => {
      act(() => {
        useEditorStore.getState().setActiveTab("design");
      });
      expect(useEditorStore.getState().activeTab).toBe("design");
    });
  });

  describe("View toggles", () => {
    it("toggles grid", () => {
      act(() => useEditorStore.getState().toggleGrid());
      expect(useEditorStore.getState().showGrid).toBe(true);
    });

    it("toggles ruler", () => {
      act(() => useEditorStore.getState().toggleRuler());
      expect(useEditorStore.getState().showRuler).toBe(true);
    });

    it("toggles fullscreen", () => {
      act(() => useEditorStore.getState().toggleFullscreen());
      expect(useEditorStore.getState().isFullscreen).toBe(true);
    });

    it("toggles preview", () => {
      act(() => useEditorStore.getState().togglePreview());
      expect(useEditorStore.getState().isPreviewing).toBe(true);
    });
  });
});
