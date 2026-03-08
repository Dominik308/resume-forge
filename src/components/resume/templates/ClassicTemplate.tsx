import type { TemplateProps } from "@/types/template";

export default function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;

  return (
    <div className="resume-a4 px-10 py-9 text-gray-900" style={{ fontFamily: "Times New Roman, Times, serif", fontSize: "11pt" }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <div className="text-sm mt-0.5 text-gray-600">{personalInfo.title}</div>
        )}
        <div className="mt-1.5 text-xs text-gray-600 flex flex-wrap justify-center gap-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.address && <><span>|</span><span>{personalInfo.address}</span></>}
          {personalInfo.linkedin && <><span>|</span><span>{personalInfo.linkedin.replace(/https?:\/\//, "")}</span></>}
          {personalInfo.website && <><span>|</span><span>{personalInfo.website.replace(/https?:\/\//, "")}</span></>}
        </div>
      </div>

      <hr className="border-gray-900 border-t-2 mb-4" />

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Summary</h2>
          <hr className="border-gray-400 mb-2" />
          <p className="text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Experience</h2>
          <hr className="border-gray-400 mb-2" />
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <div className="font-bold text-xs">{exp.title}, {exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                  <div className="text-xs text-gray-600 shrink-0 ml-2">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 pl-4 list-disc space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-xs leading-snug">{b}</li>
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
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Education</h2>
          <hr className="border-gray-400 mb-2" />
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div className="text-xs">
                  <span className="font-bold">{edu.degree}</span>
                  <span className="ml-1">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</span>
                  {edu.gpa && <span className="ml-1 text-gray-600">| GPA: {edu.gpa}</span>}
                </div>
                <div className="text-xs text-gray-600 shrink-0 ml-2">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Skills</h2>
          <hr className="border-gray-400 mb-2" />
          {skills.map((cat) => (
            <div key={cat.id} className="mb-1 text-xs">
              <span className="font-bold">{cat.category}: </span>
              <span className="text-gray-800">{cat.items.join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Certifications</h2>
          <hr className="border-gray-400 mb-2" />
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-baseline justify-between text-xs mb-1">
              <div>
                <span className="font-bold">{cert.name}</span>
                <span className="ml-1 text-gray-600">| {cert.issuer}</span>
              </div>
              {cert.date && <span className="text-gray-600 shrink-0 ml-2">{cert.date}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h2 className="font-bold uppercase text-xs tracking-widest mb-1">Languages</h2>
          <hr className="border-gray-400 mb-2" />
          <div className="flex flex-wrap gap-4 text-xs">
            {languages.map((lang) => (
              <div key={lang.id}>
                <span className="font-bold">{lang.language}</span>
                <span className="text-gray-600 ml-1">({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
