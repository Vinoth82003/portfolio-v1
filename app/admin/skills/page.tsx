import { getSkills } from "@/lib/actions/skills";
import SkillManagement from "@/components/admin/SkillManagement";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Technical Arsenal</h1>
        <p className="text-foreground/50 font-body">Manage your skills and technical proficiencies.</p>
      </header>

      <SkillManagement initialSkills={JSON.parse(JSON.stringify(skills))} />
    </div>
  );
}
