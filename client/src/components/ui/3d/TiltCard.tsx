import { motion, useSpring } from "framer-motion";
import {useIsMobile} from "@/hooks/use-mobile";
import React from "react";

type Props = React.PropsWithChildren<{
  rotate?: number;
  scale?: number;
  glare?: boolean;
  className?: string;
  disableOnMobile?: boolean;
}>;

export default function TiltCard({
  children,
  rotate = 8,
  scale = 1.01,
  glare = false,
  className = "",
  disableOnMobile = true,
}: Props) {
  const isMobile = useIsMobile();
  const [rx, setRx] = React.useState(0);
  const [ry, setRy] = React.useState(0);

  const srx = useSpring(rx, { stiffness: 160, damping: 20 });
  const sry = useSpring(ry, { stiffness: 160, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setRx(-py * rotate);
    setRy(px * rotate);
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  }

  function reset() {
    setRx(0);
    setRy(0);
  }

  const interactive = !(disableOnMobile && isMobile);

  return (
    <div
      className={`rounded-2xl border bg-white/70 shadow-sm backdrop-blur ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={interactive ? reset : undefined}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX: interactive ? (srx as any) : 0,
          rotateY: interactive ? (sry as any) : 0,
          scale: interactive ? scale : 1,
        }}
        className="relative"
      >
        {children}

        {glare && interactive && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                `radial-gradient(220px 220px at var(--px,50%) var(--py,50%), rgba(255,255,255,0.35), transparent 60%)`,
              transform: "translateZ(40px)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
