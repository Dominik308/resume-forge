export interface JobDescription {
  id?: string;
  title: string;
  company?: string;
  url?: string;
  rawText: string;
  parsedData?: ParsedJobData;
  createdAt?: Date;
}

export interface ParsedJobData {
  title: string;
  company?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  keywords: string[];
  experienceLevel?: string;
  educationRequirements?: string[];
}

export interface ScrapedJob {
  title: string;
  company?: string;
  url: string;
  rawText: string;
  success: boolean;
  error?: string;
}
