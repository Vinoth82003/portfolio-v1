import { getExperiences } from "@/lib/actions/experience";
import ExperienceManagement from "@/components/admin/ExperienceManagement";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Manage Career</h1>
        <p className="text-foreground/50 font-body">Document your professional journey and industry milestones.</p>
      </header>

      <ExperienceManagement initialExperiences={JSON.parse(JSON.stringify(experiences))} />
    </div>
  );
}
