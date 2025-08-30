import { useEffect, useState, Suspense, lazy, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Globe, Palette, Users, Zap,
  Github, Linkedin, Mail, Facebook,
  Star, CheckCircle, Sparkles, Layers, Rocket, Monitor,
  Code, Paintbrush, Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/features/auth/AuthProvider";
import AuthDialog from "@/features/auth/AuthDialog";

import MarketingHeader from "@/components/layout/LandingPage/LandingHeader";
import MarketingFooter from "@/components/layout/LandingPage/LandingFooter";
import StackPreview3D from "@/components/layout/LandingPage/3d/StackPreview3D";
import TiltCard from "@/components/layout/LandingPage/3d/TiltCard";
import FloorGrid3D from "@/components/effects/FloorGrid3D";
import TrustBar from "@/components/layout/LandingPage/3d/TrustBar";

import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "framer-motion";

const TemplatePreview = lazy(() => import("@/components/layout/LandingPage/TemplatePreview"));
const OrbitBadges = lazy(() => import("@/components/layout/LandingPage/3d/OrbitBadges"));

export default function Landing() {
  const { user, getHandle } = useAuth();
  const nav = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (user) {
      const h = getHandle();
      if (h) nav(`/@${h}`, { replace: true });
    }
  }, [user, getHandle, nav]);

  useEffect(() => {
    if (isMobile || reduceMotion) return;

    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, reduceMotion]);

  const features = [
    { icon: <Globe className="h-7 w-7" />, title: "Create Unique Portfolio", desc: "Build your distinctive site in minutes with professional templates & advanced customization.", color: "from-blue-500 to-cyan-400" },
    { icon: <Palette className="h-7 w-7" />, title: "Complete Customization", desc: "Tweak design, colors, and fonts to reflect your identity.", color: "from-purple-500 to-pink-400" },
    { icon: <Users className="h-7 w-7" />, title: "Project Collaboration", desc: "Connect projects with teammates and showcase teamwork.", color: "from-green-500 to-emerald-400" },
    { icon: <Zap className="h-7 w-7" />, title: "Quick Connect", desc: "Auto-import profile data from GitHub, LinkedIn & more.", color: "from-orange-500 to-yellow-400" },
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "50K+", label: "Portfolios Created", icon: <TrophyIcon /> },
    { number: "99%", label: "Satisfaction Rate", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Support", icon: <Rocket className="h-6 w-6" /> },
  ];

  const portfolioTypes = [
    { icon: <Code className="h-8 w-8" />, title: "Developer Portfolio", description: "Showcase your coding projects and technical skills" },
    { icon: <Paintbrush className="h-8 w-8" />, title: "Designer Portfolio", description: "Display your creative work and design process" },
    { icon: <Share className="h-8 w-8" />, title: "Business Portfolio", description: "Professional presentation for entrepreneurs" },
  ];

  const parallax = useMemo(() => {
    if (isMobile || reduceMotion) return { p1: "translate(0px,0px)", p2: "translate(0px,0px)", p3: "translate(0px,0px)", grid: "translate(0px,0px)" };
    return {
      p1: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
      p2: `translate(${mouse.x * -0.01}px, ${mouse.y * -0.01}px)`,
      p3: `translate(${mouse.x * 0.015}px, ${mouse.y * 0.015}px)`,
      grid: `translate(${scrollY * 0.10}px, ${scrollY * 0.05}px)`,
    };
  }, [mouse, scrollY, isMobile, reduceMotion]);

  return (
    <>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-10 -left-32 h-[520px] w-[420px] -rotate-6 rounded-full bg-gradient-to-b from-violet-200 to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-0 -right-28 h-[520px] w-[420px] rotate-6 rounded-full bg-gradient-to-t from-indigo-200 to-transparent blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />
      </div>

      <MarketingHeader onOpenAuth={() => setAuthOpen(true)} />

      <main className="container mx-auto max-w-screen-2xl px-[clamp(16px,4vw,32px)] overflow-x-hidden">
        {/* HERO */}
        <section className="relative min-h-[min(82vh,780px)] flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
          {/* Hero Badge */}
          <div className="flex items-center justify-center mt-2 sm:mt-0 mb-2 animate-fade-in">
            <Badge variant="secondary" className="text-primary font-semibold px-4 py-2 shimmer">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Portfolio Platform
            </Badge>
          </div>

          {/* Headline & Subtext */}
          <h1 className="font-extrabold tracking-tight text-[clamp(2.5rem,7vw,6rem)] leading-tight mb-2 animate-scale-in">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              VitePortfolio
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-muted-foreground leading-relaxed">
            Craft stunning portfolios with{" "}
            <span className="font-semibold text-primary">smart setup</span>,{" "}
            <span className="font-semibold text-accent">elegant 3D</span>, and{" "}
            <span className="font-semibold text-primary">seamless integrations</span>.
          </p>

          {/* 3D Preview (smaller to fit above the fold) */}
          <div className="mt-0 mb-4 w-full max-w-2xl mx-auto">
            <StackPreview3D className="scale-[0.90] sm:scale-[0.95] lg:scale-100 origin-top" />
          </div>

          {/* CTA Buttons */}
          <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
              onClick={() => nav("/register")}
            >
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6"
              onClick={() => nav("/demo")}
            >
              <Monitor className="mr-2 h-5 w-5" /> View Demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-4 mb-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> Free Forever
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> No Credit Card
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> Live in Minutes
            </span>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section-padding relative rounded-3xl bg-muted/30 mt-8">
          <div className="relative z-10 mx-auto text-center mb-10 max-w-2xl">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-primary border-primary/20">
              <Layers className="w-4 h-4 mr-2" />
              Advanced Features
            </Badge>
            <h2 className="text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold">Why Choose VitePortfolio?</h2>
            <p className="mt-2 text-muted-foreground">Next-gen creation with intuitive tools.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto">
            {features.map((f, i) => (
              <TiltCard key={i} className="rounded-2xl p-6 text-center">
                <div className={`mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="section-padding">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold">See a Live Template</h2>
            <p className="mt-2 text-muted-foreground">Preview a starter you can personalize.</p>
          </div>

          <div className="relative mt-8">
            <TiltCard className="mx-auto max-w-3xl" rotate={14} scale={1.02} glare disableOnMobile>
              <div className="p-3 sm:p-6">
                <Suspense fallback={<div className="h-[360px] rounded-2xl border bg-white/60" />}>
                  <TemplatePreview />
                </Suspense>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section-padding bg-muted/30 rounded-3xl">
          <div className="text-center mx-auto max-w-3xl">
            <h2 className="text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold mb-2">Loved by Professionals Worldwide</h2>
            <p className="text-muted-foreground">Real reviews from satisfied users.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {["Ahmed Johnson", "Sarah Wilson", "Michael Chen"].map((name, idx) => (
              <Card key={idx} className="p-6 text-center rounded-2xl shadow-md">
                <CardContent>
                  <div className="mb-3 flex justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground mb-6">
                    “Auto-sync and templates made my site look pro in no time.”
                  </p>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">Professional User</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="section-padding text-center">
          <div className="mx-auto max-w-[1100px] rounded-3xl border bg-gradient-to-r from-primary to-accent p-[1px]">
            <div className="rounded-3xl bg-white p-8 sm:p-12">
              <h2 className="text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold">Ready to Stand Out?</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Join thousands who built standout portfolios with VitePortfolio.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 hover-lift" onClick={() => nav("/register")}>
                  Create My Portfolio <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 hover-lift"
                  onClick={() => nav("/demo")}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );

}

function TrophyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="h-6 w-6">
      <path fill="currentColor" d="M7 4h10v3a5 5 0 0 1-4 4.9V14h3v2H8v-2h3v-2.1A5 5 0 0 1 7 7V4Zm-2 1H3a4 4 0 0 0 4 4V8A3 3 0 0 1 5 5Zm16 0h-2a3 3 0 0 1-2 3v1a4 4 0 0 0 4-4Z" />
    </svg>
  );
}
