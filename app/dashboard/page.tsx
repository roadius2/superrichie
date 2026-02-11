"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-shadow-glow">SuperRichie</h1>
          <div className="text-richie-green-light">⚡ ACTIVE</div>
        </div>

        {/* Welcome Message */}
        {success && showWelcome && (
          <div className="mb-8 border-2 border-richie-green p-6 border-glow animate-pulse">
            <h2 className="text-2xl font-bold mb-2">
              🎉 Welcome to SuperRichie!
            </h2>
            <p className="text-richie-green-light">
              You've successfully signed in. Let's build something awesome!
            </p>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-richie-green p-6">
            <h3 className="text-2xl font-bold mb-4">⚡ Quick Start</h3>
            <div className="space-y-3 text-richie-green-light">
              <div>$ superrichie init</div>
              <div>$ superrichie generate --component Button</div>
              <div>$ superrichie deploy</div>
            </div>
          </div>

          <div className="border-2 border-richie-green p-6">
            <h3 className="text-2xl font-bold mb-4">📊 Your Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-richie-green-light">Projects:</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-richie-green-light">Code Generated:</span>
                <span className="font-bold">0 lines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-richie-green-light">Time Saved:</span>
                <span className="font-bold">0 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all">
            <h4 className="text-xl font-bold mb-3">🚀 Generate</h4>
            <p className="text-richie-green-light mb-4">
              Create components, APIs, and full apps with AI
            </p>
            <button className="bg-richie-green text-richie-black px-4 py-2 font-bold">
              START
            </button>
          </div>

          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all">
            <h4 className="text-xl font-bold mb-3">🔧 Optimize</h4>
            <p className="text-richie-green-light mb-4">
              Refactor and improve existing code
            </p>
            <button className="bg-richie-green text-richie-black px-4 py-2 font-bold">
              OPTIMIZE
            </button>
          </div>

          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all">
            <h4 className="text-xl font-bold mb-3">📚 Learn</h4>
            <p className="text-richie-green-light mb-4">
              Understand and document your codebase
            </p>
            <button className="bg-richie-green text-richie-black px-4 py-2 font-bold">
              EXPLORE
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="mt-8 border-2 border-richie-green p-6 font-mono text-sm">
          <div className="text-richie-green-light mb-2">
            $ superrichie --status
          </div>
          <div className="space-y-1">
            <div>✓ Authentication: SUCCESS</div>
            <div>✓ AI Models: LOADED</div>
            <div>✓ Code Generator: READY</div>
            <div>✓ Awesome Level: MAXIMUM</div>
            <div className="mt-2 text-richie-green-light">
              $ _
              <span className="animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-richie-green">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
