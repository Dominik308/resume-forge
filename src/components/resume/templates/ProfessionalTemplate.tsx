import type { TemplateProps } from "@/types/template";

export default function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const primary = data.colorScheme?.primary || "#1a365d";

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-3">
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: primary, fontFamily: "Georgia, serif" }}>
        {children}
      </h2>
      <div className="mt-1 h-px w-full" style={{ backgroundColor: primary }} />
    </div>
  );

  return (
    <div className="resume-a4 text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div className="px-10 pt-8 pb-5 text-center border-b-2" style={{ borderColor: primary }}>
        <h1 className="text-3xl font-bold uppercase tracking-widest" style={{ color: primary }}>
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-sm mt-1 text-gray-600 italic">{personalInfo.title}</p>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>·</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>·</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>·</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/https?:\/\//, "")}</span>}
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex px-10 pt-5 gap-8">
        {/* Left main */}
        <div className="flex-1">
          {summary && (
            <div className="mb-5">
              <SectionTitle>Professional Summary</SectionTitle>
              <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-5">
              <SectionTitle>Professional Experience</SectionTitle>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{exp.title}</div>
                        <div className="text-xs text-gray-600 italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                      </div>
                      <div className="text-xs text-gray-500 shrink-0 ml-2">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </div>
                    </div>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="text-xs text-gray-700 leading-snug">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{edu.degree}</div>
                      <div className="text-xs text-gray-600 italic">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
                      {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 ml-2">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[170px] shrink-0">
          {skills.length > 0 && (
            <div className="mb-5">
              <SectionTitle>Core Skills</SectionTitle>
              {skills.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">{cat.category}</div>
                  <ul className="mt-1 space-y-0.5">
                    {cat.items.map((skill) => (
                      <li key={skill} className="text-xs text-gray-700 before:content-['•'] before:mr-1.5 before:text-gray-400">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-5">
              <SectionTitle>Languages</SectionTitle>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>{lang.language}</span>
                  <span className="text-gray-500 italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionTitle>Certifications</SectionTitle>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <div className="text-xs font-bold text-gray-800">{cert.name}</div>
                  <div className="text-[10px] text-gray-500 italic">{cert.issuer}</div>
                  {cert.date && <div className="text-[10px] text-gray-400">{cert.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
