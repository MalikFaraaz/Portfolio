"use client";

import { logoutAction } from "@/lib/actions";
import { LogOut, Globe, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminHeader({ email }: { email: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <header className="h-16 px-6 bg-panel border-b border-line flex items-center justify-between sticky top-0 z-30">
      <div className="text-sm font-medium text-mute hidden sm:block">
        Signed in as <b className="text-ink">{email}</b>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          title="Toggle light/dark theme"
          className="p-2 rounded-xl border border-line bg-bg text-mute hover:text-ink hover:border-accent transition-colors"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ padding: "8px 16px", fontSize: "13.5px" }}
        >
          <Globe size={15} />
          <span>View Site</span>
        </a>

        <form action={logoutAction}>
          <button
            type="submit"
            className="btn"
            style={{
              padding: "8px 16px",
              fontSize: "13.5px",
              color: "#EF4444",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
