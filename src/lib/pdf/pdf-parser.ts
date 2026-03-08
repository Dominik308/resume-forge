// PDF text extraction utility
// Uses pdf-parse in a safe manner for Next.js API routes

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build-time issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF. Please ensure the file is a valid PDF.");
  }
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf" || mimeType === "application/x-pdf") {
    return extractTextFromPDF(buffer);
  }
  // For plain text files
  if (mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

export function cleanExtractedText(text: string): string {
  return text
    .replace(/\x00/g, "") // Remove null bytes
    .replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F\u1E00-\u1EFF]/g, " ") // Keep printable ASCII + Latin extended
    .replace(/ {3,}/g, "  ") // Collapse multiple spaces
    .replace(/\n{4,}/g, "\n\n\n") // Collapse excessive newlines
    .trim();
}
