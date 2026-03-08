"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Resume deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`ml-auto flex items-center gap-1.5 rounded-lg p-1.5 text-xs transition-colors ${
        confirming
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : "text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
      }`}
      title={confirming ? "Click again to confirm" : "Delete"}
    >
      <Trash2 className="h-3 w-3" />
      {confirming && <span className="text-[10px]">Confirm?</span>}
    </button>
  );
}
