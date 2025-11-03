import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type TarotCardName, type TarotCard } from "@shared/schema";
import { HeroSection } from "@/components/hero-section";
import { GenerationInterface } from "@/components/generation-interface";
import { GallerySection } from "@/components/gallery-section";
import { CardDetailModal } from "@/components/card-detail-modal";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<TarotCardName | null>(null);
  const [modalCard, setModalCard] = useState<TarotCard | null>(null);
  const { toast } = useToast();

  // Fetch all generated cards
  const { data: cardsArray } = useQuery<TarotCard[]>({
    queryKey: ["/api/cards"],
    refetchInterval: 5000, // Poll every 5 seconds during batch generation
  });

  // Convert array to Map for easier lookup (by name -> full card object)
  const generatedCards = new Map(
    (cardsArray || []).map(card => [card.name, card])
  );

  // Generate single card mutation
  const generateCardMutation = useMutation({
    mutationFn: async ({ cardName, customPrompt }: { cardName: TarotCardName; customPrompt?: string }) => {
      const response = await apiRequest("POST", "/api/generate", { cardName, customPrompt });
      return response;
    },
    onSuccess: (data, { cardName }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      const isRegeneration = generatedCards.has(cardName);
      toast({
        title: isRegeneration ? "Card Regenerated!" : "Card Generated!",
        description: `${cardName} has been successfully ${isRegeneration ? 'regenerated' : 'created'}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate card. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate all cards mutation
  const generateAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-all", {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Batch Generation Started!",
        description: "Generating all 22 tarot cards. This may take a few minutes.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Batch Generation Failed",
        description: error.message || "Failed to start batch generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateCard = async (cardName: TarotCardName, customPrompt?: string) => {
    await generateCardMutation.mutateAsync({ cardName, customPrompt });
  };

  const handleGenerateAll = async () => {
    await generateAllMutation.mutateAsync();
  };

  const handleDownloadAll = () => {
    if (!generatedCards || generatedCards.size === 0) return;

    generatedCards.forEach((card) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = card.imageUrl;
        link.download = `${card.name.replace(/\s+/g, '_')}_tarot_card.png`;
        link.click();
      }, 100);
    });

    toast({
      title: "Downloading Cards",
      description: `Downloading ${generatedCards.size} tarot cards...`,
    });
  };

  const scrollToGenerate = () => {
    const element = document.getElementById("generate");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const isGenerating = generateCardMutation.isPending || generateAllMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection onGenerateClick={scrollToGenerate} />
      
      <GenerationInterface
        onGenerateCard={handleGenerateCard}
        onGenerateAll={handleGenerateAll}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        isGenerating={isGenerating}
        generatedCards={generatedCards}
      />

      <GallerySection
        generatedCards={generatedCards}
        onCardClick={(card) => setModalCard(card)}
        onDownloadAll={handleDownloadAll}
      />

      {modalCard && (
        <CardDetailModal
          isOpen={true}
          onClose={() => setModalCard(null)}
          card={modalCard}
        />
      )}

      <Footer />
    </div>
  );
}
