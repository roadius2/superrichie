"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "🎉 Magic link sent! Check your email to complete signup."
        );
        setEmail("");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-5xl font-bold text-shadow-glow mb-2 cursor-pointer hover:text-richie-green-light transition-colors">
              SuperRichie
            </h1>
          </Link>
          <p className="text-richie-green-light">
            Sign up with your email - no password required
          </p>
        </div>

        <div className="border-2 border-richie-green p-8 border-glow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            &gt; INITIALIZE_USER_SESSION
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                EMAIL_ADDRESS:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@awesome.dev"
                className="w-full bg-richie-black border-2 border-richie-green px-4 py-3 text-richie-green focus:border-glow outline-none placeholder-richie-green-dark"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-richie-green text-richie-black px-6 py-4 text-lg font-bold hover:bg-richie-green-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SENDING MAGIC LINK..." : "SEND MAGIC LINK →"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-4 border-2 border-richie-green bg-richie-black">
              <p className="text-richie-green-light">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 border-2 border-red-500 bg-richie-black">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="text-center text-sm space-y-2">
          <p className="text-richie-green-light">
            We'll send you a magic link to sign in instantly
          </p>
          <p className="text-richie-green-dark">
            <Link href="/" className="hover:text-richie-green transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>

        <div className="border-2 border-richie-green p-4 font-mono text-xs">
          <div className="text-richie-green-light">$ auth.status</div>
          <div className="mt-1">
            {loading ? "⏳ Processing..." : "⚡ Ready for authentication"}
          </div>
        </div>
      </div>
    </div>
  );
}
