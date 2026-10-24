"use client";

import { useState } from "react";
import { submitContactMessageAction } from "@/lib/actions";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      honeypot: formData.get("website"),
    };

    const res = await submitContactMessageAction(data);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      form.reset();
    }
  };

  return (
    <div style={{ marginTop: "48px", maxWidth: "600px" }}>
      <h3 style={{ fontSize: "24px", marginBottom: "16px" }}>Send a direct message</h3>
      {success ? (
        <div
          style={{
            padding: "20px",
            borderRadius: "14px",
            border: "1.5px solid #22B573",
            background: "var(--panel)",
            color: "#22B573",
            fontWeight: 600,
          }}
        >
          ✓ Thank you! Your message has been sent successfully. I will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          {error && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
                border: "1px solid #EF4444",
                fontSize: "14.5px",
              }}
            >
              {error}
            </div>
          )}

          {/* Honeypot field for bot detection */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label
              htmlFor="name"
              style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Faraz Hassan"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--ink)",
                font: "inherit",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}
            >
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="faraz@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--ink)",
                font: "inherit",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              placeholder="Tell me about your project or opportunity..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--ink)",
                font: "inherit",
                fontSize: "15px",
                outline: "none",
                resize: "vertical",
              }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn p"
            style={{ width: "fit-content", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Sending..." : "Submit message"} <span className="ar">→</span>
          </button>
        </form>
      )}
    </div>
  );
}
