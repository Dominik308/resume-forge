import type { TemplateProps } from "@/types/template";

export default function MinimalistTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const accent = data.colorScheme?.accent || "#319795";

  return (
    <div className="resume-a4 p-12 text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{personalInfo.name || "Your Name"}</h1>
        {personalInfo.title && (
          <p className="mt-1 text-sm font-medium uppercase tracking-widest" style={{ color: accent }}>
            {personalInfo.title}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/https?:\/\//, "")}</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/https?:\/\//, "")}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <hr className="mb-3" style={{ borderColor: "#e2e8f0" }} />
          <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <hr className="mb-4" style={{ borderColor: "#e2e8f0" }} />
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-sm text-gray-900">{exp.title}</span>
                    <span className="text-sm text-gray-500 ml-2">· {exp.company}</span>
                    {exp.location && <span className="text-xs text-gray-400 ml-2">{exp.location}</span>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1 pl-0">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-gray-300 shrink-0">—</span>
                        {b}
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
          <hr className="mb-4" style={{ borderColor: "#e2e8f0" }} />
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-sm text-gray-900">{edu.degree}</span>
                  <span className="text-xs text-gray-500 ml-2">· {edu.institution}</span>
                  {edu.gpa && <span className="text-xs text-gray-400 ml-2">GPA {edu.gpa}</span>}
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills + Languages + Certs in a row */}
      <div className="flex gap-8">
        {skills.length > 0 && (
          <div className="flex-1">
            <hr className="mb-4" style={{ borderColor: "#e2e8f0" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Skills
            </h2>
            {skills.map((cat) => (
              <div key={cat.id} className="mb-2">
                <span className="text-xs font-semibold text-gray-500">{cat.category}: </span>
                <span className="text-xs text-gray-700">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div className="w-36">
            <hr className="mb-4" style={{ borderColor: "#e2e8f0" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Languages
            </h2>
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{lang.language}</span>
                <span className="text-gray-400">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div className="w-44">
            <hr className="mb-4" style={{ borderColor: "#e2e8f0" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-xs text-gray-600 mb-1.5">
                <div className="font-medium">{cert.name}</div>
                <div className="text-gray-400">{cert.issuer} {cert.date && `· ${cert.date}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
