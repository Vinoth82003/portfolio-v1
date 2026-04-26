import { getProjects } from "@/lib/actions/projects";
import { getCaseStudies } from "@/lib/actions/case-studies";
import { getExperiences } from "@/lib/actions/experience";
import { getSkills } from "@/lib/actions/skills";
import HomeClient from "@/components/HomeClient";

// SEO Metadata
export const metadata = {
  title: "Vinoth S | Digital Architect",
  description: "Crafting high-performance digital environments with technical mastery and editorial design.",
  openGraph: {
    title: "Vinoth S | Digital Architect",
    description: "Full Stack & SAP ABAP Developer Portfolio.",
    type: "website",
  },
};

export default async function Home() {
  const [projects, caseStudies, experiences, skills] = await Promise.all([
    getProjects(true),
    getCaseStudies(true),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <HomeClient 
      initialProjects={JSON.parse(JSON.stringify(projects))}
      initialCaseStudies={JSON.parse(JSON.stringify(caseStudies))}
      initialExperiences={JSON.parse(JSON.stringify(experiences))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
    />
  );
}
