import { motion } from "framer-motion";
import { Chrome, Github, Linkedin, Facebook } from "lucide-react";

const Item = ({ angle, text, Icon }: { angle: number; text: string; Icon: any }) => {
  const r = 200; // radius
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotate(${angle}deg) translateX(${r}px) rotate(${-angle}deg)`,
      }}
    >
      <span className="inline-flex items-center gap-1 rounded-full border bg-white/80 px-3 py-1 text-xs shadow-sm backdrop-blur">
        <Icon className="h-3.5 w-3.5" /> {text}
      </span>
    </motion.div>
  );
};

export default function OrbitBadges() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
    >
      <Item angle={15} text="Google" Icon={Chrome} />
      <Item angle={100} text="GitHub" Icon={Github} />
      <Item angle={195} text="LinkedIn" Icon={Linkedin} />
      <Item angle={280} text="Facebook" Icon={Facebook} />
    </motion.div>
  );
}
