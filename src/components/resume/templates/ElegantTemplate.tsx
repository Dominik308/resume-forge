import type { TemplateProps } from "@/types/template";

export default function ElegantTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const primary = data.colorScheme?.primary || "#1a365d";
  const accent = data.colorScheme?.accent || "#319795";

  const Divider = () => (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
      <div className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
      <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
    </div>
  );

  return (
    <div className="resume-a4 px-10 py-8 text-gray-800" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* Header */}
      <div className="text-center mb-2">
        <h1
          className="text-4xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${primary}, ${accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-sm mt-1 text-gray-500 italic tracking-widest">{personalInfo.title}</p>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-[10px] text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>·</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>·</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span>·</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin.replace(/https?:\/\//, "")}</span>}
          {personalInfo.website && <span>·</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/https?:\/\//, "")}</span>}
        </div>
      </div>

      <Divider />

      {summary && (
        <>
          <div className="text-center mb-1">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent, fontFamily: "Inter, sans-serif" }}>
              Professional Profile
            </h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed text-center italic max-w-lg mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            {summary}
          </p>
          <Divider />
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <div className="mb-3 text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent, fontFamily: "Inter, sans-serif" }}>
              Career Experience
            </h2>
          </div>
          <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-sm text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{exp.title}</span>
                    <span className="text-xs text-gray-500 ml-2 italic">{exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-3">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] text-gray-600 mt-0.5">
                    <span className="mt-1" style={{ color: accent }}>◆</span>
                    {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}

      {/* Education + Skills in 2 cols */}
      <div className="flex gap-10">
        {education.length > 0 && (
          <div className="flex-1">
            <div className="text-center mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent, fontFamily: "Inter, sans-serif" }}>
                Education
              </h2>
            </div>
            <div className="space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{edu.degree}</div>
                  <div className="text-xs text-gray-500 italic">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
                  <div className="text-[10px] text-gray-400">{edu.startDate} — {edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1" style={{ fontFamily: "Inter, sans-serif" }}>
          {skills.length > 0 && (
            <div className="mb-4">
              <div className="text-center mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                  Expertise
                </h2>
              </div>
              {skills.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">{cat.category}</div>
                  <div className="text-xs text-gray-700 mt-0.5 italic">{cat.items.join(" · ")}</div>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <div className="text-center mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                  Languages
                </h2>
              </div>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>{lang.language}</span>
                  <span className="text-gray-400 italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="mt-4">
              <div className="text-center mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                  Certifications
                </h2>
              </div>
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-gray-700 mb-1">
                  <span className="italic">{cert.name}</span>
                  <span className="text-gray-400 ml-1">· {cert.issuer}</span>
                  {cert.date && <span className="text-gray-400">, {cert.date}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
