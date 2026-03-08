import type { TemplateProps } from "@/types/template";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Star } from "lucide-react";

export default function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;
  const primary = data.colorScheme?.primary || "#1a365d";
  const accent = data.colorScheme?.accent || "#319795";

  return (
    <div className="resume-a4 text-sm text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Full-width color header */}
      <div className="p-8 text-white" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}>
        <div className="flex items-center gap-6">
          {personalInfo.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personalInfo.photo} alt="Profile" className="h-20 w-20 rounded-full border-4 border-white/40 object-cover shrink-0" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
            {personalInfo.title && <p className="text-white/80 mt-0.5 text-sm font-medium">{personalInfo.title}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/70">
              {personalInfo.email && (
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personalInfo.email}</span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personalInfo.phone}</span>
              )}
              {personalInfo.address && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personalInfo.address}</span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{personalInfo.linkedin.replace(/https?:\/\//, "")}</span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{personalInfo.website.replace(/https?:\/\//, "")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body: 2 columns */}
      <div className="flex">
        {/* Left column */}
        <div className="flex-1 p-6">
          {summary && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4" style={{ color: accent }} />
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>About</h2>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4" style={{ color: accent }} />
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Experience</h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                    <div className="font-bold text-xs text-gray-900">{exp.title}</div>
                    <div className="text-xs font-medium" style={{ color: accent }}>{exp.company}</div>
                    <div className="text-[10px] text-gray-400 mb-1">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      {exp.location && ` · ${exp.location}`}
                    </div>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                        <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                        {b}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-4 w-4" style={{ color: accent }} />
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Education</h2>
              </div>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                    <div className="font-bold text-xs text-gray-900">{edu.degree}</div>
                    <div className="text-xs" style={{ color: accent }}>{edu.institution}</div>
                    <div className="text-[10px] text-gray-400">
                      {edu.startDate} – {edu.endDate}
                      {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[180px] shrink-0 p-6" style={{ backgroundColor: "#f7fafc" }}>
          {skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Skills</h2>
              {skills.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <div className="text-[10px] font-semibold text-gray-500 mb-1">{cat.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill) => (
                      <span key={skill} className="rounded px-1.5 py-0.5 text-[9px] text-white" style={{ backgroundColor: accent }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Languages</h2>
              {languages.map((lang) => (
                <div key={lang.id} className="mb-1 text-[10px] text-gray-700">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-gray-400 ml-1">· {lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2 text-[10px]">
                  <div className="font-medium text-gray-800">{cert.name}</div>
                  <div className="text-gray-400">{cert.issuer}</div>
                  {cert.date && <div className="text-gray-400">{cert.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
