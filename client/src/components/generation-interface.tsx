import { useState } from "react";
import { TAROT_CARDS, type TarotCardName } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { MysticalSpinner } from "./loading-spinner";

interface GenerationInterfaceProps {
  onGenerateCard: (cardName: TarotCardName) => Promise<void>;
  onGenerateAll: () => Promise<void>;
  selectedCard: TarotCardName | null;
  setSelectedCard: (card: TarotCardName | null) => void;
  isGenerating: boolean;
  generatedCards: Map<string, string>;
}

export function GenerationInterface({
  onGenerateCard,
  onGenerateAll,
  selectedCard,
  setSelectedCard,
  isGenerating,
  generatedCards,
}: GenerationInterfaceProps) {
  return (
    <section className="py-16 md:py-24 px-6" id="generate">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            The Major Arcana
          </h2>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
            Select individual cards to generate or create the entire mystical deck at once
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Card Selector */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="font-display text-2xl font-medium">Select a Card</h3>
              <Button
                onClick={onGenerateAll}
                disabled={isGenerating}
                variant="outline"
                className="gap-2"
                data-testid="button-generate-all"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate All 16 Cards
              </Button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {TAROT_CARDS.map((cardName) => {
                const isGenerated = generatedCards.has(cardName);
                const isSelected = selectedCard === cardName;

                return (
                  <button
                    key={cardName}
                    onClick={() => setSelectedCard(cardName)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200
                      hover-elevate active-elevate-2
                      ${isSelected ? "border-primary bg-primary/5" : "border-border bg-card"}
                      ${isGenerated ? "border-chart-1/50" : ""}
                    `}
                    data-testid={`button-select-${cardName.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="text-left space-y-2">
                      <p className="font-display text-sm font-medium line-clamp-2">
                        {cardName}
                      </p>
                      {isGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          Generated
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Generate Selected Button */}
            {selectedCard && (
              <Button
                onClick={() => onGenerateCard(selectedCard)}
                disabled={isGenerating}
                className="w-full gap-2"
                size="lg"
                data-testid="button-generate-selected"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate "{selectedCard}"
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-medium">Preview</h3>

            <Card className="border-2 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[2/3] bg-muted/30 flex items-center justify-center">
                  {isGenerating ? (
                    <MysticalSpinner />
                  ) : selectedCard && generatedCards.has(selectedCard) ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={generatedCards.get(selectedCard)}
                        alt={`${selectedCard} tarot card`}
                        className="w-full h-full object-cover"
                        data-testid={`img-preview-${selectedCard.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="backdrop-blur-md"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = generatedCards.get(selectedCard)!;
                            link.download = `${selectedCard.replace(/\s+/g, '_')}_tarot_card.png`;
                            link.click();
                          }}
                          data-testid="button-download-preview"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : selectedCard ? (
                    <div className="text-center space-y-4 p-8">
                      <div className="text-6xl opacity-20">🌙</div>
                      <p className="font-serif text-muted-foreground italic">
                        Click "Generate" to create<br />
                        <span className="font-display font-semibold">{selectedCard}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 p-8">
                      <div className="text-6xl opacity-20">✨</div>
                      <p className="font-serif text-muted-foreground italic" data-testid="text-empty-preview">
                        Select a card to begin
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prompt Display */}
            {selectedCard && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm font-sans text-muted-foreground">
                    <span className="font-semibold">Prompt:</span> Mystical cat-themed tarot card illustrations for {selectedCard}, ornate border, mystical atmosphere, 2:3 aspect ratio
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
