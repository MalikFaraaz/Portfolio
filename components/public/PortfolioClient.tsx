"use client";

import { useEffect } from "react";

interface PortfolioClientProps {
  roles: string[];
  heroCodeSnippet: string;
}

export function PortfolioClient({ roles, heroCodeSnippet }: PortfolioClientProps) {
  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Typing roles
    const roleEl = document.getElementById("role");
    if (roleEl && roles.length > 0) {
      if (RM) {
        roleEl.textContent = roles[0];
      } else {
        let ri = 0;
        let ci = 0;
        let del = false;
        let timeoutId: NodeJS.Timeout;

        const tick = () => {
          const r = roles[ri];
          ci += del ? -1 : 1;
          roleEl.textContent = r.slice(0, ci);
          let d = del ? 35 : 75;
          if (!del && ci === r.length) {
            del = true;
            d = 1400;
          } else if (del && ci === 0) {
            del = false;
            ri = (ri + 1) % roles.length;
            d = 350;
          }
          timeoutId = setTimeout(tick, d);
        };
        tick();

        return () => clearTimeout(timeoutId);
      }
    }
  }, [roles]);

  useEffect(() => {
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Typing code card in hero
    const pre = document.getElementById("code");
    if (pre && heroCodeSnippet) {
      if (RM) {
        pre.innerHTML = heroCodeSnippet;
      } else {
        let i = 0;
        let out = "";
        let timeoutId: NodeJS.Timeout;

        const type = () => {
          if (i >= heroCodeSnippet.length) return;
          if (heroCodeSnippet[i] === "<") {
            const j = heroCodeSnippet.indexOf(">", i);
            out += heroCodeSnippet.slice(i, j + 1);
            i = j + 1;
          } else if (heroCodeSnippet[i] === "&") {
            const k = heroCodeSnippet.indexOf(";", i);
            out += heroCodeSnippet.slice(i, k + 1);
            i = k + 1;
          } else {
            out += heroCodeSnippet[i++];
          }
          pre.innerHTML = out;
          timeoutId = setTimeout(type, 18);
        };
        type();

        return () => clearTimeout(timeoutId);
      }
    }
  }, [heroCodeSnippet]);

  useEffect(() => {
    // 3. Scroll reveal observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealNodes = document.querySelectorAll(".rv");
    revealNodes.forEach((n, i) => {
      (n as HTMLElement).style.transitionDelay = (i % 3) * 90 + "ms";
      io.observe(n);
    });

    // 4. Count-up animation observer
    const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          const target = e.target as HTMLElement;
          const n = +(target.dataset.n || 0);
          const s = target.dataset.s || "";
          if (RM) {
            target.textContent = n + s;
            return;
          }
          const st = performance.now();
          const f = (t: number) => {
            const p = Math.min((t - st) / 1400, 1);
            target.textContent =
              Math.round(n * (1 - Math.pow(1 - p, 3))) + (p < 1 ? "" : s);
            if (p < 1) requestAnimationFrame(f);
          };
          requestAnimationFrame(f);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-n]").forEach((n) => cio.observe(n));

    // 5. Scroll progress bar
    const bar = document.getElementById("bar");
    const handleScroll = () => {
      if (!bar) return;
      const h = document.documentElement;
      const progress = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = "scaleX(" + Math.min(Math.max(progress, 0), 1) + ")";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      io.disconnect();
      cio.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
