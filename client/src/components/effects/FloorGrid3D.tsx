import { useReducedMotion } from "framer-motion";

export default function FloorGrid3D() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none relative mx-auto mt-1 max-w-5xl px-6">
      <div className="relative h-[clamp(64px,10vw,88px)] w-full [perspective:1500px]">
        <div
          className="
            absolute inset-x-0 bottom-0 h-[clamp(120px,18vw,160px)] rounded-[28px]
            border bg-white/50 shadow-sm backdrop-blur
            [transform:rotateX(60deg)_translateZ(-50px)]
            [transform-origin:bottom_center]
            overflow-hidden
          "
        >
          <div
            className={`
              absolute inset-0 opacity-70
              [background:repeating-linear-gradient(0deg,rgba(99,102,241,0.12)_0_1px,transparent_1px_24px),
                          repeating-linear-gradient(90deg,rgba(99,102,241,0.12)_0_1px,transparent_1px_24px)]
              ${reduceMotion ? "" : "animate-[gridMove_12s_linear_infinite]"}
            `}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
