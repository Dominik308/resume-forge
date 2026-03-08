import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ResumePDFDocument } from "@/lib/pdf/resume-pdf-document";
import type { ResumeData } from "@/types/resume";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  let resumeData: ResumeData;
  if (body.resumeData) {
    resumeData = body.resumeData as ResumeData;
  } else {
    const dbResume = await prisma.resume.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!dbResume) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    resumeData = {
      id: dbResume.id,
      title: dbResume.title,
      personalInfo: dbResume.personalInfo as unknown as ResumeData["personalInfo"],
      summary: dbResume.summary || "",
      experience: (dbResume.experience as unknown as ResumeData["experience"]) || [],
      education: (dbResume.education as unknown as ResumeData["education"]) || [],
      skills: (dbResume.skills as unknown as ResumeData["skills"]) || [],
      projects: (dbResume.projects as unknown as ResumeData["projects"]) || [],
      certifications: (dbResume.certifications as unknown as ResumeData["certifications"]) || [],
      languages: (dbResume.languages as unknown as ResumeData["languages"]) || [],
      customSections: (dbResume.customSections as unknown as ResumeData["customSections"]) || [],
      templateId: dbResume.templateId,
      colorScheme: (dbResume.colorScheme as unknown as ResumeData["colorScheme"]) ?? undefined,
      fontConfig: (dbResume.fontConfig as unknown as ResumeData["fontConfig"]) ?? undefined,
    };
  }

  try {
    const element = React.createElement(ResumePDFDocument, { data: resumeData }) as unknown as Parameters<typeof renderToBuffer>[0];
    const buffer = await renderToBuffer(element);

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(resumeData.title || "resume")}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}