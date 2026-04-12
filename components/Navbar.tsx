"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import BuildCTA from "./BuildCTA";
import Link from "next/link";

const navLinks = [
  { name: "Projects", href: "/projects" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-background/60 backdrop-blur-xl border-b border-outline shadow-ambient" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            VINOTH<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dim to-secondary ml-0.5">.S</span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "font-display text-sm uppercase tracking-widest transition-colors",
                isActive ? "text-primary font-bold" : "hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          )})}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-surface-high transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <BuildCTA text="Build Project" className="py-3 px-6 text-xs shadow-none border border-primary/20" />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-surface-high transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-outline p-6 md:hidden flex flex-col space-y-6 shadow-ambient"
          >
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "font-display text-lg tracking-widest hover:text-primary",
                  isActive && "text-primary font-bold"
                )}
              >
                {link.name}
              </Link>
            )})}
            <div className="pt-4 border-t border-outline/20">
              <BuildCTA text="Build Project" className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
