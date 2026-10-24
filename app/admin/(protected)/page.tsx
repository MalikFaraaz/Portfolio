import { db } from "@/lib/db";
import Link from "next/link";
import {
  FolderGit2,
  Inbox,
  Cpu,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboard() {
  const [
    projectsCount,
    unreadCount,
    totalMessages,
    techCount,
    recentMessages,
  ] = await Promise.all([
    db.project.count(),
    db.message.count({ where: { read: false } }),
    db.message.count(),
    db.tech.count(),
    db.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studio Dashboard</h1>
          <p className="text-mute text-sm mt-1">
            Manage your live portfolio content, projects, and incoming client messages.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn p self-start"
          style={{ fontSize: "14px", padding: "10px 20px" }}
        >
          <span>View Live Site</span>
          <ExternalLink size={15} />
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/messages"
          className="bg-panel border border-line rounded-2xl p-6 hover:border-accent transition-all group"
        >
          <div className="flex items-center justify-between text-mute mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Unread Messages</span>
            <Inbox className="group-hover:text-accent transition-colors" size={20} />
          </div>
          <div className="text-3xl font-extrabold text-ink">{unreadCount}</div>
          <div className="text-xs text-mute mt-2 flex items-center gap-1">
            Total {totalMessages} messages received
            <ArrowUpRight size={13} />
          </div>
        </Link>

        <Link
          href="/admin/projects"
          className="bg-panel border border-line rounded-2xl p-6 hover:border-accent transition-all group"
        >
          <div className="flex items-center justify-between text-mute mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
            <FolderGit2 className="group-hover:text-accent transition-colors" size={20} />
          </div>
          <div className="text-3xl font-extrabold text-ink">{projectsCount}</div>
          <div className="text-xs text-mute mt-2 flex items-center gap-1">
            Manage & reorder portfolio work
            <ArrowUpRight size={13} />
          </div>
        </Link>

        <Link
          href="/admin/tech"
          className="bg-panel border border-line rounded-2xl p-6 hover:border-accent transition-all group"
        >
          <div className="flex items-center justify-between text-mute mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Tech Stack</span>
            <Cpu className="group-hover:text-accent transition-colors" size={20} />
          </div>
          <div className="text-3xl font-extrabold text-ink">{techCount}</div>
          <div className="text-xs text-mute mt-2 flex items-center gap-1">
            Marquee skills displayed
            <ArrowUpRight size={13} />
          </div>
        </Link>

        <Link
          href="/admin/hero"
          className="bg-panel border border-line rounded-2xl p-6 hover:border-accent transition-all group"
        >
          <div className="flex items-center justify-between text-mute mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Hero & Intro</span>
            <Sparkles className="group-hover:text-accent transition-colors" size={20} />
          </div>
          <div className="text-3xl font-extrabold text-ink">Active</div>
          <div className="text-xs text-mute mt-2 flex items-center gap-1">
            Live headline & terminal code
            <ArrowUpRight size={13} />
          </div>
        </Link>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-panel border border-line rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Quick Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link href="/admin/hero" className="btn text-center justify-center text-xs py-3">
            Edit Hero
          </Link>
          <Link href="/admin/about" className="btn text-center justify-center text-xs py-3">
            Edit About
          </Link>
          <Link href="/admin/projects/new" className="btn p text-center justify-center text-xs py-3">
            + New Project
          </Link>
          <Link href="/admin/process" className="btn text-center justify-center text-xs py-3">
            Edit Process
          </Link>
          <Link href="/admin/contact" className="btn text-center justify-center text-xs py-3">
            Edit Contact
          </Link>
          <Link href="/admin/settings" className="btn text-center justify-center text-xs py-3">
            Site Settings
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Inbox */}
      <div className="bg-panel border border-line rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Messages</h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-accent hover:underline">
            View all ({totalMessages})
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-10 text-mute text-sm">
            No inquiries received yet. Incoming contact form submissions will appear here.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{msg.name}</span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-accent inline-block" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-mute truncate mt-0.5">{msg.body}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-mute">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="btn"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
