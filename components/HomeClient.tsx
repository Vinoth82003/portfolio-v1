"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ExternalLink, Code2, Terminal, Cloud, Award, Send, ChevronDown, Briefcase, FileText } from "lucide-react";
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

export default function HomeClient({ 
  initialProjects, 
  initialCaseStudies,
  initialExperiences, 
  initialSkills 
}: { 
  initialProjects: any[], 
  initialCaseStudies: any[],
  initialExperiences: any[], 
  initialSkills: any[] 
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-dim to-secondary origin-left z-[100]"
      />

      <Navbar />

      <main className="pt-20">
        <section id="home" className="min-h-[92vh] flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-10 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 blur-[140px] rounded-full -z-10" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/8 blur-[160px] rounded-full -z-10" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 w-full mt-10 md:mt-0">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-3xl flex-1 z-10 w-full">
              <motion.p variants={fadeUp} custom={0} className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold">
                Digital Architect · Full Stack Developer
              </motion.p>
              <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.95] tracking-tighter">
                VINOTH <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">S.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="max-w-2xl text-lg md:text-xl text-foreground/65 leading-relaxed font-body">
                Bridging technical mastery with editorial design to craft high-performance digital environments. Specializing in scalable web architecture and cloud integrations.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 pt-6">
                <BuildCTA text="Build Project" href="/contact" />
                <a href="/Vinoth_S_FullStack_Resume.pdf" target="_blank" rel="noopener noreferrer" className="border border-outline/30 px-6 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-surface-high hover:border-outline/60 transition-all flex items-center gap-2 group">
                  Resume <FileText size={16} className="text-primary" />
                </a>
                <Link href="/projects" className="border border-outline/30 px-6 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-surface-high hover:border-outline/60 transition-all flex items-center gap-2 group">
                  Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} 
              className="flex-1 relative w-full min-h-[300px] md:min-h-[400px] max-w-[400px] lg:max-w-[550px] mt-8 lg:mt-0"
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/10 to-transparent rounded-full blur-[100px] -z-10" />
                <Image 
                  src="/images/hero-image.png" 
                  alt="Vinoth S 3D Avatar" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_40px_80px_rgba(255,255,255,0.05)]" 
                  priority 
                />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/30">
            <span className="font-display text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-28 px-6 md:px-16 bg-surface-low relative">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-16">
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Career</p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Professional Journey</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {initialExperiences.map((exp, i) => (
                <motion.div key={exp._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <GlassCard hoverEffect glowColor="secondary" className="h-full bg-background">
                    <div className="mb-5 w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary">
                      <Briefcase size={20} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold mb-3">{exp.period}</p>
                    <h3 className="font-display text-xl font-bold mb-1">{exp.company}</h3>
                    <p className="text-sm text-primary mb-4 font-bold uppercase tracking-wider">{exp.title}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-body">{exp.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Portfolio</p>
              <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter">Architectural <span className="text-foreground/20">Works</span></h2>
            </div>
            <Link href="/projects" className="font-display text-sm font-bold uppercase tracking-widest hover:text-primary flex items-center gap-2 transition-colors group">
              All Projects <ExternalLink size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initialProjects.slice(0, 4).map((proj, i) => (
              <motion.div key={proj._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group">
                <Link href={`/projects/${proj._id}`}>
                  <div className="relative h-[400px] w-full mb-6 rounded-2xl overflow-hidden border border-outline/10 group-hover:border-outline/30 transition-all">
                    <Image src={proj.image} alt={proj.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold mb-2">{proj.type}</p>
                      <h3 className="font-display text-3xl font-black tracking-tight mb-4">{proj.title}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Case Studies Section */}
        {initialCaseStudies.length > 0 && (
          <section id="case-studies" className="py-28 px-6 md:px-16 bg-surface-low/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <p className="font-display text-secondary uppercase tracking-[0.3em] text-xs font-bold mb-4">Deep Dives</p>
                  <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter">Technical <span className="text-foreground/20">Case Studies</span></h2>
                </div>
                <Link href="/case-studies" className="font-display text-sm font-bold uppercase tracking-widest hover:text-secondary flex items-center gap-2 transition-colors group">
                  Knowledge Base <ExternalLink size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {initialCaseStudies.slice(0, 3).map((cs, i) => (
                  <motion.div key={cs._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Link href={`/case-studies/${cs.id}`}>
                      <GlassCard hoverEffect glowColor="secondary" className="h-full flex flex-col p-8 border-outline/10 group-hover:border-secondary/30 transition-all bg-background">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="bg-secondary/10 text-secondary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded border border-secondary/20">
                            {cs.category}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl font-black tracking-tight mb-4 leading-snug group-hover:text-secondary transition-colors line-clamp-2">{cs.title}</h3>
                        <p className="font-body text-sm text-foreground/50 leading-relaxed mb-8 flex-1 line-clamp-3">{cs.description}</p>
                        <div className="flex items-center justify-between border-t border-outline/10 pt-6">
                          <div className="font-display font-bold text-[8px] uppercase tracking-widest text-foreground/30">
                            {cs.readTime}
                          </div>
                          <div className="flex items-center gap-1 font-display font-black text-[9px] uppercase tracking-widest text-secondary">
                            View Study <ArrowRight size={12} />
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        <section id="skills" className="py-28 px-6 md:px-16 bg-surface-high relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">Arsenal</p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Technical Proficiency</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {initialSkills.map((skill, i) => {
                const isCodeSnippet = skill.icon?.trim().startsWith("<");
                
                let isValidURL = false;
                if (!isCodeSnippet && skill.icon) {
                  try {
                    new URL(skill.icon);
                    isValidURL = true;
                  } catch {
                    isValidURL = skill.icon.startsWith('/');
                  }
                }

                return (
                  <motion.div key={skill._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8 }} className="group bg-background/50 p-6 md:p-8 rounded-xl border border-outline/10 text-center flex flex-col items-center gap-6">
                    <div className="relative w-12 h-12 flex items-center justify-center text-primary fill-current">
                      {isCodeSnippet ? (
                        <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain" />
                      ) : isValidURL ? (
                        <Image src={skill.icon} alt={skill.name} fill sizes="48px" className="object-contain" />
                      ) : (
                        <Code2 size={48} />
                      )}
                    </div>
                    <div className="w-full flex flex-col items-center gap-3">
                      <p className="font-display font-bold tracking-[0.2em] text-[10px] uppercase text-foreground/50 group-hover:text-foreground transition-colors">{skill.name}</p>
                      {(skill.level && skill.level > 0) ? (
                        <div className="w-full h-[3px] bg-outline/10 rounded-full overflow-hidden mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-28 px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="font-display text-primary uppercase tracking-[0.3em] text-xs font-bold mb-6">Collaborate</p>
              <h2 className="font-display text-5xl md:text-7xl font-black mb-8 tracking-tighter">Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">Great.</span></h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <BuildCTA text="Build Project With Me" href="/contact" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
