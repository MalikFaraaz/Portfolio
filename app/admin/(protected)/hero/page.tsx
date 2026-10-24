"use client";

import { useState, useEffect } from "react";
import { updateHeroAction } from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Check } from "lucide-react";

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    line1: "",
    line2: "",
    line3: "",
    roles: ["Flutter developer", "Full stack developer"],
    lead: "",
    cta1Label: "See my work",
    cta1Href: "#work",
    cta2Label: "Get in touch",
    cta2Href: "#contact",
    codeFile: "ride_provider.dart",
    codeLang: "dart",
    codeText: "",
  });

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.line1) {
          setForm({
            line1: data.line1,
            line2: data.line2,
            line3: data.line3,
            roles: typeof data.roles === "string" ? JSON.parse(data.roles) : data.roles,
            lead: data.lead,
            cta1Label: data.cta1Label,
            cta1Href: data.cta1Href,
            cta2Label: data.cta2Label,
            cta2Href: data.cta2Href,
            codeFile: data.codeFile,
            codeLang: data.codeLang || "dart",
            codeText: data.codeText,
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleRoleChange = (index: number, val: string) => {
    const updated = [...form.roles];
    updated[index] = val;
    setForm({ ...form, roles: updated });
  };

  const addRole = () => {
    setForm({ ...form, roles: [...form.roles, "New Role"] });
  };

  const removeRole = (index: number) => {
    if (form.roles.length <= 1) return;
    setForm({ ...form, roles: form.roles.filter((_, i) => i !== index) });
  };

  const moveRole = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.roles.length) return;
    const copy = [...form.roles];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setForm({ ...form, roles: copy });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    const res = await updateHeroAction(form);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setToast("Hero section updated successfully! Public site updated.");
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-mute">Loading hero configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Section</h1>
          <p className="text-mute text-sm mt-0.5">Customize the high-impact introduction screen</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 bg-panel border border-line rounded-2xl p-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold pb-2 border-b border-line">Headline Lines</h2>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Line 1</label>
              <input
                type="text"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Line 2</label>
              <input
                type="text"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Line 3</label>
              <input
                type="text"
                value={form.line3}
                onChange={(e) => setForm({ ...form, line3: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Typing Roles */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Typing Roles (Carousel)</h2>
              <button
                type="button"
                onClick={addRole}
                className="btn text-xs py-1.5 px-3 flex items-center gap-1 text-accent"
              >
                <Plus size={14} /> Add Role
              </button>
            </div>
            <div className="space-y-2">
              {form.roles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => handleRoleChange(idx, e.target.value)}
                    required
                    className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => moveRole(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRole(idx, "down")}
                    disabled={idx === form.roles.length - 1}
                    className="p-2 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRole(idx)}
                    disabled={form.roles.length <= 1}
                    className="p-2 rounded-lg border border-line text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Text */}
          <div className="pt-4 border-t border-line">
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Lead Text</label>
            <textarea
              rows={3}
              value={form.lead}
              onChange={(e) => setForm({ ...form, lead: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">CTA 1 Label</label>
              <input
                type="text"
                value={form.cta1Label}
                onChange={(e) => setForm({ ...form, cta1Label: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="#work"
                value={form.cta1Href}
                onChange={(e) => setForm({ ...form, cta1Href: e.target.value })}
                required
                className="w-full mt-2 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-xs font-mono outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">CTA 2 Label</label>
              <input
                type="text"
                value={form.cta2Label}
                onChange={(e) => setForm({ ...form, cta2Label: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="#contact"
                value={form.cta2Href}
                onChange={(e) => setForm({ ...form, cta2Href: e.target.value })}
                required
                className="w-full mt-2 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-xs font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Code Card Terminal */}
          <div className="space-y-4 pt-4 border-t border-line">
            <h2 className="text-base font-bold">Terminal Code Snippet</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-mute uppercase mb-1">File Name</label>
                <input
                  type="text"
                  value={form.codeFile}
                  onChange={(e) => setForm({ ...form, codeFile: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm font-mono outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mute uppercase mb-1">Language</label>
                <select
                  value={form.codeLang}
                  onChange={(e) => setForm({ ...form, codeLang: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
                >
                  <option value="dart">Dart</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="php">PHP</option>
                  <option value="json">JSON</option>
                  <option value="bash">Bash</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Code Text</label>
              <textarea
                rows={8}
                value={form.codeText}
                onChange={(e) => setForm({ ...form, codeText: e.target.value })}
                required
                className="w-full p-4 rounded-xl border border-line bg-code text-codeink font-mono text-xs leading-relaxed outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn p w-full justify-center font-bold"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <Save size={16} />
            <span>{loading ? "Saving Changes..." : "Save Hero Section"}</span>
          </button>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 sticky top-24 bg-panel border border-line rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line text-sm font-bold text-mute">
            <Eye size={16} />
            <span>Live Section Preview</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <div>{form.line1}</div>
              <div>{form.line2}</div>
              <div>{form.line3}</div>
            </h1>
            <div className="text-base font-semibold text-accent mt-2">
              {form.roles[0] || "Developer"}
            </div>
            <p className="text-xs text-mute mt-3 line-clamp-3">{form.lead}</p>
            <div className="flex gap-2 mt-4">
              <span className="btn p" style={{ padding: "6px 12px", fontSize: "12px" }}>
                {form.cta1Label} →
              </span>
              <span className="btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
                {form.cta2Label}
              </span>
            </div>
          </div>

          <div className="term mt-4">
            <div className="tb">
              <i></i><i></i><i></i>
              <span>{form.codeFile}</span>
            </div>
            <pre style={{ padding: "14px", minHeight: "140px", fontSize: "11px" }}>
              {form.codeText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
