"use client";

import type { ResumeData } from "@/types/resume";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import TechTemplate from "./templates/TechTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import BoldTemplate from "./templates/BoldTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  isPrint?: boolean;
}

export default function ResumePreview({ data, scale = 1, isPrint = false }: ResumePreviewProps) {
  const props = { data, scale, isPrint };

  switch (data.templateId) {
    case "minimalist": return <MinimalistTemplate {...props} />;
    case "creative": return <CreativeTemplate {...props} />;
    case "professional": return <ProfessionalTemplate {...props} />;
    case "tech": return <TechTemplate {...props} />;
    case "elegant": return <ElegantTemplate {...props} />;
    case "bold": return <BoldTemplate {...props} />;
    case "classic": return <ClassicTemplate {...props} />;
    default: return <ModernTemplate {...props} />;
  }
}
