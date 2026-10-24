"use client";

import { useState, useEffect } from "react";
import { addTechAction, deleteTechAction, reorderTechAction } from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminTechPage() {
  const [techs, setTechs] = useState<Array<{ id: string; name: string; order: number }>>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/admin/tech")
      .then((res) => res.json())
      .then((data) => setTechs(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await addTechAction(name.trim());
    if (res?.error) {
      setError(res.error);
    } else {
      setName("");
      setError(null);
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTechAction(id);
    loadData();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= techs.length) return;
    const copy = [...techs];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setTechs(copy);
    await reorderTechAction(copy.map((t) => t.id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tech Stack Marquee</h1>
        <p className="text-mute text-sm mt-0.5">Manage the running technology marquee ticker</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Add New Tech */}
      <form onSubmit={handleAdd} className="bg-panel border border-line rounded-2xl p-6 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add technology (e.g. Flutter, Kotlin, Redis)"
          required
          className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
        />
        <button type="submit" className="btn p font-semibold">
          <Plus size={16} />
          <span>Add Technology</span>
        </button>
      </form>

      {/* List */}
      <div className="bg-panel border border-line rounded-2xl p-6 space-y-2">
        <h2 className="text-base font-bold pb-2 border-b border-line">Display Order</h2>
        {techs.length === 0 ? (
          <div className="text-center py-8 text-mute text-sm">No technologies added yet.</div>
        ) : (
          techs.map((tech, idx) => (
            <div
              key={tech.id}
              className="p-3 rounded-xl border border-line bg-bg flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-xs text-mute font-mono">{idx + 1}.</span>
                <span className="font-bold text-sm text-ink">{tech.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === techs.length - 1}
                  className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(tech.id)}
                  className="p-1.5 rounded-lg border border-line text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
