"use client";

import { useResumeStore } from "@/stores/resume-store";
import { Plus, Trash2, ExternalLink } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors";

export default function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } = useResumeStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
        <button
          onClick={addCertification}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: "#1a365d" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Cert
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">Add professional certifications, courses, and credentials.</p>

      {resume.certifications.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">No certifications yet. Click &quot;Add Cert&quot; to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {resume.certifications.map((cert) => (
          <div key={cert.id} className="rounded-xl border border-gray-100 p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 truncate">
                {cert.name || "New Certification"}
              </span>
              <button
                onClick={() => removeCertification(cert.id)}
                className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Certification Name</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                placeholder="AWS Certified Solutions Architect"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Credential URL (optional)
              </label>
              <input
                type="url"
                value={cert.url || ""}
                onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                placeholder="https://www.credly.com/badges/..."
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
