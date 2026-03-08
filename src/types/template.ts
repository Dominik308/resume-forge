import type { ResumeData } from "./resume";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "modern" | "minimalist" | "creative" | "professional" | "tech" | "elegant" | "bold" | "classic";
  isPro: boolean;
  defaultColorScheme: string;
  tags: string[];
}

export interface TemplateProps {
  data: ResumeData;
  scale?: number;
  isPrint?: boolean;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean sidebar layout with skill bars and timeline experience",
    thumbnail: "/templates/modern.png",
    category: "modern",
    isPro: false,
    defaultColorScheme: "default",
    tags: ["sidebar", "timeline", "colorful"],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Maximum whitespace with elegant thin dividers",
    thumbnail: "/templates/minimalist.png",
    category: "minimalist",
    isPro: false,
    defaultColorScheme: "slate",
    tags: ["clean", "simple", "ats-friendly"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Asymmetric layout with color blocks for design roles",
    thumbnail: "/templates/creative.png",
    category: "creative",
    isPro: false,
    defaultColorScheme: "violet",
    tags: ["creative", "designer", "asymmetric"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional two-column for corporate environments",
    thumbnail: "/templates/professional.png",
    category: "professional",
    isPro: false,
    defaultColorScheme: "ocean",
    tags: ["corporate", "two-column", "traditional"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "Code-inspired design with monospace accents and badge skills",
    thumbnail: "/templates/tech.png",
    category: "tech",
    isPro: false,
    defaultColorScheme: "forest",
    tags: ["developer", "badges", "monospace"],
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated typography with subtle gradients",
    thumbnail: "/templates/elegant.png",
    category: "elegant",
    isPro: true,
    defaultColorScheme: "gold",
    tags: ["premium", "typography", "luxury"],
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong colors with infographic-style skill visualization",
    thumbnail: "/templates/bold.png",
    category: "bold",
    isPro: true,
    defaultColorScheme: "sunset",
    tags: ["bold", "infographic", "colorful"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Single-column ATS-optimized traditional layout",
    thumbnail: "/templates/classic.png",
    category: "classic",
    isPro: false,
    defaultColorScheme: "slate",
    tags: ["ats", "single-column", "traditional"],
  },
];
