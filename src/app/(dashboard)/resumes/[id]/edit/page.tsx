import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ResumeEditorPage from "@/components/editor/ResumeEditorPage";

export const metadata: Metadata = { title: "Edit Resume" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session!.user!.id! },
  });

  if (!resume) notFound();

  return <ResumeEditorPage resume={resume as unknown as Parameters<typeof ResumeEditorPage>[0]["resume"]} />;
}
