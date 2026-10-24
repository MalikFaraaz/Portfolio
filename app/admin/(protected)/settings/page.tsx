"use client";

import { useState, useEffect } from "react";
import { updateSettingsAction, changePasswordAction } from "@/lib/actions";
import { Save, Lock, Check, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    siteTitle: "Faraz Hassan | Full Stack Developer",
    metaDescription: "",
    ogImageUrl: "",
    accentLight: "#2457F5",
    accentDark: "#4B7BFF",
    availableBadge: "Available for new projects",
    showBadge: true,
  });

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            siteTitle: data.siteTitle || "",
            metaDescription: data.metaDescription || "",
            ogImageUrl: data.ogImageUrl || "",
            accentLight: data.accentLight || "#2457F5",
            accentDark: data.accentDark || "#4B7BFF",
            availableBadge: data.availableBadge || "Available for new projects",
            showBadge: data.showBadge ?? true,
          });
        }
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await updateSettingsAction(settings);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setToast("Site configuration saved!");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError(null);
    const res = await changePasswordAction(pw);
    setPwLoading(false);
    if (res?.error) {
      setPwError(res.error);
    } else {
      setToast("Password updated successfully!");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site & Account Settings</h1>
          <p className="text-mute text-sm mt-0.5">Manage SEO metadata, theme accents, and credentials</p>
        </div>
        {toast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
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

      {/* SEO & Branding */}
      <form onSubmit={handleSaveSettings} className="bg-panel border border-line rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-bold pb-2 border-b border-line">SEO & Brand Colors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">OG Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/og.png"
              value={settings.ogImageUrl}
              onChange={(e) => setSettings({ ...settings, ogImageUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-mute uppercase mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={settings.metaDescription}
            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Accent Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Light Theme Accent</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.accentLight}
                onChange={(e) => setSettings({ ...settings, accentLight: e.target.value })}
                className="w-12 h-10 p-1 rounded-lg border border-line bg-bg cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentLight}
                onChange={(e) => setSettings({ ...settings, accentLight: e.target.value })}
                required
                className="flex-1 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm font-mono outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Dark Theme Accent</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.accentDark}
                onChange={(e) => setSettings({ ...settings, accentDark: e.target.value })}
                className="w-12 h-10 p-1 rounded-lg border border-line bg-bg cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentDark}
                onChange={(e) => setSettings({ ...settings, accentDark: e.target.value })}
                required
                className="flex-1 px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-center">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Availability Badge Text</label>
            <input
              type="text"
              value={settings.availableBadge}
              onChange={(e) => setSettings({ ...settings, availableBadge: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input
              type="checkbox"
              id="badge-check"
              checked={settings.showBadge}
              onChange={(e) => setSettings({ ...settings, showBadge: e.target.checked })}
              className="w-4 h-4 text-accent rounded"
            />
            <label htmlFor="badge-check" className="text-sm font-semibold cursor-pointer">
              Show badge in Hero section
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn p font-bold">
          <Save size={16} /> Save Settings
        </button>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="bg-panel border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold pb-2 border-b border-line flex items-center gap-2">
          <Lock size={16} />
          <span>Security & Password Change</span>
        </h2>

        {pwError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
            {pwError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Current Password</label>
            <input
              type="password"
              value={pw.currentPassword}
              onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">New Password (min 10 chars)</label>
            <input
              type="password"
              minLength={10}
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-mute uppercase mb-1">Confirm New Password</label>
            <input
              type="password"
              minLength={10}
              value={pw.confirmPassword}
              onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <button type="submit" disabled={pwLoading} className="btn p font-bold">
          <Lock size={15} /> Change Password
        </button>
      </form>
    </div>
  );
}
