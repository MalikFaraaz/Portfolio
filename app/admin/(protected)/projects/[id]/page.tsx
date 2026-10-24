import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
  });

  if (!project) notFound();

  const features: string[] = project.features ? JSON.parse(project.features) : [];
  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-xl border border-line bg-bg text-mute hover:text-ink"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Project: {project.name}</h1>
          <p className="text-mute text-sm mt-0.5">Update project details, code snippet, and tags</p>
        </div>
      </div>

      <ProjectForm
        initialData={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          features,
          tags,
          codeFile: project.codeFile,
          codeLang: project.codeLang,
          codeText: project.codeText,
          liveUrl: project.liveUrl,
          visible: project.visible,
        }}
      />
    </div>
  );
}
