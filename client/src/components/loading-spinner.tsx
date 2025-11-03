import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );
}

export function MysticalSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20"></div>
        <div className="relative animate-spin rounded-full border-4 border-transparent border-t-primary h-16 w-16"></div>
        <div className="absolute inset-2 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-transparent border-t-chart-2"></div>
      </div>
      <p className="text-sm text-muted-foreground font-serif italic">Channeling mystical energies...</p>
    </div>
  );
}
