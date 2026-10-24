"use client";

import { useState, useEffect } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on Esc key or resize > 900px
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav>
      <div className="w">
        <a className="logo" href="#top" onClick={handleLinkClick}>
          Faraz<i>.</i>
        </a>

        {/* Desktop Menu */}
        <div className="menu">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">
          <a className="btn p nav-cta" href="#contact" onClick={handleLinkClick}>
            Hire me
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`nav-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mob-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mob-drawer-inner">
          <a href="#about" onClick={handleLinkClick}>
            About
          </a>
          <a href="#work" onClick={handleLinkClick}>
            Work
          </a>
          <a href="#process" onClick={handleLinkClick}>
            Process
          </a>
          <a href="#contact" onClick={handleLinkClick}>
            Contact
          </a>
          <a className="btn p mob-cta" href="#contact" onClick={handleLinkClick}>
            Hire me <span className="ar">→</span>
          </a>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="mob-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
