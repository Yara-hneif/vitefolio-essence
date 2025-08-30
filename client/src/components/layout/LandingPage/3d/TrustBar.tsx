import { Github, ShieldCheck, Globe, Chrome, Linkedin, Facebook } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
      <div className="rounded-2xl border bg-white/70 p-3 backdrop-blur">
        <div className="no-scrollbar flex snap-x items-center gap-2 overflow-x-auto sm:justify-center sm:gap-3">
          {[
            { icon: Chrome, label: "Google" },
            { icon: Github, label: "GitHub" },
            { icon: Facebook, label: "Facebook" },
            { icon: Linkedin, label: "LinkedIn" },
            { icon: ShieldCheck, label: "Privacy-first" },
            { icon: Github, label: "Open source", link: "https://github.com/Yara-hneif/vitefolio-essence" },
            { icon: Globe, label: "Shareable URL" },
          ].map(({ icon: Icon, label, link }, i) => {
            const Comp = (
              <span className="inline-flex snap-start items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs sm:text-sm">
                <Icon className="h-4 w-4" /> {label}
              </span>
            );
            return link ? (
              <a key={i} href={link} target="_blank" rel="noreferrer" className="hover:underline">
                {Comp}
              </a>
            ) : (
              <div key={i}>{Comp}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
