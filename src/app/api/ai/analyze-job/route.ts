import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeJobDescription } from "@/lib/ai/content-generator";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "jobDescription is required and must be a string" },
        { status: 400 }
      );
    }

    const result = await analyzeJobDescription(jobDescription);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
