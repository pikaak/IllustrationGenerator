import { useState, useEffect, useRef } from "react";
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
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [batchStartTime, setBatchStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all generated cards
  const { data: cardsArray, isLoading: isCardsLoading } = useQuery<TarotCard[]>({
    queryKey: ["/api/cards"],
    refetchInterval: isBatchGenerating ? 1000 : false, // Poll faster during batch generation
  });

  // Update generated count when data changes during batch generation
  useEffect(() => {
    if (isBatchGenerating && cardsArray) {
      const currentCount = cardsArray.length;
      setGeneratedCount(currentCount);
      if (currentCount === 22) {
        setIsBatchGenerating(false);
        setGeneratedCount(0);
        setBatchStartTime(null);
        setElapsedTime(0);
        queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
        const totalTime = batchStartTime ? Math.round((Date.now() - batchStartTime) / 1000) : 0;
        toast({
          title: "Batch Generation Complete!",
          description: `All 22 tarot cards generated in ${totalTime} seconds.`,
        });
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    }
  }, [cardsArray, isBatchGenerating, batchStartTime, toast]);

  // Timer effect for elapsed time
  useEffect(() => {
    if (isBatchGenerating && batchStartTime) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - batchStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isBatchGenerating, batchStartTime]);

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
      setIsBatchGenerating(true);
      setGeneratedCount(0); // Reset count at the start of batch generation
      setBatchStartTime(Date.now());
      setElapsedTime(0);
      toast({
        title: "Batch Generation Started!",
        description: "Generating all 22 tarot cards. This may take a few minutes.",
      });
      // Start polling more frequently
      pollingIntervalRef.current = setInterval(() => {
        queryClient.fetchQuery({ queryKey: ["/api/cards"] });
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Batch Generation Failed",
        description: error.message || "Failed to start batch generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear all cards mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/cards", {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      setSelectedCard(null);
      toast({
        title: "Cards Cleared!",
        description: "All generated cards have been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear cards. Please try again.",
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

  const handleClearAll = async () => {
    if (generatedCards.size === 0) return;

    if (confirm(`Are you sure you want to delete all ${generatedCards.size} generated cards? This action cannot be undone.`)) {
      await clearAllMutation.mutateAsync();
    }
  };

  const handleDownloadAll = async () => {
    if (!generatedCards || generatedCards.size === 0) return;

    toast({
      title: "Downloading Cards",
      description: `Starting download of ${generatedCards.size} tarot cards...`,
    });

    let downloadedCount = 0;
    for (const card of generatedCards.values()) {
      try {
        const response = await fetch(card.imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${card.name.replace(/\s+/g, '_')}_tarot_card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(blobUrl);

        downloadedCount++;

        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Failed to download ${card.name}:`, error);
      }
    }

    toast({
      title: "Download Complete",
      description: `Successfully downloaded ${downloadedCount} of ${generatedCards.size} cards.`,
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
        onClearAll={handleClearAll}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        isGenerating={isGenerating}
        generatedCards={generatedCards}
        isBatchGenerating={isBatchGenerating}
        generatedCount={generatedCount}
        elapsedTime={elapsedTime}
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