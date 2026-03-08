import type { TemplateProps } from "@/types/template";

export default function TechTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;
  const accent = data.colorScheme?.accent || "#319795";
  const primary = data.colorScheme?.primary || "#1a365d";

  return (
    <div className="resume-a4 p-9 text-gray-800" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span style={{ color: accent }}>{"<"}</span>
              {personalInfo.name || "Your Name"}
              <span style={{ color: accent }}>{" />"}</span>
            </h1>
            {personalInfo.title && (
              <p className="text-xs mt-0.5 text-gray-500">// {personalInfo.title}</p>
            )}
          </div>
          <div className="text-right text-[10px] text-gray-500 space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin.replace(/https?:\/\//, "")}</div>}
            {personalInfo.website && <div>{personalInfo.website.replace(/https?:\/\//, "")}</div>}
          </div>
        </div>
        <div className="mt-3 h-px" style={{ backgroundColor: accent }} />
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>
            /* About */
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            /* Skills */
          </div>
          <div className="space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.id} className="flex items-start gap-3">
                <span className="text-[10px] text-gray-500 shrink-0 w-28 text-right">{cat.category}:</span>
                <div className="flex flex-wrap gap-1">
                  {cat.items.map((skill) => (
                    <span key={skill} className="rounded px-1.5 py-0.5 text-[9px] font-mono border" style={{ borderColor: accent, color: accent }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
            /* Experience */
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between mb-0.5">
                  <div>
                    <span className="font-bold text-xs text-gray-900">{exp.title}</span>
                    <span className="text-[10px] text-gray-500 ml-2">@ {exp.company}</span>
                    {exp.location && <span className="text-[10px] text-gray-400 ml-1">({exp.location})</span>}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2" style={{ fontFamily: "monospace" }}>
                    [{exp.startDate} → {exp.current ? "now" : exp.endDate}]
                  </span>
                </div>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-gray-600 mt-0.5">
                    <span style={{ color: accent }}>▸</span>
                    {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
            /* Projects */
          </div>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-gray-900">{proj.name}</span>
                    {proj.url && <span className="text-[10px] text-gray-400 ml-2 italic">{proj.url.replace(/https?:\/\//, "")}</span>}
                  </div>
                </div>
                {proj.description && <p className="text-[10px] text-gray-600 mt-0.5">{proj.description}</p>}
                {(proj as { bullets?: string[] }).bullets?.filter(Boolean).map((b: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-gray-600 mt-0.5">
                    <span style={{ color: accent }}>▸</span>
                    {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom row: Education + Certs */}
      <div className="flex gap-8">
        {education.length > 0 && (
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              /* Education */
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 text-xs">
                <span className="font-bold text-gray-900">{edu.degree}</span>
                <span className="text-gray-500 ml-2">@ {edu.institution}</span>
                <span className="text-gray-400 ml-2 text-[10px]">[{edu.startDate} → {edu.endDate}]</span>
                {edu.gpa && <span className="text-gray-400 ml-1 text-[10px]">| GPA {edu.gpa}</span>}
              </div>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div className="w-52 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              /* Certifications */
            </div>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-[10px] text-gray-600 mb-1">
                <span className="font-medium text-gray-800">{cert.name}</span>
                <span className="text-gray-400 ml-1">| {cert.issuer}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
