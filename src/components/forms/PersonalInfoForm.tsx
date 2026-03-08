"use client";

import { useResumeStore } from "@/stores/resume-store";
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, Github, FileText } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const info = resume.personalInfo;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h2>
      <p className="text-sm text-gray-500 mb-8">Your basic contact and profile details</p>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              <User className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Full Name *
            </label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => updatePersonalInfo({ name: e.target.value })}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <Briefcase className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Professional Title
            </label>
            <input
              type="text"
              value={info.title || ""}
              onChange={(e) => updatePersonalInfo({ title: e.target.value })}
              placeholder="Software Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              <Mail className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Email *
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <Phone className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Phone
            </label>
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <MapPin className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
            Location
          </label>
          <input
            type="text"
            value={info.address}
            onChange={(e) => updatePersonalInfo({ address: e.target.value })}
            placeholder="Berlin, Germany"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              <Linkedin className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              LinkedIn URL
            </label>
            <input
              type="url"
              value={info.linkedin}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/janedoe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <Globe className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Website / Portfolio
            </label>
            <input
              type="url"
              value={info.website}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
              placeholder="janedoe.dev"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <Github className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
            GitHub URL
          </label>
          <input
            type="url"
            value={info.github || ""}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/janedoe"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <FileText className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" />
            Headline / Tagline
          </label>
          <input
            type="text"
            value={info.headline || ""}
            onChange={(e) => updatePersonalInfo({ headline: e.target.value })}
            placeholder="e.g. Passionate full-stack engineer building products people love"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">A short tagline shown below your job title</p>
        </div>
      </div>
    </div>
  );
}

