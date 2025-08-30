import { Github, ShieldCheck, Globe, Chrome, Linkedin, Facebook } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="rounded-2xl border bg-white/70 p-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          {/* OAuth providers */}
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <Chrome className="h-4 w-4" /> Google
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <Github className="h-4 w-4" /> GitHub
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <Facebook className="h-4 w-4" /> Facebook
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </span>

          {/* Privacy / Open source / Global */}
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Privacy-first
          </span>
          <a
            href="https://github.com/Yara-hneif/vitefolio-essence"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 hover:underline"
          >
            <Github className="h-4 w-4" /> Open source
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
            <Globe className="h-4 w-4" /> Shareable URL
          </span>
        </div>
      </div>
    </div>
  );
}
