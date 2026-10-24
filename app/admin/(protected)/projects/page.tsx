import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Eye, EyeOff, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  toggleProjectVisibilityAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "@/lib/actions";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects Management</h1>
          <p className="text-mute text-sm mt-0.5">Manage portfolio projects, visibility, and display order</p>
        </div>
        <Link href="/admin/projects/new" className="btn p flex items-center gap-2">
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="bg-panel border border-line rounded-2xl p-12 text-center text-mute">
            No projects found. Click &quot;New Project&quot; to add your first work.
          </div>
        ) : (
          projects.map((pj, idx) => {
            const tags: string[] = pj.tags ? JSON.parse(pj.tags) : [];
            return (
              <div
                key={pj.id}
                className={`bg-panel border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  pj.visible ? "border-line" : "border-line/60 opacity-70 bg-bg/50"
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-base text-ink">{pj.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-bg border border-line text-mute">
                      /{pj.slug}
                    </span>
                    {!pj.visible && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-mute line-clamp-1 max-w-xl">{pj.description}</p>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {tags.map((t, ti) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-md bg-bg text-mute border border-line">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <form
                    action={async () => {
                      "use server";
                      if (idx === 0) return;
                      const copy = [...projects];
                      const temp = copy[idx];
                      copy[idx] = copy[idx - 1];
                      copy[idx - 1] = temp;
                      await reorderProjectsAction(copy.map((p) => p.id));
                    }}
                  >
                    <button
                      type="submit"
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-2 rounded-xl border border-line bg-bg text-mute hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUp size={15} />
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      if (idx === projects.length - 1) return;
                      const copy = [...projects];
                      const temp = copy[idx];
                      copy[idx] = copy[idx + 1];
                      copy[idx + 1] = temp;
                      await reorderProjectsAction(copy.map((p) => p.id));
                    }}
                  >
                    <button
                      type="submit"
                      disabled={idx === projects.length - 1}
                      title="Move Down"
                      className="p-2 rounded-xl border border-line bg-bg text-mute hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </form>

                  {/* Toggle Visibility */}
                  <form
                    action={async () => {
                      "use server";
                      await toggleProjectVisibilityAction(pj.id, !pj.visible);
                    }}
                  >
                    <button
                      type="submit"
                      title={pj.visible ? "Hide from public site" : "Make visible publicly"}
                      className={`p-2 rounded-xl border ${
                        pj.visible
                          ? "border-line bg-bg text-mute hover:text-ink"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {pj.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </form>

                  {/* Edit */}
                  <Link
                    href={`/admin/projects/${pj.id}`}
                    title="Edit project"
                    className="p-2 rounded-xl border border-line bg-bg text-mute hover:text-accent hover:border-accent transition-colors"
                  >
                    <Edit size={15} />
                  </Link>

                  {/* Delete */}
                  <form
                    action={async () => {
                      "use server";
                      await deleteProjectAction(pj.id);
                    }}
                  >
                    <button
                      type="submit"
                      title="Delete project"
                      className="p-2 rounded-xl border border-line bg-bg text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
