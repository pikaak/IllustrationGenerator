import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  imageUrl: string;
}

export function CardDetailModal({ isOpen, onClose, cardName, imageUrl }: CardDetailModalProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${cardName.replace(/\s+/g, '_')}_tarot_card.png`;
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Column */}
          <div className="relative bg-muted/30">
            <div className="aspect-[2/3] md:min-h-[600px] flex items-center justify-center p-6">
              <img
                src={imageUrl}
                alt={`${cardName} tarot card`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                data-testid="img-modal-card"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="p-8 flex flex-col">
            <DialogHeader className="space-y-4">
              <DialogTitle className="font-display text-3xl">
                {cardName}
              </DialogTitle>
              <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"></div>
            </DialogHeader>

            <div className="flex-1 py-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Information
                </h4>
                <p className="text-sm text-muted-foreground font-serif">
                  This mystical tarot card features a feline interpretation of {cardName}, 
                  rendered with ornate borders and ethereal atmosphere through AI generation.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Generation Prompt
                </h4>
                <p className="text-sm text-muted-foreground font-sans bg-muted/50 p-4 rounded-lg">
                  Mystical cat-themed tarot card illustrations for {cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
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
