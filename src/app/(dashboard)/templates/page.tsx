import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TemplateGallery from "@/components/templates/TemplateGallery";

export const metadata: Metadata = {
  title: "Template Gallery - ResumeForge",
  description: "Browse and choose from professional resume templates",
};

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Gallery</h1>
          <p className="text-gray-500 mt-2">
            Choose a professional template to get started. Switch templates anytime in the editor.
          </p>
        </div>
        <TemplateGallery />
      </div>
    </div>
  );
}
