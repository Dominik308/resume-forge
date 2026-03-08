import * as cheerio from "cheerio";
import type { ScrapedJob } from "@/types/job";

const JOB_SELECTORS = [
  "[class*='job-description']",
  "[class*='jobDescription']",
  "[class*='description']",
  "[id*='job-description']",
  "[id*='jobDescription']",
  "article",
  "main",
  ".posting-description",
  "[data-testid*='description']",
  "[data-automation*='description']",
];

const TITLE_SELECTORS = [
  "h1",
  "[class*='job-title']",
  "[class*='jobTitle']",
  "[data-testid*='title']",
  ".posting-headline h2",
];

const COMPANY_SELECTORS = [
  "[class*='company']",
  "[data-testid*='company']",
  "[class*='employer']",
  ".org-name",
  "[itemprop='name']",
];

export async function scrapeJobFromUrl(url: string): Promise<ScrapedJob> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, header, footer, aside, .ads, .advertisement, .cookie-banner").remove();

    // Extract title
    let title = "";
    for (const selector of TITLE_SELECTORS) {
      const el = $(selector).first();
      if (el.text().trim()) {
        title = el.text().trim();
        break;
      }
    }
    if (!title) title = $("title").text().split("|")[0].split("-")[0].trim();

    // Extract company
    let company = "";
    for (const selector of COMPANY_SELECTORS) {
      const el = $(selector).first();
      if (el.text().trim()) {
        company = el.text().trim();
        break;
      }
    }

    // Extract job description text
    let rawText = "";
    for (const selector of JOB_SELECTORS) {
      const el = $(selector).first();
      if (el.text().trim().length > 200) {
        rawText = el.text().trim();
        break;
      }
    }

    // Fallback: get all body text
    if (!rawText || rawText.length < 200) {
      rawText = $("body").text().replace(/\s+/g, " ").trim();
    }

    // Clean up text
    rawText = rawText
      .replace(/\s+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 8000); // Limit to 8k chars for AI

    return { title, company, url, rawText, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      title: "",
      company: "",
      url,
      rawText: "",
      success: false,
      error: `Failed to scrape job: ${message}`,
    };
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
