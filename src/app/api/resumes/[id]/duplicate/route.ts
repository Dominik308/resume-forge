import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const original = await prisma.resume.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!original) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const duplicate = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: `${original.title} (Copy)`,
        templateId: original.templateId,
        personalInfo: original.personalInfo as object,
        summary: original.summary,
        experience: original.experience as object[],
        education: original.education as object[],
        skills: original.skills as object[],
        projects: original.projects as object[],
        certifications: original.certifications as object[],
        languages: original.languages as object[],
        customSections: original.customSections as object[],
        colorScheme: original.colorScheme as object,
        fontConfig: original.fontConfig as object,
      },
    });

    return NextResponse.json({ id: duplicate.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Duplicate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
