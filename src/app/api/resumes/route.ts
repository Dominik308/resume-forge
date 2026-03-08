import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      templateId: true,
      atsScore: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: body.title || "Untitled Resume",
      templateId: body.templateId || "modern",
      personalInfo: body.personalInfo || {},
      summary: body.summary || null,
      experience: body.experience || [],
      education: body.education || [],
      skills: body.skills || [],
      projects: body.projects || [],
      certifications: body.certifications || [],
      languages: body.languages || [],
      customSections: body.customSections || [],
      colorScheme: body.colorScheme || null,
      fontConfig: body.fontConfig || null,
    },
  });

  return NextResponse.json({ resume }, { status: 201 });
}
