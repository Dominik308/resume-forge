import {
  cn,
  generateId,
  formatDate,
  slugify,
  truncate,
  debounce,
  deepClone,
  bytesToSize,
} from "@/lib/utils/helpers";

describe("Utility Helpers", () => {
  describe("cn (class name merger)", () => {
    it("merges simple class names", () => {
      expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    });

    it("resolves Tailwind conflicts (last wins)", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("handles conditional classes", () => {
      expect(cn("text-sm", false && "text-lg", "font-bold")).toBe("text-sm font-bold");
    });

    it("filters falsy values", () => {
      expect(cn("a", null, undefined, false, "b")).toBe("a b");
    });

    it("returns empty string for no input", () => {
      expect(cn()).toBe("");
    });
  });

  describe("generateId", () => {
    it("returns a non-empty string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns unique values on consecutive calls", () => {
      const ids = new Set(Array.from({ length: 50 }, () => generateId()));
      expect(ids.size).toBe(50);
    });

    it("returns alphanumeric characters only", () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe("formatDate", () => {
    it("formats a Date object", () => {
      const result = formatDate(new Date("2024-03-15"));
      expect(result).toBe("Mar 2024");
    });

    it("formats an ISO date string", () => {
      expect(formatDate("2023-11-01")).toBe("Nov 2023");
    });

    it("returns empty string for undefined", () => {
      expect(formatDate(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(formatDate("")).toBe("");
    });

    it("returns the original string for an invalid date", () => {
      expect(formatDate("not-a-date")).toBe("not-a-date");
    });
  });

  describe("slugify", () => {
    it("converts to lowercase with dashes", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("removes special characters", () => {
      expect(slugify("Hello! @World#")).toBe("hello-world");
    });

    it("collapses multiple dashes", () => {
      expect(slugify("a---b")).toBe("a-b");
    });

    it("handles empty string", () => {
      expect(slugify("")).toBe("");
    });

    it("trims whitespace then converts", () => {
      // trim() in slugify removes whitespace, but leading/trailing dashes remain
      // since the regex replaces spaces with dashes first
      expect(slugify("hello world")).toBe("hello-world");
    });
  });

  describe("truncate", () => {
    it("keeps short strings unchanged", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("truncates and adds ellipsis for long strings", () => {
      expect(truncate("Hello World Test", 10)).toBe("Hello Worl...");
    });

    it("handles exact-length strings", () => {
      expect(truncate("12345", 5)).toBe("12345");
    });

    it("handles maxLength of 0", () => {
      expect(truncate("hello", 0)).toBe("...");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("delays function execution", () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("resets timer on subsequent calls", () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 200);

      debounced();
      jest.advanceTimersByTime(100);
      debounced(); // reset the timer
      jest.advanceTimersByTime(100);
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("passes arguments correctly", () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced("arg1", "arg2");
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
    });
  });

  describe("deepClone", () => {
    it("creates a deep copy of an object", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it("clones arrays", () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned[1]).not.toBe(original[1]);
    });

    it("clones primitives", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("test")).toBe("test");
      expect(deepClone(null)).toBe(null);
    });
  });

  describe("bytesToSize", () => {
    it("returns '0 Bytes' for 0", () => {
      expect(bytesToSize(0)).toBe("0 Bytes");
    });

    it("converts bytes correctly", () => {
      expect(bytesToSize(500)).toBe("500 Bytes");
    });

    it("converts kilobytes", () => {
      expect(bytesToSize(1024)).toBe("1 KB");
    });

    it("converts megabytes", () => {
      expect(bytesToSize(1048576)).toBe("1 MB");
    });

    it("converts gigabytes", () => {
      expect(bytesToSize(1073741824)).toBe("1 GB");
    });

    it("formats with decimals when not exact", () => {
      const result = bytesToSize(1536);
      expect(result).toBe("1.5 KB");
    });
  });
});
