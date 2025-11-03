import { TAROT_CARDS, type TarotCard } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Sparkles } from "lucide-react";

interface GallerySectionProps {
  generatedCards: Map<string, TarotCard>;
  onCardClick: (card: TarotCard) => void;
  onDownloadAll: () => void;
}

export function GallerySection({ generatedCards, onCardClick, onDownloadAll }: GallerySectionProps) {
  const generatedCount = generatedCards.size;
  const totalCount = TAROT_CARDS.length;

  if (generatedCount === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-muted/30" id="gallery">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 flex-wrap">
          <div className="space-y-2">
            <h2 className="font-display text-4xl md:text-5xl font-semibold">
              Your Collection
            </h2>
            <p className="text-lg text-muted-foreground font-serif" data-testid="text-card-count">
              {generatedCount} of {totalCount} cards generated
            </p>
          </div>

          {generatedCount > 0 && (
            <Button
              onClick={onDownloadAll}
              variant="outline"
              size="lg"
              className="gap-2"
              data-testid="button-download-all"
            >
              <Download className="h-5 w-5" />
              Download All
            </Button>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TAROT_CARDS.map((cardName) => {
            const card = generatedCards.get(cardName);
            
            if (!card) {
              return (
                <Card
                  key={cardName}
                  className="overflow-hidden border-2 border-dashed opacity-50"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[2/3] bg-muted/50 flex flex-col items-center justify-center gap-3 p-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                      <p className="font-display text-sm text-center text-muted-foreground">
                        {cardName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Not Generated
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card
                key={cardName}
                className="overflow-hidden border-2 shadow-xl cursor-pointer group hover-elevate transition-all duration-300 hover:shadow-2xl"
                onClick={() => onCardClick(card)}
                data-testid={`card-gallery-${cardName.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={card.imageUrl}
                      alt={`${cardName} tarot card`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Card name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-4 pt-8">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {cardName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
