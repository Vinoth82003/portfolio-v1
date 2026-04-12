import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollToTop from "@/components/ScrollToTop";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinoth S | The Digital Architect",
  description: "Full Stack Developer and SAP ABAP Developer specializing in high-performance digital environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
          <ParticleBackground />
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'bg-surface-low text-foreground border border-outline/10 font-body',
              success: {
                iconTheme: {
                  primary: 'var(--primary)',
                  secondary: 'var(--surface-low)',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

