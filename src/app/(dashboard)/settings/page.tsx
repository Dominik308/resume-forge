import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import SettingsForm from "@/components/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile
          </h2>
          <SettingsForm user={{ name: user.name || "", email: user.email || "" }} />
        </div>

        {/* AI Configuration */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LLM Provider
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    Ollama (Local)
                  </span>
                </div>
                <span className="text-xs text-gray-400">Free · Unlimited · Private</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {process.env.OLLAMA_MODEL || "llama3.1:8b"}
              </p>
            </div>
          </div>
        </div>

        {/* Export Preferences */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Export Defaults
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Format
              </label>
              <select className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paper Size
              </label>
              <select className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be sure.
          </p>
          <button className="rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
