"use client";

import { useState, useEffect } from "react";
import { saveStatAction, deleteStatAction, reorderStatsAction } from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check } from "lucide-react";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Array<{ id: string; value: number; suffix: string; label: string; order: number }>>([]);
  const [newStat, setNewStat] = useState({ value: 0, suffix: "+", label: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ value: 0, suffix: "+", label: "" });
  const [toast, setToast] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.label) return;
    await saveStatAction(newStat);
    setNewStat({ value: 0, suffix: "+", label: "" });
    setToast("Stat metric created!");
    setTimeout(() => setToast(null), 3000);
    loadData();
  };

  const handleUpdate = async (id: string) => {
    await saveStatAction({ id, ...editData });
    setEditingId(null);
    setToast("Stat metric updated!");
    setTimeout(() => setToast(null), 3000);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    await deleteStatAction(id);
    loadData();
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= stats.length) return;
    const copy = [...stats];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setStats(copy);
    await reorderStatsAction(copy.map((s) => s.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Key Numbers & Stats</h1>
          <p className="text-mute text-sm mt-0.5">Manage the full-width counter stat metrics</p>
        </div>
        {toast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
            <Check size={16} />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* Add Stat */}
      <form onSubmit={handleAdd} className="bg-panel border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold pb-2 border-b border-line">Add Stat Metric</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Number Value</label>
            <input
              type="number"
              value={newStat.value}
              onChange={(e) => setNewStat({ ...newStat, value: parseInt(e.target.value) || 0 })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Suffix (+, etc.)</label>
            <input
              type="text"
              placeholder="+"
              value={newStat.suffix}
              onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Metric Label</label>
            <input
              type="text"
              placeholder="e.g. Major projects"
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
        <button type="submit" className="btn p font-semibold">
          <Plus size={16} /> Add Stat
        </button>
      </form>

      {/* List */}
      <div className="bg-panel border border-line rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-bold pb-2 border-b border-line">Display Metrics</h2>
        {stats.map((st, idx) => (
          <div
            key={st.id}
            className="p-4 rounded-xl border border-line bg-bg flex items-center justify-between gap-4"
          >
            {editingId === st.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                />
                <input
                  type="text"
                  value={editData.suffix}
                  onChange={(e) => setEditData({ ...editData, suffix: e.target.value })}
                  className="w-16 px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                />
                <input
                  type="text"
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                />
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
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black tracking-tight text-accent">
                    {st.value}{st.suffix}
                  </span>
                  <span className="font-semibold text-sm text-ink">{st.label}</span>
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
                    disabled={idx === stats.length - 1}
                    className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(st.id);
                      setEditData({ value: st.value, suffix: st.suffix, label: st.label });
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
