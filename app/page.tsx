"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "SuperRichie";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Animated Logo */}
        <div className="mb-12">
          <h1 className="text-7xl font-bold text-shadow-glow mb-4">
            {displayText}
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-2xl text-richie-green-light">
            NextGen Super Awesome Code Generator
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-richie-green-light">Generate code at the speed of thought</p>
          </div>
          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-richie-green-light">Advanced AI models at your fingertips</p>
          </div>
          <div className="border-2 border-richie-green p-6 hover:border-glow transition-all duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">NextGen Tech</h3>
            <p className="text-richie-green-light">Built for the future, available today</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <div className="border-2 border-richie-green p-8 border-glow">
            <h2 className="text-3xl font-bold mb-4">
              Ready to supercharge your coding?
            </h2>
            <p className="text-richie-green-light mb-6">
              Join thousands of developers using SuperRichie to build the future.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-richie-green text-richie-black px-8 py-4 text-xl font-bold hover:bg-richie-green-light transition-colors duration-300"
            >
              GET STARTED NOW →
            </Link>
          </div>

          <p className="text-sm text-richie-green-light">
            No credit card required • Magic link authentication • Free forever
          </p>
        </div>

        {/* Terminal-style Footer */}
        <div className="mt-16 text-left border-2 border-richie-green p-4 font-mono text-sm">
          <div className="text-richie-green-light mb-2">$ superrichie --version</div>
          <div>v1.0.0-nextgen</div>
          <div className="text-richie-green-light mt-2">
            $ superrichie --awesome
          </div>
          <div>✓ Awesome level: MAXIMUM</div>
        </div>
      </div>
    </div>
  );
}
