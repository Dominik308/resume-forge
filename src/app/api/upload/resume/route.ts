import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractTextFromBuffer } from "@/lib/pdf/pdf-parser";
import { parseResumeText } from "@/lib/ai/content-generator";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and plain text files are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text: string;
    if (file.type === "application/pdf") {
      text = await extractTextFromBuffer(buffer, "application/pdf");
    } else {
      text = await extractTextFromBuffer(buffer, "text/plain");
    }

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 422 }
      );
    }

    const parsed = await parseResumeText(text);

    return NextResponse.json({ parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
