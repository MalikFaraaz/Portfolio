"use client";

import { useState } from "react";
import { saveProjectAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Eye, Check } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    id?: string;
    slug: string;
    name: string;
    description: string;
    features: string[];
    tags: string[];
    codeFile?: string | null;
    codeLang?: string | null;
    codeText?: string | null;
    liveUrl?: string | null;
    visible: boolean;
  };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [codeFile, setCodeFile] = useState(initialData?.codeFile || "");
  const [codeLang, setCodeLang] = useState(initialData?.codeLang || "dart");
  const [codeText, setCodeText] = useState(initialData?.codeText || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [visible, setVisible] = useState(initialData ? initialData.visible : true);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const addFeature = () => setFeatures([...features, ""]);
  const updateFeature = (i: number, val: string) => {
    const updated = [...features];
    updated[i] = val;
    setFeatures(updated);
  };
  const removeFeature = (i: number) => {
    if (features.length <= 1) return;
    setFeatures(features.filter((_, idx) => idx !== i));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: initialData?.id,
      name,
      slug,
      description,
      features: features.filter((f) => f.trim().length > 0),
      tags,
      codeFile: codeFile || null,
      codeLang: codeLang || "dart",
      codeText: codeText || null,
      liveUrl: liveUrl || null,
      visible,
    };

    const res = await saveProjectAction(payload);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setToast("Project saved successfully!");
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {toast && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Fields */}
        <div className="lg:col-span-7 bg-panel border border-line rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g. EasyGo"
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Slug (URL friendly)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="easygo"
                className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="A brief 1-2 sentence description of the product"
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-mute uppercase">Key Features (Bullet Points)</label>
              <button
                type="button"
                onClick={addFeature}
                className="btn text-xs py-1 px-2.5 text-accent"
              >
                <Plus size={13} /> Add Feature
              </button>
            </div>
            {features.map((feat, fi) => (
              <div key={fi} className="flex gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => updateFeature(fi, e.target.value)}
                  placeholder="e.g. Live GPS map & ride tracking"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(fi)}
                  disabled={features.length <= 1}
                  className="p-2 rounded-lg border border-line text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-3 pt-4 border-t border-line">
            <label className="text-xs font-semibold text-mute uppercase block">Technologies & Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type tag (e.g. Flutter) and press Enter"
                className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
              <button type="button" onClick={addTag} className="btn text-xs py-1 px-3">
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-bg border border-line text-ink"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-mute hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Code Terminal */}
          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="text-sm font-bold">Interactive Terminal Snippet</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-mute uppercase mb-1">Snippet Filename</label>
                <input
                  type="text"
                  value={codeFile}
                  onChange={(e) => setCodeFile(e.target.value)}
                  placeholder="trip_socket.dart"
                  className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm font-mono outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mute uppercase mb-1">Language</label>
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
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
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Plain Code</label>
              <textarea
                rows={6}
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                placeholder="// code snippet here"
                className="w-full p-4 rounded-xl border border-line bg-code text-codeink font-mono text-xs leading-relaxed outline-none"
              />
            </div>
          </div>

          {/* Visibility and URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
            <div>
              <label className="block text-xs font-semibold text-mute uppercase mb-1">Live Demo / Repo URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-1.5 rounded-lg border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="visible-check"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 text-accent rounded"
              />
              <label htmlFor="visible-check" className="text-sm font-semibold cursor-pointer">
                Visible on public website
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn p w-full justify-center font-bold"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <Save size={16} />
            <span>{loading ? "Saving Project..." : "Save Project"}</span>
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 sticky top-24 bg-panel border border-line rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line text-sm font-bold text-mute">
            <Eye size={16} />
            <span>Card Preview</span>
          </div>

          <article className="pj" style={{ position: "static", marginBottom: 0, padding: "24px" }}>
            <div>
              <h3 style={{ fontSize: "28px" }}>{name || "Project Name"}</h3>
              <p className="ds" style={{ fontSize: "14px", margin: "10px 0" }}>
                {description || "Project description will appear here"}
              </p>
              <ul>
                {features.filter(Boolean).map((f, i) => (
                  <li key={i} style={{ fontSize: "13px" }}>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="tgs">
                {tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            {codeText && (
              <div className="term" style={{ marginTop: "16px" }}>
                <div className="tb">
                  <i></i><i></i><i></i>
                  <span>{codeFile || "code"}</span>
                </div>
                <pre style={{ padding: "12px", minHeight: "100px", fontSize: "11px" }}>
                  {codeText}
                </pre>
              </div>
            )}
          </article>
        </div>
      </div>
    </form>
  );
}
