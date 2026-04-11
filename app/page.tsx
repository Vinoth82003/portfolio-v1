import { getProjects } from "@/lib/actions/projects";
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
  const [projects, experiences, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <HomeClient 
      initialProjects={JSON.parse(JSON.stringify(projects))}
      initialExperiences={JSON.parse(JSON.stringify(experiences))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
    />
  );
}
