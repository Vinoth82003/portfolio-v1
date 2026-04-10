"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Mail, Phone, Linkedin, Github, Check, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const MEETING_TYPES = [
  { id: "intro", label: "Intro Call", duration: "30 min", desc: "Get to know each other and explore collaboration potential." },
  { id: "project", label: "Project Discussion", duration: "60 min", desc: "Deep-dive into your project requirements and architecture." },
  { id: "consultation", label: "Technical Consultation", duration: "45 min", desc: "Focused technical advice on your existing stack or problems." },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ContactPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(MEETING_TYPES[0]);
  const [step, setStep] = useState<"calendar" | "form" | "success">("calendar");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };
  const isWeekend = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null); setSelectedSlot(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null); setSelectedSlot(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          meetingType: selectedType.label,
          duration: selectedType.duration,
          date: `${MONTH_NAMES[currentMonth]} ${selectedDate}, ${currentYear}`,
          time: selectedSlot,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStep("success");
      toast.success("Meeting scheduled! Check your inbox.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeSlide = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }} className="mb-16">
            <p className="font-display text-primary uppercase tracking-[0.35em] text-xs font-bold mb-5">Collaborate</p>
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Let's Build <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary">Together.</span>
            </h1>
            <p className="text-foreground/55 font-body text-lg max-w-xl">
              Schedule a call and let's turn your vision into reality. Pick a time that works for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT: Meeting Info */}
            <aside className="space-y-6">
              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Meeting Type</p>
                <div className="space-y-3">
                  {MEETING_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedType.id === type.id ? "border-primary/50 bg-primary/10" : "border-outline/10 hover:border-outline/30 bg-background"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-display font-bold text-sm">{type.label}</p>
                        <span className="flex items-center gap-1 font-display text-[9px] uppercase tracking-wider text-foreground/40">
                          <Clock size={10} /> {type.duration}
                        </span>
                      </div>
                      <p className="font-body text-xs text-foreground/55">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/35 font-bold mb-6">Direct Contact</p>
                <div className="space-y-4">
                  {[
                    { icon: <Mail size={15} />, label: "vinothg0618@gmail.com", href: "mailto:vinothg0618@gmail.com" },
                    { icon: <Phone size={15} />, label: "+91 9384460843", href: "tel:+919384460843" },
                    { icon: <Linkedin size={15} />, label: "vinoth82003", href: "https://linkedin.com/in/vinoth82003" },
                    { icon: <Github size={15} />, label: "Vinoth82003", href: "https://github.com/Vinoth82003" },
                  ].map((item) => (
                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 text-foreground/55 hover:text-primary transition-colors group">
                      <span className="text-primary">{item.icon}</span>
                      <span className="font-body text-sm group-hover:underline underline-offset-2">{item.label}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </aside>

            {/* RIGHT: Calendar & Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === "calendar" && (
                  <motion.div key="calendar" variants={fadeSlide} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                    {/* Calendar */}
                    <GlassCard>
                      <div className="flex items-center justify-between mb-8">
                        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface-high transition-colors">
                          <ChevronLeft size={18} />
                        </button>
                        <h2 className="font-display font-black text-lg tracking-tight">
                          {MONTH_NAMES[currentMonth]} {currentYear}
                        </h2>
                        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface-high transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 mb-3">
                        {DAYS_OF_WEEK.map((d) => (
                          <div key={d} className="text-center font-display text-[10px] uppercase tracking-widest text-foreground/30 font-bold py-2">{d}</div>
                        ))}
                      </div>

                      {/* Day grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                          const past = isPastDate(day);
                          const weekend = isWeekend(day);
                          const disabled = past || weekend;
                          const selected = selectedDate === day;
                          return (
                            <button
                              key={day}
                              disabled={disabled}
                              onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                              className={`aspect-square flex items-center justify-center rounded-xl font-display font-bold text-sm transition-all
                                ${disabled ? "opacity-25 cursor-not-allowed" : "hover:bg-surface-high cursor-pointer"}
                                ${selected ? "bg-primary text-surface-lowest shadow-[0_0_20px_-5px_var(--primary)]" : ""}
                              `}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </GlassCard>

                    {/* Time Slots */}
                    {selectedDate && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <GlassCard>
                          <p className="font-display font-black text-base mb-6">
                            Available slots for <span className="text-primary">{MONTH_NAMES[currentMonth]} {selectedDate}</span>
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {TIME_SLOTS.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider border transition-all
                                  ${selectedSlot === slot ? "bg-primary text-surface-lowest border-primary shadow-[0_0_20px_-5px_var(--primary)]" : "border-outline/15 hover:border-outline/40 hover:bg-surface-high"}
                                `}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>

                          {selectedSlot && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-end">
                              <button
                                onClick={() => setStep("form")}
                                className="bg-gradient-to-br from-primary via-primary-dim to-secondary text-surface-lowest px-8 py-4 rounded-md font-display font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_24px_-8px_var(--primary)] transition-all flex items-center gap-2"
                              >
                                Continue to Details <ChevronRight size={15} />
                              </button>
                            </motion.div>
                          )}
                        </GlassCard>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === "form" && (
                  <motion.div key="form" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                    <GlassCard>
                      {/* Booking summary */}
                      <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-outline/10">
                        <span className="bg-primary/10 text-primary font-display font-bold text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg">
                          {selectedType.label} · {selectedType.duration}
                        </span>
                        <span className="bg-surface-high font-display font-bold text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg text-foreground/65">
                          {MONTH_NAMES[currentMonth]} {selectedDate}, {currentYear}
                        </span>
                        <span className="bg-surface-high font-display font-bold text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg text-foreground/65">
                          {selectedSlot} IST
                        </span>
                        <button onClick={() => setStep("calendar")} className="ml-auto font-display text-[9px] uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                          Change
                        </button>
                      </div>

                      <h2 className="font-display font-black text-xl mb-8">Your Details</h2>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Full Name *</label>
                            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                              placeholder="Vinoth S" />
                          </div>
                          <div>
                            <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Email *</label>
                            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                              placeholder="you@company.com" />
                          </div>
                        </div>
                        <div>
                          <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">Company / Project (Optional)</label>
                          <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25"
                            placeholder="Acme Inc." />
                        </div>
                        <div>
                          <label className="block font-display text-[9px] uppercase tracking-widest text-foreground/40 font-bold mb-2">What's on your mind?</label>
                          <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            className="w-full bg-surface-high/60 border border-outline/15 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/25 resize-none"
                            placeholder="Tell me about your project, idea, or question..." />
                        </div>
                        <button type="submit" disabled={loading}
                          className="w-full bg-gradient-to-br from-primary via-primary-dim to-secondary text-surface-lowest py-5 rounded-xl font-display font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_24px_-8px_var(--primary)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                          {loading ? "Scheduling..." : (<>Confirm & Schedule <Send size={15} /></>)}
                        </button>
                        <p className="text-center font-body text-xs text-foreground/35">
                          You'll receive a calendar invite at your email with a Google Meet link.
                        </p>
                      </form>
                    </GlassCard>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div key="success" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                    <GlassCard className="text-center py-20">
                      <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Check size={36} className="text-primary" />
                      </div>
                      <h2 className="font-display text-3xl font-black tracking-tighter mb-4">You're Booked!</h2>
                      <p className="font-body text-foreground/55 mb-3 max-w-sm mx-auto">
                        Your <strong className="text-foreground">{selectedType.label}</strong> is scheduled for{" "}
                        <strong className="text-primary">{MONTH_NAMES[currentMonth]} {selectedDate}, {currentYear} at {selectedSlot} IST</strong>.
                      </p>
                      <p className="font-body text-sm text-foreground/40 mb-10">A calendar invite has been sent to <strong>{form.email}</strong>.</p>
                      <button onClick={() => { setStep("calendar"); setSelectedDate(null); setSelectedSlot(null); setForm({ name: "", email: "", company: "", message: "" }); }}
                        className="font-display text-xs uppercase tracking-widest text-primary hover:underline underline-offset-4">
                        Schedule Another Call
                      </button>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
