import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background glow for the White/Yellow theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_8px_32px_rgba(255,193,7,0.3)] mb-8 relative z-10"
      >
        <Truck className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
      </motion.div>

      {/* Hero Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-[28px] font-bold text-foreground leading-tight mb-2">
          KOODAI <span className="text-primary">DELIVERY</span>
        </h1>
        <p className="text-[15px] font-medium text-muted-foreground">
          Join the fleet. Deliver happiness.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm space-y-4 relative z-10"
      >
        <button
          onClick={() => navigate("/login")}
          className="w-full btn-yellow py-4 text-[16px]"
        >
          Login
        </button>

        <div className="flex items-center my-4 opacity-60">
          <div className="flex-1 border-t border-border" />
          <span className="mx-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">OR</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <button
          onClick={() => navigate("/onboarding/step-1")}
          className="w-full bg-card text-foreground border border-border hover:bg-muted active:scale-[0.98] transition-all font-bold py-4 rounded-2xl shadow-sm text-[16px]"
        >
          Register as Partner
        </button>
      </motion.div>
    </div>
  );
}
