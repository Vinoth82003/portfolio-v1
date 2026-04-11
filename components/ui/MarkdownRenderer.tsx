"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark as any}
                language={match[1]}
                PreTag="div"
                className="rounded-xl my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-surface-high px-1.5 py-0.5 rounded text-primary`} {...props}>
                {children}
              </code>
            );
          },
          // Custom styling for other elements if needed
          h1: ({ children }) => <h1 className="font-display text-4xl font-black tracking-tighter mb-6 mt-10">{children}</h1>,
          h2: ({ children }) => <h2 className="font-display text-2xl font-bold tracking-tight mb-4 mt-8">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display text-xl font-bold mb-3 mt-6">{children}</h3>,
          p: ({ children }) => <p className="font-body text-foreground/80 leading-relaxed mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="font-body text-foreground/80">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic bg-surface-high/30 rounded-r-xl my-6">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-outline/10 rounded-xl">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-surface-high p-3 text-left font-display font-bold border-b border-outline/10">{children}</th>,
          td: ({ children }) => <td className="p-3 border-b border-outline/5 font-body text-foreground/70">{children}</td>,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-2xl border border-outline/10 shadow-2xl my-8 max-h-[500px] w-auto mx-auto" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
