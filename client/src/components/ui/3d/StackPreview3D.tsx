import Tilt3D from "@/components/ui/3d/Tilt3D";
import { useIsMobile } from "@/hooks/use-mobile";

export default function StackPreview3D({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();

  return (
    <Tilt3D className={`group ${className}`}>
      {/* container height becomes fluid */}
      <div className="relative h-[clamp(220px,40vw,340px)]">
        {/* background glow */}
        <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-r from-violet-200/40 to-violet-200/40 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[clamp(110px,18vw,160px)] w-[clamp(200px,40vw,340px)] -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-2xl border bg-white/70 shadow-lg backdrop-blur [transform:translateZ(10px)]" />

        <div
          className="absolute left-1/2 top-1/2 rounded-2xl border bg-white shadow-xl p-[clamp(12px,2vw,20px)] gpu-text-fix"
          style={{
            height: "clamp(200px,36vw,260px)",
            width: "min(92vw, 420px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="h-[clamp(32px,5vw,40px)] w-[clamp(32px,5vw,40px)] rounded-full bg-gradient-to-br from-violet-200 to-violet-700" />
            <div>
              <div className="font-semibold leading-tight text-[clamp(0.875rem,1.6vw,1rem)]">
                Your Name
              </div>
              <div className="text-[clamp(0.625rem,1.2vw,0.75rem)] text-muted-foreground leading-snug">
                Full-Stack • React • Node
              </div>
            </div>
          </div>

          {/* Preview projects */}
          <div className="mt-3 grid grid-cols-3 gap-[clamp(8px,1.4vw,12px)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border p-[clamp(8px,1.6vw,12px)]">
                <div className="h-[clamp(44px,8vw,56px)] rounded-lg bg-gradient-to-br from-indigo-100 via-accent to-violet-300 bg-[length:100%_auto] animate-[shine_3s_linear_infinite]" />
                <div className="mt-2 h-[10px] w-[clamp(60px,22vw,80px)] max-w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}
