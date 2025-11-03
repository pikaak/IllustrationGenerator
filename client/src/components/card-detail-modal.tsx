import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { TarotCard } from "@shared/schema";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TarotCard;
}

export function CardDetailModal({ isOpen, onClose, card }: CardDetailModalProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = card.imageUrl;
    link.download = `${card.name.replace(/\s+/g, '_')}_tarot_card.png`;
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 max-h-[90vh]">
          {/* Image Column */}
          <div className="relative bg-muted/30">
            <div className="aspect-[2/3] md:min-h-[600px] flex items-center justify-center p-6">
              <img
                src={card.imageUrl}
                alt={`${card.name} tarot card`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                data-testid="img-modal-card"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 pb-4 space-y-4">
              <DialogTitle className="font-display text-3xl">
                {card.name}
              </DialogTitle>
              {card.keywords && (
                <div className="flex flex-wrap gap-2">
                  {card.keywords.split(',').map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              <Separator />
            </DialogHeader>

            <ScrollArea className="flex-1 px-8">
              <div className="space-y-6 pb-6">
                {card.uprightMeaning && (
                  <div className="space-y-2">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                      Upright Meaning
                    </h4>
                    <p className="text-sm text-foreground/90 font-serif leading-relaxed">
                      {card.uprightMeaning}
                    </p>
                  </div>
                )}

                {card.reversedMeaning && (
                  <div className="space-y-2">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                      Reversed Meaning
                    </h4>
                    <p className="text-sm text-foreground/90 font-serif leading-relaxed">
                      {card.reversedMeaning}
                    </p>
                  </div>
                )}

                {card.symbolism && (
                  <div className="space-y-2">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Symbolism
                    </h4>
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                      {card.symbolism}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Generation Details
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans bg-muted/50 p-3 rounded-md">
                    {card.prompt}
                  </p>
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-3 p-8 pt-4 border-t">
              <Button
                onClick={handleDownload}
                className="flex-1 gap-2"
                size="lg"
                data-testid="button-download-modal"
              >
                <Download className="h-5 w-5" />
                Download Card
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size="lg"
                data-testid="button-close-modal"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
