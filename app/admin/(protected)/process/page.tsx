"use client";

import { useState, useEffect } from "react";
import {
  saveProcessStepAction,
  deleteProcessStepAction,
  reorderProcessStepsAction,
} from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check } from "lucide-react";

export default function AdminProcessPage() {
  const [steps, setSteps] = useState<Array<{ id: string; title: string; description: string; order: number }>>([]);
  const [newStep, setNewStep] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [toast, setToast] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/admin/process")
      .then((res) => res.json())
      .then((data) => setSteps(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.title || !newStep.description) return;
    await saveProcessStepAction(newStep);
    setNewStep({ title: "", description: "" });
    setToast("Process step added successfully!");
    setTimeout(() => setToast(null), 3000);
    loadData();
  };

  const handleUpdate = async (id: string) => {
    await saveProcessStepAction({ id, ...editData });
    setEditingId(null);
    setToast("Process step updated!");
    setTimeout(() => setToast(null), 3000);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this process step?")) return;
    await deleteProcessStepAction(id);
    loadData();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    const copy = [...steps];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSteps(copy);
    await reorderProcessStepsAction(copy.map((s) => s.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">How I Work (Process)</h1>
          <p className="text-mute text-sm mt-0.5">Define your development workflow steps</p>
        </div>
        {toast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
            <Check size={16} />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* Add Step */}
      <form onSubmit={handleAdd} className="bg-panel border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold pb-2 border-b border-line">Add Process Step</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Step Title (e.g. Understand)"
            value={newStep.title}
            onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
            required
            className="px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Description (e.g. I learn what the product must do...)"
            value={newStep.description}
            onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
            required
            className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
        </div>
        <button type="submit" className="btn p font-semibold">
          <Plus size={16} /> Add Step
        </button>
      </form>

      {/* List */}
      <div className="bg-panel border border-line rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-bold pb-2 border-b border-line">Configured Steps</h2>
        {steps.map((st, idx) => (
          <div
            key={st.id}
            className="p-4 rounded-xl border border-line bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {editingId === st.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleUpdate(st.id)}
                    className="btn p text-xs py-1 px-3"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn text-xs py-1 px-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-accent text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-ink">{st.title}</h3>
                  </div>
                  <p className="text-xs text-mute pl-7">{st.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
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
                    disabled={idx === steps.length - 1}
                    className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(st.id);
                      setEditData({ title: st.title, description: st.description });
                    }}
                    className="p-1.5 rounded-lg border border-line text-mute hover:text-ink"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(st.id)}
                    className="p-1.5 rounded-lg border border-line text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
