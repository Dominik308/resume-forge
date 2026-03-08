import type { TemplateProps } from "@/types/template";

export default function BoldTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const primary = data.colorScheme?.primary || "#1a365d";
  const accent = data.colorScheme?.accent || "#319795";

  return (
    <div className="resume-a4 text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero header */}
      <div className="px-8 py-7 text-white" style={{ backgroundColor: primary }}>
        <h1 className="text-4xl font-black tracking-tight uppercase leading-none">
          {(personalInfo.name || "Your Name").split(" ").map((word, i) => (
            <span key={i}>
              {i === 0 ? (
                <>{word}<br /></>
              ) : (
                <span style={{ color: accent }}>{word}</span>
              )}
              {i < (personalInfo.name || "Your Name").split(" ").length - 2 ? <br /> : ""}
            </span>
          ))}
        </h1>
        {personalInfo.title && (
          <p className="text-sm mt-2 font-medium tracking-widest uppercase text-white/70">{personalInfo.title}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/60">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/https?:\/\//, "")}</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/https?:\/\//, "")}</span>}
        </div>
      </div>

      <div className="px-8 pt-5">
        {summary && (
          <div className="mb-5">
            <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: accent }} />
            <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Skills as circle indicators */}
        {skills.length > 0 && (
          <div className="mb-5">
            <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: accent }} />
            <h2 className="text-xl font-black uppercase mb-3 tracking-tight" style={{ color: primary }}>
              Skills
            </h2>
            <div className="flex gap-6 flex-wrap">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">{cat.category}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-5">
            <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: accent }} />
            <h2 className="text-xl font-black uppercase mb-3 tracking-tight" style={{ color: primary }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="pl-4 border-l-4" style={{ borderColor: accent }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-sm text-gray-900 uppercase tracking-wide">{exp.title}</div>
                      <div className="text-xs font-semibold" style={{ color: accent }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-3 font-semibold">
                      {exp.startDate} – {exp.current ? "Now" : exp.endDate}
                    </div>
                  </div>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 mt-0.5">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                      {b}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex gap-8">
          {education.length > 0 && (
            <div className="flex-1">
              <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: accent }} />
              <h2 className="text-xl font-black uppercase mb-3 tracking-tight" style={{ color: primary }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="font-black text-sm text-gray-900">{edu.degree}</div>
                  <div className="text-xs font-semibold" style={{ color: accent }}>{edu.institution}</div>
                  <div className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {(certifications.length > 0 || languages.length > 0) && (
            <div className="w-52 shrink-0">
              {certifications.length > 0 && (
                <>
                  <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: accent }} />
                  <h2 className="text-xl font-black uppercase mb-3 tracking-tight" style={{ color: primary }}>Certs</h2>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="mb-2 text-xs">
                      <div className="font-bold text-gray-900">{cert.name}</div>
                      <div className="text-gray-500">{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</div>
                    </div>
                  ))}
                </>
              )}
              {languages.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-black uppercase tracking-wide mb-1.5" style={{ color: primary }}>Languages</div>
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-xs text-gray-700 mb-0.5">
                      <span className="font-semibold">{lang.language}</span>
                      <span className="text-gray-400">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
