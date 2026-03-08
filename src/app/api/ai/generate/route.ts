import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  improveBulletPoint,
  generateSummary,
  suggestSkills,
  calculateATSScore,
  tailorResume,
  generateCoverLetter,
  rewriteText,
  makeTextConcise,
  optimizeResume,
} from "@/lib/ai/content-generator";
import type { ResumeData } from "@/types/resume";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    type,
    resumeData,
    jobDescription,
    bulletText,
    text,
  }: {
    type: string;
    resumeData?: ResumeData;
    jobDescription?: string;
    bulletText?: string;
    text?: string;
  } = body;

  try {
    let result: unknown;

    switch (type) {
      case "bullet":
        if (!bulletText) throw new Error("bulletText is required");
        result = await improveBulletPoint(bulletText, jobDescription);
        break;

      case "summary":
        if (!resumeData) throw new Error("resumeData is required");
        result = await generateSummary(resumeData, jobDescription);
        break;

      case "skills":
        if (!resumeData) throw new Error("resumeData is required");
        result = await suggestSkills(resumeData, jobDescription);
        break;

      case "ats":
        if (!resumeData || !jobDescription) throw new Error("resumeData and jobDescription are required");
        result = await calculateATSScore(resumeData, jobDescription);
        break;

      case "tailor":
        if (!resumeData || !jobDescription) throw new Error("resumeData and jobDescription are required");
        result = await tailorResume(resumeData, jobDescription);
        break;

      case "cover-letter":
        if (!resumeData || !jobDescription) throw new Error("resumeData and jobDescription are required");
        result = await generateCoverLetter(resumeData, jobDescription);
        break;

      case "rewrite":
        if (!text) throw new Error("text is required");
        result = await rewriteText(text);
        break;

      case "concise":
        if (!text) throw new Error("text is required");
        result = await makeTextConcise(text);
        break;

      case "optimize":
        if (!resumeData || !jobDescription) throw new Error("resumeData and jobDescription are required");
        result = await optimizeResume(resumeData, jobDescription);
        break;

      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
