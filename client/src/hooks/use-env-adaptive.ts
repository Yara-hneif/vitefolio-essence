import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useReducedMotion } from "framer-motion";

export const BREAKPOINTS = {
  mobileMax: 767.98,
  tabletMax: 1023.98,
};

const qMobile = `(max-width: ${BREAKPOINTS.mobileMax}px)`;
const qTablet = `(min-width: ${BREAKPOINTS.mobileMax + 0.02}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`;
const qDesktop = `(min-width: ${BREAKPOINTS.tabletMax + 0.02}px)`;
const qPortrait = "(orientation: portrait)";
const qHover = "(hover: hover)";
const qPointerCoarse = "(pointer: coarse)";

export function useEnvAdaptive() {
  const isMobile = useMediaQuery(qMobile, { initializeWithValue: false });
  const isTablet = useMediaQuery(qTablet, { initializeWithValue: false });
  const isDesktop = useMediaQuery(qDesktop, { initializeWithValue: false });
  const isPortrait = useMediaQuery(qPortrait, { initializeWithValue: false });
  const canHover = useMediaQuery(qHover, { initializeWithValue: false });
  const pointerCoarse = useMediaQuery(qPointerCoarse, { initializeWithValue: false });
  const reduceMotion = useReducedMotion();

  const [vw, setVw] = useState<number | null>(null);
  const [vh, setVh] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const updateNow = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateNow);
    };
    updateNow();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const isTouch = pointerCoarse || !canHover;
  const device = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return {
    // breakpoints
    isMobile,
    isTablet,
    isDesktop,
    // device/context
    isPortrait,
    canHover,
    pointerCoarse,
    isTouch,
    reduceMotion,
    // viewport
    vw,
    vh,
    // derived
    device,
    // helpers
    bp: BREAKPOINTS,
  };
}
