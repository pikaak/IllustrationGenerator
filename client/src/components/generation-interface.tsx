import { useState } from "react";
import { TAROT_CARDS, type TarotCardName, type TarotCard, cardStyles, colorPalettes, borderPatterns } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, Loader2, Settings2, Wand2, Trash2 } from "lucide-react";
import { MysticalSpinner } from "./loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerationInterfaceProps {
  onGenerateCard: (cardName: TarotCardName, customPrompt?: string) => Promise<void>;
  onGenerateAll: () => Promise<void>;
  onClearAll: () => Promise<void>;
  selectedCard: TarotCardName | null;
  setSelectedCard: (card: TarotCardName | null) => void;
  isGenerating: boolean;
  generatedCards: Map<string, TarotCard>;
  isBatchGenerating?: boolean;
  generatedCount?: number;
  elapsedTime?: number;
}

export function GenerationInterface({
  onGenerateCard,
  onGenerateAll,
  onClearAll,
  selectedCard,
  setSelectedCard,
  isGenerating,
  generatedCards,
  isBatchGenerating = false,
  generatedCount = 0,
  elapsedTime = 0,
}: GenerationInterfaceProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [style, setStyle] = useState("mystical");
  const [colorPalette, setColorPalette] = useState("vibrant");
  const [borderPattern, setBorderPattern] = useState("ornate");

  const getPromptText = () => {
    if (customPrompt) return customPrompt;

    const styleDescriptions: Record<string, string> = {
      mystical: "mystical atmosphere",
      realistic: "realistic photographic style",
      artistic: "artistic painterly style",
      watercolor: "soft watercolor technique",
      vintage: "vintage antique aesthetic"
    };

    const paletteDescriptions: Record<string, string> = {
      vibrant: "vibrant rich colors",
      muted: "muted earthy tones",
      monochrome: "monochromatic palette",
      pastel: "soft pastel colors",
      cosmic: "cosmic deep space colors"
    };

    const borderDescriptions: Record<string, string> = {
      ornate: "ornate decorative border",
      simple: "simple elegant border",
      geometric: "geometric pattern border",
      floral: "floral vine border",
      celestial: "celestial star border"
    };

    const styleDesc = styleDescriptions[style] || "mystical atmosphere";
    const paletteDesc = paletteDescriptions[colorPalette] || "vibrant rich colors";
    const borderDesc = borderDescriptions[borderPattern] || "ornate border";

    return selectedCard
      ? `An Cat tarot card illustration for ${selectedCard}, simple white border, mystical atmosphere, in Renoir style 2:3 aspect ratio, Garamond font. Card number at the top, card name at the bottom.`
      : `An Cat tarot card illustration, simple white border, mystical atmosphere, in Renoir style 2:3 aspect ratio, Garamond font. Card number at the top, card name at the bottom.`;
  };

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
              <div className="flex gap-2">
                <Button
                  onClick={onGenerateAll}
                  disabled={isGenerating}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-generate-all"
                >
                  {isGenerating && generatedCards.size < TAROT_CARDS.length ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate All 22 Cards
                </Button>
                {generatedCards.size > 0 && (
                  <Button
                    onClick={onClearAll}
                    disabled={isGenerating}
                    variant="outline"
                    className="gap-2"
                    data-testid="button-clear-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Batch Generation Progress */}
            {isBatchGenerating && generatedCount < TAROT_CARDS.length && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Generating Cards...</span>
                    <span className="text-muted-foreground">
                      {generatedCount} / {TAROT_CARDS.length}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{ width: `${(generatedCount / TAROT_CARDS.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Elapsed: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
                    {generatedCount > 0 && (
                      <span>
                        Est. remaining: {Math.floor((elapsedTime / generatedCount) * (TAROT_CARDS.length - generatedCount) / 60)}m {Math.round((elapsedTime / generatedCount) * (TAROT_CARDS.length - generatedCount) % 60)}s
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Cards will appear as they're generated. This typically takes 2-3 minutes per card.
                  </p>
                </div>
              </Card>
            )}

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

            {/* Customization Controls */}
            {selectedCard && (
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold">Customization</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    {showCustomization ? "Hide" : "Show"}
                  </Button>
                </div>

                {showCustomization && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-xs font-medium">Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cardStyles.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="palette" className="text-xs font-medium">Color Palette</Label>
                      <Select value={colorPalette} onValueChange={setColorPalette}>
                        <SelectTrigger id="palette" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorPalettes.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="border" className="text-xs font-medium">Border Pattern</Label>
                      <Select value={borderPattern} onValueChange={setBorderPattern}>
                        <SelectTrigger id="border" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {borderPatterns.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b.charAt(0).toUpperCase() + b.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Generate Selected Button */}
            {selectedCard && (
              <Button
                onClick={() => onGenerateCard(selectedCard, customPrompt || getPromptText())}
                disabled={isGenerating || !selectedCard}
                className="gap-2"
                data-testid="button-generate-selected"
              >
                <Wand2 className="h-5 w-5" />
                {isGenerating ? "Generating..." : generatedCards.has(selectedCard || "") ? "Regenerate Card" : "Generate Card"}
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
                        src={generatedCards.get(selectedCard)!.imageUrl}
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
                            link.href = generatedCards.get(selectedCard)!.imageUrl;
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
                  {isEditingPrompt ? (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Custom Prompt:
                      </label>
                      <Textarea
                        value={customPrompt || getPromptText()}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        onBlur={() => setIsEditingPrompt(false)}
                        className="min-h-[80px] text-sm font-sans"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p
                      className="text-sm font-sans text-muted-foreground cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                      onClick={() => setIsEditingPrompt(true)}
                    >
                      <span className="font-semibold">Prompt:</span> {getPromptText()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}