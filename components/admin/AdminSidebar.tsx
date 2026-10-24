"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  User,
  FolderGit2,
  Cpu,
  Workflow,
  BarChart3,
  Mail,
  Inbox,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  unreadMessagesCount: number;
}

export function AdminSidebar({ unreadMessagesCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/hero", label: "Hero Section", icon: Sparkles },
    { href: "/admin/about", label: "About & Facts", icon: User },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/tech", label: "Tech Marquee", icon: Cpu },
    { href: "/admin/process", label: "Process Steps", icon: Workflow },
    { href: "/admin/stats", label: "Number Stats", icon: BarChart3 },
    { href: "/admin/contact", label: "Contact & Social", icon: Mail },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: Inbox,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-panel border-b border-line sticky top-0 z-40">
        <Link href="/admin" className="font-extrabold text-lg tracking-tight">
          Admin<span className="text-accent">.</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg border border-line bg-bg text-ink"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-panel border-r border-line flex flex-col z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-line flex items-center justify-between">
          <Link href="/admin" className="font-extrabold text-xl tracking-tight">
            Faraz<span className="text-accent">.</span> Admin
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View public website"
            className="p-2 rounded-lg border border-line bg-bg text-mute hover:text-ink hover:border-accent transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? "bg-accent text-white font-semibold shadow-sm"
                    : "text-mute hover:bg-bg hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-white text-accent"
                        : "bg-accent text-white"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-line text-xs text-mute flex items-center justify-between">
          <span>Portfolio Studio v1.0</span>
          <span>Faraz Hassan</span>
        </div>
      </aside>
    </>
  );
}
