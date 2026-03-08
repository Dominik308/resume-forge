import type { TemplateProps } from "@/types/template";
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Star } from "lucide-react";

export default function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages, certifications, colorScheme } = data;
  const primary = colorScheme?.primary || "#1a365d";
  const accent = colorScheme?.accent || "#319795";

  return (
    <div
      className="resume-a4 flex text-sm"
      style={{ fontFamily: data.fontConfig?.bodyFont || "Inter, sans-serif", color: "#1a202c" }}
    >
      {/* Sidebar */}
      <div className="w-[220px] shrink-0 min-h-full p-6 text-white" style={{ backgroundColor: primary }}>
        {/* Photo */}
        {personalInfo.photo && (
          <div className="mb-5 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={personalInfo.photo} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-white/30" />
          </div>
        )}

        {/* Name (mobile) — hidden on sidebar since we show in header */}

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Contact</h3>
          <div className="space-y-2">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 mt-0.5 opacity-60 shrink-0" />
                <span className="text-xs break-all opacity-80">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 opacity-60 shrink-0" />
                <span className="text-xs opacity-80">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 opacity-60 shrink-0" />
                <span className="text-xs opacity-80">{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-3 w-3 opacity-60 shrink-0" />
                <span className="text-xs break-all opacity-80">{personalInfo.linkedin.replace("https://", "").replace("http://", "")}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="h-3 w-3 opacity-60 shrink-0" />
                <span className="text-xs break-all opacity-80">{personalInfo.github.replace("https://", "").replace("http://", "")}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 opacity-60 shrink-0" />
                <span className="text-xs break-all opacity-80">{personalInfo.website.replace("https://", "").replace("http://", "")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Skills</h3>
            {skills.map((cat) => (
              <div key={cat.id} className="mb-3">
                <div className="text-xs font-semibold mb-1.5 opacity-70">{cat.category}</div>
                {/* Star rating mode when skillItems exist */}
                {cat.skillItems && cat.skillItems.length > 0 ? (
                  <div className="space-y-1">
                    {cat.skillItems.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <span className="text-[10px] opacity-80">{skill.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className="h-2.5 w-2.5"
                              fill={i < skill.level ? accent : "transparent"}
                              stroke={i < skill.level ? accent : "rgba(255,255,255,0.2)"}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Languages</h3>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-1.5">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="opacity-90">{lang.language}</span>
                  <span className="opacity-50">{lang.proficiency}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/20">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: lang.proficiency === "Native" ? "100%" : lang.proficiency === "Fluent" ? "90%" : lang.proficiency === "Advanced" ? "75%" : lang.proficiency === "Intermediate" ? "55%" : "35%",
                      backgroundColor: accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Certifications</h3>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="text-xs font-medium opacity-90">{cert.name}</div>
                <div className="text-[10px] opacity-50">{cert.issuer} · {cert.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2" style={{ borderColor: accent }}>
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: primary }}>
            {personalInfo.name || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-base mt-1 font-medium" style={{ color: accent }}>
              {personalInfo.title}
            </p>
          )}
          {personalInfo.headline && (
            <p className="text-sm mt-1 text-gray-500 italic">{personalInfo.headline}</p>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              Profile
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="flex items-start justify-between mb-0.5">
                    <div>
                      <div className="font-bold text-gray-900">{exp.title}</div>
                      <div className="text-sm font-medium text-gray-600">
                        {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-4">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{edu.degree}</div>
                    <div className="text-sm text-gray-600">
                      {edu.institution}{edu.location ? ` · ${edu.location}` : ""}
                      {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0 ml-4">
                    {edu.startDate} – {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-gray-900">{proj.name}</div>
                  {proj.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 text-[10px] rounded"
                          style={{ backgroundColor: `${accent}20`, color: accent }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
