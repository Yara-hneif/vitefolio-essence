import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function AppLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Logo with animation */}
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-xl"
      >
        VP
      </motion.div>

      {/* Spinner + message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col items-center gap-2"
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground text-sm">{message}</span>
      </motion.div>
    </div>
  );
}
