import { Sparkles, Star, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGenerateClick: () => void;
}

export function HeroSection({ onGenerateClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Mystical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-pulse opacity-30">
          <Star className="h-6 w-6 text-chart-1" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse opacity-20 animation-delay-1000">
          <Sparkles className="h-8 w-8 text-chart-2" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-pulse opacity-25 animation-delay-2000">
          <Moon className="h-10 w-10 text-chart-3" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse opacity-20 animation-delay-3000">
          <Star className="h-5 w-5 text-chart-4" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse opacity-30 animation-delay-1500">
          <Sparkles className="h-6 w-6 text-chart-1" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Ornate decorative top border */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <Star className="h-4 w-4 text-primary" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>

        {/* Main heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold gradient-text-mystical leading-tight">
          Mystical Cat Tarot Generator
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
          Unveil the mysteries through AI-crafted feline divination
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={onGenerateClick}
            size="lg"
            className="px-8 py-6 text-lg font-display group"
            data-testid="button-generate-cards"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Generate Your Cards
          </Button>
        </div>

        {/* Trust indicator */}
        <p className="text-sm text-muted-foreground/80 font-sans uppercase tracking-wider pt-4">
          Powered by AI • 16 Major Arcana Cards
        </p>

        {/* Ornate decorative bottom border */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <Moon className="h-4 w-4 text-primary" />
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
