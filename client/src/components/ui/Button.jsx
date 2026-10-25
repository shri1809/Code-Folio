import { useState, forwardRef } from "react";

/**
 * Standardized CodeFolio Button component with:
 * - Restored HabitForge-inspired tactile spring overshoot micro-interactions (cubic-bezier spring feedback)
 * - Restored punchy active spring physics scale (0.91 / 0.94 / 0.95)
 * - Restored hover scale (1.02) and vibrant brand blue (#0c1df2) glow and shadow elevation
 * - Restored specular sheen sweep on hover (via-white/[0.18])
 * - Restored dynamic cursor-centered radial click ripple effect (opacity 0.55, diameter * 2.2)
 * - Preserved full accessibility compliance (focus-visible ring, aria-busy, aria-disabled)
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    ripple = true,
    rippleColor,
    onClick,
    type = "button",
    ...props
  },
  ref
) {
  const [ripples, setRipples] = useState([]);

  const handlePointerDown = (e) => {
    if (disabled || loading || !ripple) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: diameter,
    };

    setRipples((prev) => [...prev.slice(-2), newRipple]);
  };

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#0c1df2] to-[#2535f5] hover:from-[#1b2bf5] hover:to-[#3848f7] text-white font-bold shadow-[0_0_25px_rgba(12,29,242,0.45),inset_0_1px_0_0_rgba(255,255,255,0.35)] hover:shadow-[0_0_30px_rgba(12,29,242,0.65),inset_0_1px_0_0_rgba(255,255,255,0.45)] border border-white/20",
    cyber:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_28px_rgba(6,182,212,0.6)] border border-cyan-400/40",
    glass:
      "bg-slate-900/70 hover:bg-slate-800/80 text-slate-200 hover:text-white backdrop-blur-md border border-white/10 hover:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),0_0_15px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
    secondary:
      "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
    danger:
      "bg-red-600/90 hover:bg-red-500 text-white font-bold border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.35)] hover:shadow-[0_0_22px_rgba(239,68,68,0.55)]",
    destructive:
      "bg-red-600/90 hover:bg-red-500 text-white font-bold border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.35)] hover:shadow-[0_0_22px_rgba(239,68,68,0.55)]",
    ghost:
      "bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent",
    outline:
      "bg-transparent hover:bg-white/[0.05] text-slate-300 hover:text-white border border-white/15 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
    default: "",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
    md: "h-10 px-4 text-sm rounded-xl gap-2",
    lg: "h-11 px-6 text-sm sm:text-base rounded-xl font-semibold gap-2.5",
    icon: "h-9 w-9 p-0 rounded-xl",
    none: "",
  };

  const springScale =
    size === "icon"
      ? "active:scale-[0.91]"
      : size === "sm"
      ? "active:scale-[0.94]"
      : "active:scale-[0.95]";

  const defaultRippleColor =
    rippleColor ||
    (variant === "primary"
      ? "rgba(255, 255, 255, 0.45)"
      : variant === "cyber"
      ? "rgba(0, 0, 0, 0.3)"
      : variant === "danger" || variant === "destructive"
      ? "rgba(255, 255, 255, 0.4)"
      : "rgba(255, 255, 255, 0.22)");

  const hasPosition = /\b(absolute|fixed|sticky|static)\b/.test(className);

  const computedClass = [
    "group overflow-hidden inline-flex items-center justify-center font-medium select-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c1df2] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    hasPosition ? "" : "relative",
    !disabled && !loading ? "hover:scale-[1.02] active:translate-y-0 cursor-pointer" : "",
    !disabled && !loading ? springScale : "",
    variantStyles[variant] || "",
    sizeStyles[size] || "",
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    loading ? "cursor-wait opacity-80" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      aria-disabled={disabled ? "true" : undefined}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={computedClass}
      {...props}
    >
      {/* Specular sheen sweep on hover (refined specular polish) */}
      {!disabled && !loading && (
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/[0.18] to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Dynamic radial click ripple wave */}
      {ripple && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
          aria-hidden="true"
        >
          {ripples.map((r) => (
            <span
              key={r.id}
              onAnimationEnd={() => removeRipple(r.id)}
              className="animate-ripple"
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
                borderRadius: "9999px",
                backgroundColor: defaultRippleColor,
                pointerEvents: "none",
              }}
            />
          ))}
        </span>
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
});

export default Button;
