"use client";

import { Github, Linkedin, Mail, Twitter, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-surface-low border-t border-outline py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="font-display text-xl font-bold tracking-tight mb-2">
            VINOTH S
          </h2>
          <p className="text-sm text-foreground/60 max-w-xs">
            Architecting high-performance digital environments with intentional asymmetry and technical precision.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="https://github.com/Vinoth82003" className="hover:text-primary transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/vinoth82003" className="hover:text-primary transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:vinothg0618@gmail.com" className="hover:text-primary transition-colors">
            <Mail size={20} />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Twitter size={20} />
          </a>
          <a href="/Vinoth_S_FullStack_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="Resume">
            <FileText size={20} />
          </a>
        </div>



        <div className="text-right">
          <p className="text-xs text-foreground/40 font-display uppercase tracking-widest">
            © 2024 Digital Architect.
          </p>
          <p className="text-xs text-foreground/40 mt-1 italic">
            Built with Intentional Asymmetry.
          </p>
        </div>
      </div>
    </footer>
  );
}
