"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Code2, Terminal, Cloud, Award, Send, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import BuildCTA from "@/components/BuildCTA";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

import { PROJECTS } from "@/app/data/projects";
import { SKILLS } from "@/app/data/skills";

const EXPERIENCE = [
  {
    company: "Accenture",
    role: "SAP ABAP Developer",
    period: "Oct 2025 – Present",
    desc: "Developing enterprise-level backend modules for high-performance business solutions.",
    icon: <Cloud size={20} className="text-primary" />,
  },
  {
    company: "Capitalreach.ai",
    role: "Full Stack Intern",
    period: "Feb 2024 – Feb 2025",
    desc: "Optimized backend APIs and built secure authentication systems in an agile international environment.",
    icon: <Terminal size={20} className="text-secondary" />,
  },
  {
    company: "KKL Pvt Ltd",
    role: "Team Lead",
    period: "Oct 2023 – Jan 2024",
    desc: "Led a team of 4 to design and develop a responsive admin panel UI using React.js.",
    icon: <Code2 size={20} className="text-accent" />,
  },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-dim to-secondary origin-left z-[100]"
      />

      <Navbar />

      <main className="pt-20">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          id="home"
          className="min-h-[92vh] flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-10 relative overflow-hidden"
        >
          {/* Ambient glows */}
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 blur-[140px] rounded-full -z-10" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/8 blur-[160px] rounded-full -z-10" />

          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-4xl">
            <motion.p variants={fadeUp} custom={0} className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold">
              Digital Architect · Full Stack Developer
            </motion.p>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl md:text-7xl lg:text-[8rem] font-black leading-[0.95] tracking-tighter"
            >
              VINOTH <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">S.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-2xl text-lg md:text-xl text-foreground/65 leading-relaxed font-body"
            >
              Bridging technical mastery with editorial design to craft high-performance digital environments. Specializing in scalable web architecture, cloud integrations, and immersive user experiences.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 pt-6">
              <BuildCTA text="Build Project With Me" href="/contact" />
              <Link
                href="/projects"
                className="border border-outline/30 px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-surface-high hover:border-outline/60 transition-all flex items-center gap-2 group"
              >
                View My Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/30"
          >
            <span className="font-display text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── EXPERIENCE ───────────────────────────────────────────── */}
        <section id="experience" className="py-28 px-6 md:px-16 bg-surface-low relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Career</p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Professional Journey</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EXPERIENCE.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <GlassCard hoverEffect glowColor="secondary" className="h-full bg-background">
                    <div className="mb-5 w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                      {exp.icon}
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-3">{exp.period}</p>
                    <h3 className="font-display text-xl font-bold mb-1">{exp.company}</h3>
                    <p className="text-sm text-primary mb-4 font-bold uppercase tracking-wider">{exp.role}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-body">{exp.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ─────────────────────────────────────────────── */}
        <section id="projects" className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Portfolio</p>
              <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter">
                Architectural <span className="text-foreground/20">Works</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="font-display text-sm font-bold uppercase tracking-widest hover:text-primary flex items-center gap-2 transition-colors group shrink-0"
            >
              All Projects <ExternalLink size={15} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={`/projects/${proj.id}`}>
                  <div className="relative h-[400px] w-full mb-6 rounded-2xl overflow-hidden border border-outline/10 group-hover:border-outline/30 transition-all">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover overlay CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-primary/90 backdrop-blur-sm text-surface-lowest font-display font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md flex items-center gap-2">
                        View Project <ArrowRight size={14} />
                      </span>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-2">{proj.type}</p>
                      <h3 className="font-display text-3xl font-black tracking-tight mb-4">{proj.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {proj.tech.map((t) => (
                          <span key={t} className="text-[9px] uppercase tracking-wider bg-background/80 backdrop-blur px-2.5 py-1 rounded font-display font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/55 leading-relaxed font-body">{proj.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SKILLS ───────────────────────────────────────────────── */}
        <section id="skills" className="py-28 px-6 md:px-16 bg-surface-high relative overflow-hidden">
          {/* Big ghost text */}
          <p className="absolute inset-0 flex items-center justify-center font-display text-[15vw] font-black tracking-tighter text-foreground/[0.03] select-none pointer-events-none">
            TOOLS
          </p>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Arsenal</p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Technical Proficiency</h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative bg-background/50 hover:bg-background py-8 px-4 rounded-xl border border-outline/10 text-center hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all flex flex-col items-center gap-6 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Container */}
                  <div 
                    className="relative z-10 w-12 h-12 flex items-center justify-center text-foreground/30 group-hover:text-primary transition-all duration-500 grayscale group-hover:grayscale-0 transform group-hover:scale-110"
                    dangerouslySetInnerHTML={{ __html: skill.icon }} 
                  />
                  
                  <div className="relative z-10 flex flex-col gap-1">
                    <p className="font-display font-bold tracking-[0.2em] text-[10px] uppercase text-foreground/50 group-hover:text-foreground transition-colors duration-300">
                      {skill.name}
                    </p>
                    <span className="h-0.5 w-0 group-hover:w-full bg-primary/30 mx-auto transition-all duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ─────────────────────────────────────────── */}
        <section className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Recognition</p>
              <h2 className="font-display text-4xl md:text-5xl font-black mb-8 tracking-tighter">
                Milestones & <span className="text-primary">Awards</span>
              </h2>
              <p className="text-foreground/55 mb-12 font-body text-lg">
                Innovation is at the core of every architectural choice. These accolades represent moments where design met pure functionality.
              </p>
              <div className="space-y-8">
                {[
                  { title: "UI/UX Challenge Winner", context: "Anna University (2024)", desc: "Best creative interface for healthcare monitoring." },
                  { title: "Smart India Hackathon", context: "National Finalist (2023)", desc: "Department Top 2 — Developed national security logistics platform." },
                ].map((award, i) => (
                  <motion.div
                    key={award.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Award size={22} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg mb-1">{award.title}</h4>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">{award.context}</p>
                      <p className="text-sm text-foreground/60 font-body">{award.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative"
            >
              {/* use this image as bg for this scroll with glass blury bg public/images/journey.jpg */}
              <div className="aspect-square bg-surface-low rounded-3xl p-10 relative overflow-hidden group border border-outline/10">
                <div className="bg-[url('/images/journey.jpg')] bg-cover bg-center blur-[2px] absolute top-0 right-0 w-full h-full"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 mix-blend-overlay opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/30 blur-[60px]" />
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <Terminal size={48} className="text-primary" />
                  <div className="font-display">
                    <p className="text-7xl font-black tracking-tighter mb-4">2022</p>
                    <p className="text-sm uppercase tracking-[0.2em] font-bold text-foreground/60">The Journey<br />Started</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 blur-[80px] -z-10" />
            </motion.div>
          </div>
        </section>

        {/* ── CASE STUDIES CTA STRIP ───────────────────────────────── */}
        <section className="py-20 px-6 md:px-16 bg-surface-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-display text-secondary uppercase tracking-[0.3em] text-xs font-bold mb-3">Deep Dives</p>
              <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Explore Case Studies</h2>
            </div>
            <Link
              href="/case-studies"
              className="shrink-0 border border-secondary/30 px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-secondary hover:text-surface-lowest hover:border-secondary transition-all flex items-center gap-3 group"
            >
              View Case Studies <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* ── CONTACT TEASER ───────────────────────────────────────── */}
        <section id="contact" className="py-28 px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6">Collaborate</p>
              <h2 className="font-display text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">Great.</span>
              </h2>
              <p className="text-lg text-foreground/60 mb-12 font-body max-w-xl mx-auto">
                Ready to architect your next digital breakthrough? Schedule a call and let's turn your vision into reality.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <BuildCTA text="Build Project With Me" href="/contact" />
                <a
                  href="mailto:vinothg0618@gmail.com"
                  className="border border-outline/30 px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-surface-high transition-all flex items-center gap-2"
                >
                  Send Email <Send size={15} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
