import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/navigation/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Hero({ onPrimary }: { onPrimary: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative flex items-center overflow-hidden min-h-[min(92vh,900px)]">
      {/* Subtle background grid */}
      <div aria-hidden className="absolute inset-0 opacity-[0.06]">
        <div className="w-full h-full bg-[linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px),linear-gradient(180deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Parallax glows (disabled when reduced motion) */}
      {!prefersReduced && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute w-80 h-80 bg-gradient-to-r from-primary/25 to-secondary/25 rounded-full blur-3xl opacity-30 left-[8%] top-[12%]" />
          <div className="absolute w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-2xl opacity-25 right-[6%] bottom-[12%]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1100px] text-center px-[clamp(16px,4vw,28px)]">
        <span className="inline-flex items-center mb-6 rounded-full border px-3 py-1 text-sm text-primary bg-background/70 backdrop-blur">
          <Sparkles className="w-4 h-4 mr-2" aria-hidden /> Next-Gen Portfolio Platform
        </span>

        <h1 className="font-extrabold leading-[1.05] tracking-tight text-[clamp(2.25rem,7vw,5rem)]">
          Build a <span className="text-primary">beautiful</span> portfolio in minutes
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-[clamp(1rem,1.8vw,1.125rem)] text-muted-foreground">
          Sign in and personalize a fast, accessible portfolio—no clutter, just clean components.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="px-8" onClick={onPrimary}>
            Try Demo <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
          </Button>
          <Button size="lg" variant="outline" className="px-8" onClick={onPrimary}>
            Explore Templates
          </Button>
        </div>
      </div>
    </section>
  );
}
