import { IBlog } from "@/interfaces/blogs";

export const BLOGS: IBlog[] = [
  {
    id: "blog-1",
    title: "Mitigating the Axios npm Supply Chain Compromise",
    slug: "mitigating-axios-npm-supply-chain-compromise",
    category: "Security",
    readTime: "7 min read",
    description: "On March 31, 2026, a massive supply chain breach hit the Axios npm package. We break down the timeline, analyze the malicious dependency injected, and outline strict remediation steps.",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&q=80",
    author: "Vinoth S",
    publishedAt: "2026-04-01T10:00:00Z",
    createdAt: "2026-04-01T10:00:00Z",
    content: `
On **March 31, 2026**, the JavaScript ecosystem was rocked by a sophisticated supply chain attack targeting one of its foundational libraries. Attackers gained unauthorized access to the npm account of a primary maintainer for \`axios\`, the ubiquitous HTTP client used across millions of Node.js and frontend applications. 

By pushing compromised versions, they effectively deployed a cross-platform Remote Access Trojan (RAT) capable of exfiltrating sensitive credentials and environment variables.

## The Timeline & Mechanism

Between **00:21 and 03:29 UTC**, the attackers published two malicious versions:
* \`axios v1.14.1\`
* \`axios v0.30.4\`

Rather than injecting the malware directly into the \`axios\` core logic, the attackers cleverly modified the \`package.json\` to include a newly published, malicious dependency named \`plain-crypto-js@4.2.1\`. 

Upon execution of \`npm install\`, \`plain-crypto-js\` leveraged npm's \`postinstall\` hook lifecycle to execute an obfuscated Node script. This script identified the host operating system (Windows, Linux, or macOS) and downloaded the appropriate secondary payload—a highly evasive Remote Access Trojan containing anti-forensic capabilities.

### Example: Identifying the Rogue Dependency

If your lockfile (\`package-lock.json\`, \`yarn.lock\`, or \`pnpm-lock.yaml\`) tracked the resolution during this window, you would see the rogue package resolving:

\`\`\`json
"axios": {
  "version": "1.14.1",
  "resolved": "https://registry.npmjs.org/axios/-/axios-1.14.1.tgz",
  "requires": {
    "plain-crypto-js": "^4.2.1"
  }
}
\`\`\`

## Remediation Steps: "Assume Breach"

Because the RAT executes silently in the background of CI environments and developer workstations, deleting the package is **not enough**. If your environment downloaded either of the compromised versions, you must operate under an **Assume Breach** mentality.

1. **Isolate Affected Systems**: Immediately quarantine any build server, developer laptop, or production container that built code during the affected window. Do not attempt to "clean" the systems, as the malware actively hides its execution traces.
2. **Rebuild from Scratch**: Nuke CI/CD runners and rebuild heavily isolated virtual environments.
3. **Aggressively Rotate Credentials**: Relying on your \`.env\`? If it was on disk, consider it compromised. You must immediately revoke and regenerate:
   * AWS / GCP / Azure Access Keys
   * GitHub / GitLab Personal Access Tokens (PATs)
   * npm publish tokens
   * Production Database connection strings.
4. **Audit Logs**: Carefully examine your audit logs for unusual repository cloning activity or CI pipeline triggers immediately following the compromise window.`
  },
  {
    id: "blog-2",
    title: "Anthropic’s Claude Code Source Code Leak: A Post-Mortem",
    slug: "anthropic-claude-code-leak-post-mortem",
    category: "AI & Tools",
    readTime: "5 min read",
    description: "A deep dive into the March 31, 2026 incident where Anthropic accidentally leaked over 500,000 lines of Claude Code's internal architecture via npm, and the resulting security threats.",
    image: "https://images.unsplash.com/photo-1620712948343-008423671dc2?w=1200&q=80",
    author: "Vinoth S",
    publishedAt: "2026-04-03T14:30:00Z",
    createdAt: "2026-04-03T14:30:00Z",
    content: `
In a strange twist of fate coinciding perfectly with the Axios supply chain incident, Anthropic suffered a massive operational leak on **March 31, 2026**. Through what the company officially designated as a "human error" during a package release, the entire proprietary codebase for their brand-new terminal agent, **Claude Code**, was unintentionally exposed to the public internet.

## How It Happened

The leak originated from Anthropic's official \`@anthropic-ai/claude-code\` npm package. When version \`2.1.88\` was published, the build process accidentally included a gargantuan source map file named \`cli.js.map\`. 

Source maps act as rosetta stones for bundlers, translating minified production code back into readable developer-authored code. Discovered rapidly by security researcher Chaofan Shou, this single file mapped back to approximately **512,000 lines of unobfuscated TypeScript code**, spread across nearly 2,000 internal modules.

## What Was Uncovered?

Though Anthropic rapidly issued DMCA takedown notices to scrub mirrors of the codebase, AI researchers gained unprecedented insights into how one of the world's most advanced autonomous coding agents operates under the hood:

*   **Anti-Distillation Guards**: Hardcoded structural boundaries designed to prevent users from easily extracting system prompts and routing logic for the purpose of fine-tuning competing models.
*   **"Undercover Mode"**: A fascinating internal flag used to purposefully obscure the agent's internal identity and internal system telemetry when negotiating API requests in specific environments.
*   **Agentic Routing Architecture**: Sophisticated multi-step reasoning algorithms written heavily in TypeScript that dictate when Claude Code should edit a file, run a bash command, or halt and ask the user for clarification.

## The Security Fallout

Anthropic confirmed that **no customer data or personal API keys were exposed**. The leak was purely architectural.

However, the security implications manifested elsewhere. Capitalizing on the hype, threat actors began spamming GitHub with repositories claiming to host the "Leaked Claude Code". Developers who cloned and ran these fake repositories inadvertently infected themselves with the Vidar infostealer and GhostSocks proxy malware, compounding the pain of the Axios breach that occurred the exact same day.`
  },
  {
    id: "blog-3",
    title: "Google's New Gemma 4: The Next Evolution of Open-Weight Models",
    slug: "google-gemma-4-evolution-open-weight",
    category: "AI Architecture",
    readTime: "8 min read",
    description: "Released on April 2, 2026, Google's Gemma 4 brings native multimodal processing, a 256K context window, and agentic intelligence to local edge devices under an Apache 2.0 license.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    author: "Vinoth S",
    publishedAt: "2026-04-06T09:15:00Z",
    createdAt: "2026-04-06T09:15:00Z",
    content: `
Just days after the turbulent security incidents of late March, Google DeepMind delivered highly anticipated news on **April 2, 2026**: the official release of the **Gemma 4** open-weight model family. 

Gemma 4 marks a significant convergence in open-source AI, directly borrowing the advanced reasoning and agentic frameworks from the proprietary Gemini 3 lineup, and making it available under a highly permissive Apache 2.0 license.

## Architectural Leaps

Google engineered Gemma 4 with a stark focus on "intelligence-per-parameter." Rather than bloating the model sizes, they improved training data curation and architectural efficiencies. 

The family is categorized into four distinct sizes tailored to different hardware environments:

1. **Gemma 4 E2B (~2B parameters)**: "Edge" optimized. Designed specifically to run beautifully on high-end Android phones and Raspberry Pi setups.
2. **Gemma 4 E4B (~4B parameters)**: The sweet spot for fast, local execution on consumer laptops with minimal unified memory.
3. **Gemma 4 26B (MoE)**: A Mixture-of-Experts architecture. While theoretically holding 26B parameters, it only activates ~4B parameters during active inference, affording massive generalization potential while remaining wildly efficient.
4. **Gemma 4 31B (Dense)**: The flagship powerhouse intended for multi-GPU setups, delivering near-frontier performance for complex coding and multi-step reasoning tasks.

## Key Advancements

### 1. Native Multimodality
Unlike previous iterations, Gemma 4 models are inherently multimodal from the ground up. They natively process intertwined text and images, allowing developers to build visual Q&A applications or image-based coding assistants locally without patching disparate vision models together.

### 2. Massive Context Windows
Context limitations are rapidly becoming a thing of the past. The E2B and E4B edge models possess a staggering **128K token context window**, while the 26B and 31B models effectively double that capacity to **256K tokens**. This enables the ingestion of entire monolithic codebases or multi-volume documentation directly into standard prompts.

### 3. Agentic Foundations
Gemma 4 was mathematically fine-tuned using DeepMind's proprietary datasets specifically optimized for **function calling** and **autonomous planning**. When prompted to resolve a programmatic issue, the model is significantly less likely to hallucinate an API endpoint and more likely to correctly output syntactically valid JSON payloads meant to trigger external tools.

## The Future of Edge AI

With the Apache 2.0 licensing, Google has thrown down the gauntlet. The ability to freely run, modify, and distribute commercial products powered by 256K-context, multimodal MoE models marks a definitive turning point for software engineering in 2026.`
  }
];
