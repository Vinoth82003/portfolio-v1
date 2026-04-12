import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Project from "@/models/Project";
import CaseStudy from "@/models/CaseStudy";
import Skill from "@/models/Skill";
import { PROJECTS } from "@/app/data/projects";
import { CASE_STUDIES } from "@/app/data/case-studies";
import { SKILLS } from "@/app/data/skills";
import Blog from "@/models/Blog";
import { BLOGS } from "@/app/data/blogs";
import { invalidateCache } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    console.log("Starting DB seeding...");
    await connectToDatabase();
    console.log("Database connected.");

    // 1. Seed Projects
    console.log("Seeding projects...");
    console.log("Project schema paths:", Object.keys(Project.schema.paths));
    const projectResults = await Promise.all(
      PROJECTS.map(async (p: any) => {
        try {
          return await Project.findOneAndUpdate(
            { id: p.id },
            { ...p },
            { upsert: true, new: true, runValidators: true }
          );
        } catch (e: any) {
          console.error(`Error seeding project ${p.id}:`, e.message);
          throw e;
        }
      })
    );
    console.log(`Projects seeded: ${projectResults.length}`);

    // 2. Seed Case Studies
    console.log("Seeding case studies...");
    const caseStudyResults = await Promise.all(
      CASE_STUDIES.map(async (cs: any) => {
        try {
          return await CaseStudy.findOneAndUpdate(
            { id: cs.id },
            { ...cs },
            { upsert: true, new: true, runValidators: true }
          );
        } catch (e: any) {
          console.error(`Error seeding case study ${cs.id}:`, e.message);
          throw e;
        }
      })
    );
    console.log(`Case studies seeded: ${caseStudyResults.length}`);

    // 3. Seed Skills
    console.log("Seeding skills...");
    const skillResults = await Promise.all(
      SKILLS.map(async (s: any) => {
        try {
          return await Skill.findOneAndUpdate(
            { name: s.name },
            { ...s },
            { upsert: true, new: true, runValidators: true }
          );
        } catch (e: any) {
          console.error(`Error seeding skill ${s.name}:`, e.message);
          throw e;
        }
      })
    );
    console.log(`Skills seeded: ${skillResults.length}`);

    // 4. Seed Blogs
    console.log("Seeding blogs...");
    const blogResults = await Promise.all(
      BLOGS.map(async (b: any) => {
        try {
          return await Blog.findOneAndUpdate(
            { id: b.id },
            { ...b },
            { upsert: true, new: true, runValidators: true }
          );
        } catch (e: any) {
          console.error(`Error seeding blog ${b.id}:`, e.message);
          throw e;
        }
      })
    );
    console.log(`Blogs seeded: ${blogResults.length}`);

    // 5. Invalidate Caches
    console.log("Invalidating caches...");
    await Promise.all([
      invalidateCache("projects_list"),
      invalidateCache("case_studies_list"),
      invalidateCache("skills_list"),
      invalidateCache("blogs_list"),
      // Also invalidate individual items if they exist
      ...PROJECTS.map(p => invalidateCache(`project_${p.id}`)),
      ...CASE_STUDIES.map(cs => invalidateCache(`case_study_${cs.id}`)),
      ...BLOGS.map(b => invalidateCache(`blog_${b.id}`))
    ]);
    console.log("Caches invalidated.");

    // 6. Revalidate frontend paths
    revalidatePath("/projects");
    revalidatePath("/case-studies");
    revalidatePath("/blogs");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Seeding completed successfully",
      stats: {
        projects: projectResults.length,
        caseStudies: caseStudyResults.length,
        skills: skillResults.length,
        blogs: blogResults.length
      }
    });

  } catch (error: any) {
    console.error("Seeding error:", error);
    try {
      const fs = require('fs');
      fs.writeFileSync('seed_error.log', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
    } catch {}
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
