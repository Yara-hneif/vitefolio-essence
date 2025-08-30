import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  maxTilt?: number;      // degrees
  glare?: boolean;       // show moving light
  radius?: number;       // px for glare radius
  className?: string;
}>;

export default function Tilt3D({ children, maxTilt = 10, glare = true, radius = 220, className }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rx = useTransform(y, [ -0.5, 0.5 ], [ maxTilt, -maxTilt ]);
  const ry = useTransform(x, [ -0.5, 0.5 ], [ -maxTilt, maxTilt ]);

  // smooth
  const srx = useSpring(rx, { stiffness: 160, damping: 20 });
  const sry = useSpring(ry, { stiffness: 160, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px); y.set(py);
    (e.currentTarget as HTMLElement).style.setProperty("--px", `${e.clientX - rect.left}px`);
    (e.currentTarget as HTMLElement).style.setProperty("--py", `${e.clientY - rect.top}px`);
  }

  function reset() { x.set(0); y.set(0); }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ perspective: 1200 }}
      className={`[transform-style:preserve-3d] ${className ?? ""}`}
    >
      <motion.div
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
        }}
        className="relative will-change-transform"
      >
        {children}

        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                `radial-gradient(${radius}px ${radius}px at var(--px,50%) var(--py,50%), rgba(255,255,255,0.35), transparent 60%)`,
              transform: "translateZ(40px)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
