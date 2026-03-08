import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    color: "#1a202c",
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a365d",
    paddingBottom: 8,
  },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1a365d", marginBottom: 2 },
  title: { fontSize: 11, color: "#319795", marginBottom: 3 },
  contact: { fontSize: 8, color: "#718096" },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#319795",
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 2,
  },
  experienceItem: { marginBottom: 6 },
  jobTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  company: { fontSize: 9, color: "#4a5568" },
  dates: { fontSize: 8, color: "#718096" },
  bullet: { fontSize: 8.5, color: "#2d3748", marginLeft: 8, marginBottom: 1.5 },
  summary: { fontSize: 9, color: "#4a5568", lineHeight: 1.5 },
  skillRow: { flexDirection: "row", marginBottom: 2 },
  skillCategory: { fontSize: 9, fontFamily: "Helvetica-Bold", width: 80, color: "#4a5568" },
  skillItems: { fontSize: 9, flex: 1, color: "#2d3748" },
  row: { flexDirection: "row", justifyContent: "space-between" },
});

export function ResumePDFDocument({ data }: { data: ResumeData }) {
  const contactParts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.address,
    data.personalInfo.linkedin?.replace(/https?:\/\//, ""),
    data.personalInfo.website?.replace(/https?:\/\//, ""),
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name || "Resume"}</Text>
          {data.personalInfo.title ? <Text style={styles.title}>{data.personalInfo.title}</Text> : null}
          <Text style={styles.contact}>{contactParts.join("  ·  ")}</Text>
        </View>

        {/* Summary */}
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {data.experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.row}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.dates}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                </Text>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {data.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.experienceItem}>
                <View style={styles.row}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  <Text style={styles.dates}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <Text style={styles.company}>
                  {edu.institution}{edu.location ? ` · ${edu.location}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((cat) => (
              <View key={cat.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{cat.category}:</Text>
                <Text style={styles.skillItems}>{cat.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Languages */}
        {data.languages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.skillItems}>
              {data.languages.map((l) => `${l.language} (${l.proficiency})`).join("  ·  ")}
            </Text>
          </View>
        ) : null}

        {/* Certifications */}
        {data.certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert) => (
              <Text key={cert.id} style={styles.bullet}>
                • {cert.name} — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
