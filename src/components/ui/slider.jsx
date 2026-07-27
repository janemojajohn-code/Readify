import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, min = 0, max = 100, step = 1, value, onValueChange, ...props }, ref) => {
  const currentValue = Array.isArray(value) ? value[0] : value || 0;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onValueChange) {
      onValueChange(Array.isArray(value) ? [val] : val);
    }
  };

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full h-2 rounded-lg appearance-none bg-secondary cursor-pointer accent-primary focus:outline-none"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%)`
        }}
        {...props}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
