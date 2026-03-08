"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function DuplicateResumeButton({ resumeId }: { resumeId: string }) {
  const router = useRouter();

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Duplicate failed");
      toast.success("Resume duplicated!");
      router.refresh();
    } catch {
      toast.error("Failed to duplicate resume");
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      className="flex items-center gap-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      title="Duplicate"
    >
      <Copy className="h-3 w-3" />
    </button>
  );
}
