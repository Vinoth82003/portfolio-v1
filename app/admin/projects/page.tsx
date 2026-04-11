import { getProjects } from "@/lib/actions/projects";
import ProjectManagement from "@/components/admin/ProjectManagement";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Manage Projects</h1>
        <p className="text-foreground/50 font-body">Curate your portfolio projects and showcase your digital architecture.</p>
      </header>

      <ProjectManagement initialProjects={JSON.parse(JSON.stringify(projects))} />
    </div>
  );
}
