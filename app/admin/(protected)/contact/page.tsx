"use client";

import { useState, useEffect } from "react";
import {
  updateContactInfoAction,
  saveSocialLinkAction,
  deleteSocialLinkAction,
  reorderSocialLinksAction,
} from "@/lib/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Check } from "lucide-react";

export default function AdminContactPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [heading, setHeading] = useState("");
  const [footerLeft, setFooterLeft] = useState("");
  const [footerRight, setFooterRight] = useState("");

  const [socialLinks, setSocialLinks] = useState<Array<{ id: string; label: string; url: string; visible: boolean; order: number }>>([]);
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  const loadData = () => {
    fetch("/api/admin/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data.contactInfo) {
          setEmail(data.contactInfo.email);
          setHeading(data.contactInfo.heading);
          setFooterLeft(data.contactInfo.footerLeft);
          setFooterRight(data.contactInfo.footerRight);
        }
        if (data.socialLinks) {
          setSocialLinks(data.socialLinks);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateContactInfoAction({ email, heading, footerLeft, footerRight });
    setLoading(false);
    setToast("Contact information updated!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.label || !newLink.url) return;
    await saveSocialLinkAction({ label: newLink.label, url: newLink.url, visible: true });
    setNewLink({ label: "", url: "" });
    loadData();
  };

  const handleDeleteLink = async (id: string) => {
    await deleteSocialLinkAction(id);
    loadData();
  };

  const handleMoveLink = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= socialLinks.length) return;
    const copy = [...socialLinks];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSocialLinks(copy);
    await reorderSocialLinksAction(copy.map((l) => l.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact & Social Links</h1>
          <p className="text-mute text-sm mt-0.5">Customize email, call-to-action headline, and footer metadata</p>
        </div>
        {toast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
            <Check size={16} />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* Contact Info Form */}
      <form onSubmit={handleSaveContact} className="bg-panel border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold pb-2 border-b border-line">Contact Headline & Email</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Big Headline</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Direct Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Footer Left Text</label>
            <input
              type="text"
              value={footerLeft}
              onChange={(e) => setFooterLeft(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Footer Right Text</label>
            <input
              type="text"
              value={footerRight}
              onChange={(e) => setFooterRight(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn p font-bold">
          <Save size={16} /> Save Contact Info
        </button>
      </form>

      {/* Social Links */}
      <div className="bg-panel border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold pb-2 border-b border-line">Social Profile Links</h2>

        <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Label (e.g. GitHub, LinkedIn, X)"
            value={newLink.label}
            onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
            required
            className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
          <input
            type="url"
            placeholder="URL (https://...)"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            required
            className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn p font-semibold shrink-0">
            <Plus size={16} /> Add Link
          </button>
        </form>

        <div className="space-y-2">
          {socialLinks.map((link, idx) => (
            <div
              key={link.id}
              className="p-3.5 rounded-xl border border-line bg-bg flex items-center justify-between gap-4"
            >
              <div>
                <span className="font-bold text-sm text-ink block">{link.label}</span>
                <span className="text-xs text-mute font-mono">{link.url}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMoveLink(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveLink(idx, "down")}
                  disabled={idx === socialLinks.length - 1}
                  className="p-1.5 rounded-lg border border-line text-mute hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-1.5 rounded-lg border border-line text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
