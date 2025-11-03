import { Star, Moon, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Decorative top border */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <Star className="h-3 w-3 text-primary/50" />
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Branding */}
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold gradient-text-mystical">
              Mystical Cat Tarot
            </h3>
            <p className="text-sm text-muted-foreground font-serif italic">
              Unveiling mysteries through AI-crafted feline divination
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Navigate
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="#generate"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Generate Cards
              </a>
              <a
                href="#gallery"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Credits */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Powered By
            </h4>
            <p className="text-sm text-muted-foreground">
              AI image generation via Gemini<br />
              16 Major Arcana interpretations
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground font-sans flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="h-3 w-3" />
            <span>© 2025 Mystical Cat Tarot Generator</span>
            <Moon className="h-3 w-3" />
            <span>Created with mystical intentions</span>
            <Star className="h-3 w-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
