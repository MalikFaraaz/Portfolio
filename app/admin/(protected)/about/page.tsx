"use client";

import { useState, useEffect } from "react";
import {
  updateAboutAction,
  createFactAction,
  updateFactAction,
  deleteFactAction,
  reorderFactsAction,
} from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Check, Edit2 } from "lucide-react";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tag, setTag] = useState("About me");
  const [heading, setHeading] = useState("I care about how it works and how it feels.");
  const [paragraphs, setParagraphs] = useState<string[]>([""]);
  const [facts, setFacts] = useState<Array<{ id: string; label: string; value: string; order: number }>>([]);

  const [newFact, setNewFact] = useState({ label: "", value: "" });
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editFactData, setEditFactData] = useState({ label: "", value: "" });

  const loadData = () => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.about) {
          setTag(data.about.tag);
          setHeading(data.about.heading);
          setParagraphs(
            typeof data.about.paragraphs === "string"
              ? JSON.parse(data.about.paragraphs)
              : data.about.paragraphs
          );
        }
        if (data.facts) {
          setFacts(data.facts);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...paragraphs];
    updated[index] = val;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, ""]);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await updateAboutAction({ tag, heading, paragraphs });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setToast("About section saved successfully!");
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleAddFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.label || !newFact.value) return;
    await createFactAction(newFact);
    setNewFact({ label: "", value: "" });
    loadData();
  };

  const handleUpdateFact = async (id: string) => {
    await updateFactAction(id, editFactData);
    setEditingFactId(null);
    loadData();
  };

  const handleDeleteFact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fact?")) return;
    await deleteFactAction(id);
    loadData();
  };

  const moveFact = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= facts.length) return;
    const copy = [...facts];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setFacts(copy);
    await reorderFactsAction(copy.map((f) => f.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">About & Highlights</h1>
          <p className="text-mute text-sm mt-0.5">Edit bio paragraphs and key highlight facts</p>
        </div>
        {toast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold animate-in fade-in">
            <Check size={16} />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Bio Form */}
      <form onSubmit={handleSaveAbout} className="bg-panel border border-line rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-line pb-3">Biography Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Section Tag</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold">Paragraphs</span>
              <p className="text-xs text-mute mt-0.5">Use **bold words** to highlight keywords with bold styling</p>
            </div>
            <button
              type="button"
              onClick={addParagraph}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1 text-accent"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-3 items-start">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                disabled={paragraphs.length <= 1}
                className="p-2.5 rounded-xl border border-line text-red-500 hover:bg-red-500/10 disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn p font-bold"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Save size={16} />
          <span>{loading ? "Saving About Section..." : "Save About Section"}</span>
        </button>
      </form>

      {/* Highlights / Facts Manager */}
      <div className="bg-panel border border-line rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-line pb-3">Key Facts (Sidebar Highlights)</h2>

        {/* Add Fact Form */}
        <form onSubmit={handleAddFact} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Label (e.g. Mobile)"
            value={newFact.label}
            onChange={(e) => setNewFact({ ...newFact, label: e.target.value })}
            required
            className="flex-1 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Value (e.g. Flutter, Android)"
            value={newFact.value}
            onChange={(e) => setNewFact({ ...newFact, value: e.target.value })}
            required
            className="flex-1 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn p font-semibold shrink-0">
            <Plus size={16} /> Add Fact
          </button>
        </form>

        {/* Facts List */}
        <div className="space-y-2">
          {facts.map((fact, idx) => (
            <div
              key={fact.id}
              className="p-3.5 rounded-xl border border-line bg-bg flex items-center justify-between gap-4"
            >
              {editingFactId === fact.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editFactData.label}
                    onChange={(e) => setEditFactData({ ...editFactData, label: e.target.value })}
                    className="w-1/3 px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                  />
                  <input
                    type="text"
                    value={editFactData.value}
                    onChange={(e) => setEditFactData({ ...editFactData, value: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-panel text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateFact(fact.id)}
                    className="btn p text-xs py-1 px-3"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFactId(null)}
                    className="btn text-xs py-1 px-3"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="min-w-0">
                    <span className="text-xs text-mute font-semibold uppercase block">{fact.label}</span>
                    <b className="text-sm font-bold text-ink">{fact.value}</b>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveFact(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFact(idx, "down")}
                      disabled={idx === facts.length - 1}
                      className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFactId(fact.id);
                        setEditFactData({ label: fact.label, value: fact.value });
                      }}
                      className="p-1.5 rounded-lg border border-line text-mute hover:text-ink"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFact(fact.id)}
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
    </div>
  );
}
