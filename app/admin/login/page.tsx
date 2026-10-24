"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const res = await loginAction(formData);
      return res || null;
    },
    null
  );

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel border border-line rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-bg border border-line text-accent mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-mute text-sm mt-1">Sign in to manage your portfolio</p>
        </div>

        {state?.error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mute mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" size={17} />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="faraz.hassan@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mute mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" size={17} />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-bg text-ink text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn p justify-center font-semibold"
            style={{ opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? "Signing in..." : "Sign in to Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-line text-center text-xs text-mute">
          <a href="/" className="hover:text-accent transition-colors">
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}
