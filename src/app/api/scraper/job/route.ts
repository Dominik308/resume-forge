import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeJobFromUrl } from "@/lib/scraper/job-scraper";
import { analyzeJobDescription } from "@/lib/ai/content-generator";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const scraped = await scrapeJobFromUrl(url);
    let analyzed = null;

    if (scraped.rawText) {
      analyzed = await analyzeJobDescription(scraped.rawText);
    }

    return NextResponse.json({ scraped, analyzed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scraping failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
