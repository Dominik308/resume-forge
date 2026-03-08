import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  Shield,
  Download,
  Star,
  Check,
  Globe,
  Bot,
  Palette,
  LayoutTemplate,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Writing",
      description:
        "Local AI crafts impactful bullet points, professional summaries, and tailored cover letters in seconds — 100% private, no data leaves your machine.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Globe,
      title: "Job Description Analyzer",
      description:
        "Paste a URL or job text — AI extracts key requirements and tailors your resume to maximize match.",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Palette,
      title: "Beautiful Templates",
      description:
        "8 professionally designed templates. Customize colors, fonts, and layout with a Canva-like editor.",
      color: "from-violet-500 to-violet-600",
    },
    {
      icon: Zap,
      title: "ATS Optimization",
      description:
        "Get a real-time ATS score and keyword suggestions to ensure your resume passes applicant tracking systems.",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: FileText,
      title: "Smart PDF Import",
      description:
        "Upload your existing resume PDF — AI extracts and structures all your data automatically.",
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: Download,
      title: "Export Anywhere",
      description:
        "Download as high-quality PDF or DOCX. Print-ready at A4 with embedded fonts.",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const templates = [
    { name: "Modern", color: "#1a365d", accent: "#319795" },
    { name: "Creative", color: "#4c1d95", accent: "#8b5cf6" },
    { name: "Minimalist", color: "#1e293b", accent: "#64748b" },
    { name: "Tech", color: "#14532d", accent: "#16a34a" },
    { name: "Elegant", color: "#78350f", accent: "#d97706" },
    { name: "Bold", color: "#9a3412", accent: "#f97316" },
  ];

  const pricing = [
    {
      name: "Free",
      price: "€0",
      period: "forever",
      description: "Perfect to get started",
      features: [
        "3 resume documents",
        "4 templates",
        "PDF export",
        "Basic AI suggestions",
        "Job description analysis",
      ],
      cta: "Get Started Free",
      href: "/register",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "€9",
      period: "per month",
      description: "For serious job seekers",
      features: [
        "Unlimited resumes",
        "All 8 premium templates",
        "PDF + DOCX export",
        "Unlimited AI generation",
        "ATS score & optimization",
        "Cover letter generator",
        "Version history",
        "Priority support",
      ],
      cta: "Start 7-day Free Trial",
      href: "/register?plan=pro",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>
              ResumeForge{" "}
              <span className="text-teal-400">AI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors"
            >
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered · Runs Locally · 100% Private
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Build Resumes That
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Get You Hired
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            AI-powered resume builder with beautiful templates, ATS optimization,
            and intelligent content generation. From job listing to perfect resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-teal-500 px-8 py-4 text-lg font-semibold hover:bg-teal-400 transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              Create Your Resume Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold hover:bg-white/10 transition-all"
            >
              <FileText className="h-5 w-5" /> See Templates
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/40">
            No credit card required · Free forever plan available
          </p>

          {/* Hero mockup */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10 pointer-events-none" />
            <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-900/80 p-1 shadow-2xl shadow-black/50 backdrop-blur">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 mx-4 h-5 rounded bg-white/10 text-xs text-white/40 flex items-center px-3">
                  resumeforge.ai/resumes/edit
                </div>
              </div>
              <div className="grid grid-cols-12 gap-0 h-80">
                {/* Sidebar */}
                <div className="col-span-2 border-r border-white/10 p-3 space-y-2">
                  {["Sections", "Design", "AI"].map((item) => (
                    <div key={item} className="rounded-lg bg-white/5 px-2 py-2 text-xs text-white/60">
                      {item}
                    </div>
                  ))}
                </div>
                {/* Canvas */}
                <div className="col-span-7 flex items-center justify-center bg-slate-800/50 p-6">
                  <div className="w-40 h-56 bg-white rounded shadow-lg flex flex-col">
                    <div className="h-14 rounded-t" style={{ backgroundColor: "#1a365d" }}>
                      <div className="p-2">
                        <div className="h-2 w-20 rounded bg-white/80 mb-1"></div>
                        <div className="h-1.5 w-14 rounded bg-white/50"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-2 space-y-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-1">
                          <div className="h-1 rounded bg-gray-200" style={{ width: `${60 + i * 8}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* AI Panel */}
                <div className="col-span-3 border-l border-white/10 p-3 space-y-2">
                  <div className="text-xs text-teal-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI Assistant
                  </div>
                  {["Improve bullets", "Generate summary", "ATS Score: 87%"].map((item) => (
                    <div key={item} className="rounded bg-white/5 p-2 text-xs text-white/60">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-teal-400">land the job</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              From AI-powered writing to beautiful design, ResumeForge AI gives you every
              tool to create a resume that stands out.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all hover:border-white/20"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-24 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-teal-400">8 Professional</span> Templates
            </h2>
            <p className="text-lg text-white/50">
              Modern, beautiful designs that make your resume impossible to ignore.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template) => (
              <div
                key={template.name}
                className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-105"
              >
                <div className="aspect-[3/4] relative">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: template.color }}
                  >
                    <div className="p-3">
                      <div className="h-2 w-3/4 rounded bg-white/80 mb-1.5"></div>
                      <div className="h-1.5 w-1/2 rounded mb-3" style={{ backgroundColor: template.accent }}></div>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 rounded bg-white/30 mb-1"
                          style={{ width: `${50 + Math.random() * 40}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 px-3 py-2 text-center text-xs font-medium">
                  {template.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/10 px-8 py-3 text-teal-300 hover:bg-teal-500/20 transition-colors"
            >
              <LayoutTemplate className="h-4 w-4" />
              Explore All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { value: "50,000+", label: "Resumes Created" },
              { value: "87%", label: "Interview Rate" },
              { value: "4.9/5", label: "User Rating" },
              { value: "200+", label: "Job Boards Supported" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-teal-400">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                text: "The AI rewrote my bullet points and I went from 0 to 5 interviews in a week. It's like having a career coach in my pocket.",
                author: "Sarah M.",
                role: "Software Engineer",
                stars: 5,
              },
              {
                text: "The ATS score feature is a game changer. I boosted my score from 42% to 91% and finally started hearing back from companies.",
                author: "Marcus T.",
                role: "Marketing Manager",
                stars: 5,
              },
              {
                text: "Gorgeous templates and the AI tailor feature is brilliant. Submitted a customized resume for each job application, landed 3 offers.",
                author: "Priya K.",
                role: "Product Designer",
                stars: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-white/40">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-white/50">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-white/50 ml-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-teal-400 shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-teal-500 text-white hover:bg-teal-400"
                      : "border border-white/20 hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30 p-16">
            <Shield className="h-12 w-12 text-teal-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-lg mx-auto">
              Join thousands of professionals who used ResumeForge AI to create resumes that get results.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-10 py-4 text-lg font-bold text-white hover:bg-teal-400 transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              Create My Resume — It&apos;s Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            ResumeForge AI
          </div>
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/70">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70">Terms</Link>
            <Link href="/contact" className="hover:text-white/70">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
