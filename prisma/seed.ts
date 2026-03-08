import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Test user
  const passwordHash = await bcrypt.hash('Test1234!', 12)
  const user = await prisma.user.upsert({
    where: { email: 'test@local.dev' },
    update: {},
    create: {
      email: 'test@local.dev',
      name: 'Test User',
      passwordHash,
    },
  })
  console.log('✅ Test user created:', user.email)

  // Sample job description
  const existingJob = await prisma.jobDescription.findFirst({
    where: { userId: user.id },
  })

  const job = existingJob ?? await prisma.jobDescription.create({
    data: {
      userId: user.id,
      title: 'Senior Software Engineer',
      company: 'Acme Corp',
      rawText: `We are looking for a Senior Software Engineer with 5+ years of experience
in React, TypeScript, and Node.js. Experience with PostgreSQL and cloud platforms (AWS/GCP)
is required. You will architect scalable solutions, mentor junior developers, and collaborate
with product teams to deliver high-quality software.`,
      parsedData: {
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        preferredSkills: ['AWS', 'GCP', 'Docker'],
        experienceYears: 5,
        keywords: ['scalable', 'architecture', 'mentoring'],
      },
    },
  })

  // Check if resume already exists
  const existingResume = await prisma.resume.findFirst({
    where: { userId: user.id },
  })

  if (!existingResume) {
    await prisma.resume.create({
      data: {
        userId: user.id,
        title: 'My Software Engineer Resume',
        templateId: 'modern',
        targetJobId: job.id,
        personalInfo: {
          name: 'Test User',
          email: 'test@local.dev',
          phone: '+49 123 456789',
          address: 'Berlin, Germany',
          linkedin: 'linkedin.com/in/testuser',
          website: 'testuser.dev',
        },
        summary:
          'Experienced software engineer with 6 years building scalable web applications using React, TypeScript, and Node.js. Passionate about clean code and great user experiences.',
        experience: [
          {
            id: '1',
            title: 'Software Engineer',
            company: 'Tech GmbH',
            location: 'Berlin, Germany',
            startDate: '2021-01',
            endDate: '',
            current: true,
            bullets: [
              'Built and maintained React/TypeScript frontend serving 50k+ daily users',
              'Designed REST APIs with Node.js and Express, improving response time by 40%',
              'Led migration from JavaScript to TypeScript across 3 major services',
            ],
          },
          {
            id: '2',
            title: 'Junior Developer',
            company: 'Startup AG',
            location: 'Munich, Germany',
            startDate: '2019-06',
            endDate: '2020-12',
            current: false,
            bullets: [
              'Developed customer-facing features using Vue.js and Laravel',
              'Collaborated with design team to implement pixel-perfect UI components',
            ],
          },
        ],
        education: [
          {
            id: '1',
            degree: 'B.Sc. Computer Science',
            institution: 'TU Berlin',
            location: 'Berlin, Germany',
            startDate: '2015-10',
            endDate: '2019-03',
            gpa: '1.8',
            highlights: ['Thesis: Real-time Collaborative Editing Systems'],
          },
        ],
        skills: [
          { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
          { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'] },
          { category: 'Tools', items: ['Git', 'Docker', 'Linux', 'VS Code'] },
        ],
        languages: [
          { language: 'German', proficiency: 'Native' },
          { language: 'English', proficiency: 'Fluent (C1)' },
        ],
        colorScheme: {
          primary: '#1a365d',
          secondary: '#2d3748',
          accent: '#319795',
          text: '#1a202c',
          background: '#ffffff',
        },
        fontConfig: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: 'medium',
        },
      },
    })
    console.log('✅ Sample resume created')
  } else {
    console.log('ℹ️  Sample resume already exists — skipped')
  }

  console.log('')
  console.log('🎉 Seed complete!')
  console.log('   Login: test@local.dev')
  console.log('   Password: Test1234!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
