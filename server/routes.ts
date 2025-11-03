import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { generateTarotCardImage, batchGenerateTarotCards } from "./gemini";
import { saveImageToFile, IMAGES_DIR } from "./image-storage";
import { TAROT_CARDS } from "@shared/schema";
import { TAROT_MEANINGS } from "./tarot-meanings";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve generated images
  app.use("/images", express.static(path.join(process.cwd(), "generated_images")));

  // GET /api/cards - Get all generated tarot cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllTarotCards();
      res.json(cards);
    } catch (error: any) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  // POST /api/generate - Generate a single tarot card
  app.post("/api/generate", async (req, res) => {
    try {
      const { cardName, customPrompt } = z.object({ cardName: z.string(), customPrompt: z.string().optional() }).parse(req.body);

      // Check if card already exists
      const existingCard = await storage.getTarotCardByName(cardName);

      // Generate image using Gemini AI
      console.log(`${existingCard ? 'Regenerating' : 'Generating'} tarot card: ${cardName}`);
      const prompt = customPrompt || `Cat tarot card illustrations for ${cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio. Card number at the top, card name at the bottom.`;
      const base64Image = await generateTarotCardImage(cardName, prompt);

      // Save image to file
      const imageUrl = saveImageToFile(cardName, base64Image);

      // Get card meanings if available
      const meanings = TAROT_MEANINGS[cardName] || {};

      let card;
      if (existingCard) {
        // Update existing card
        card = await storage.updateTarotCard(existingCard.id, {
          imageUrl,
          prompt,
          version: existingCard.version + 1,
          ...meanings,
        });
        console.log(`Successfully regenerated: ${cardName} (version ${existingCard.version + 1})`);
      } else {
        // Create new card
        card = await storage.createTarotCard({
          name: cardName,
          imageUrl,
          prompt,
          ...meanings,
        });
        console.log(`Successfully generated: ${cardName}`);
      }

      res.json(card);
    } catch (error: any) {
      console.error("Error generating card:", error);
      res.status(500).json({ error: error.message || "Failed to generate card" });
    }
  });

  // DELETE /api/cards - Delete all generated cards
  app.delete("/api/cards", async (req, res) => {
    try {
      await storage.deleteAllTarotCards();
      console.log("All tarot cards deleted");
      res.json({ message: "All cards deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting cards:", error);
      res.status(500).json({ error: error.message || "Failed to delete cards" });
    }
  });

  // POST /api/generate-all - Generate all 22 tarot cards in batch
  app.post("/api/generate-all", async (req, res) => {
    try {
      // Get list of cards that haven't been generated yet
      const existingCards = await storage.getAllTarotCards();
      const existingCardNames = new Set(existingCards.map(c => c.name));

      // Use the updated TAROT_CARDS which should contain 22 cards
      const cardsToGenerate = TAROT_CARDS.filter(name => !existingCardNames.has(name));

      if (cardsToGenerate.length === 0) {
        return res.json({ message: "All cards already generated", count: 0 });
      }

      // Start batch generation in background (don't wait for completion)
      console.log(`Starting batch generation of ${cardsToGenerate.length} cards...`);

      // Respond immediately to client
      res.json({ 
        message: "Batch generation started", 
        count: cardsToGenerate.length,
        cards: cardsToGenerate 
      });

      // Generate cards in background
      void (async () => {
        try {
          console.log(`Generating ${cardsToGenerate.length} cards in background...`);
          const results = await batchGenerateTarotCards(cardsToGenerate);

          console.log(`Batch generation complete. Saving ${results.size} cards...`);

          // Save all successfully generated cards
          let savedCount = 0;
          for (const [cardName, base64Image] of results.entries()) {
            try {
              console.log(`Saving ${cardName}...`);
              const imageUrl = saveImageToFile(cardName, base64Image);
              // Use the updated prompt for Cat Tarot
              const prompt = `Cat tarot card illustrations for ${cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio`;

              // Get card meanings if available
              const meanings = TAROT_MEANINGS[cardName] || {};

              await storage.createTarotCard({
                name: cardName,
                imageUrl,
                prompt,
                ...meanings,
              });

              savedCount++;
              console.log(`✓ Saved ${savedCount}/${results.size}: ${cardName}`);
            } catch (error) {
              console.error(`✗ Failed to save ${cardName}:`, error);
            }
          }

          console.log(`Batch generation completed. Successfully saved ${savedCount}/${results.size} cards.`);
        } catch (error) {
          console.error("Batch generation error:", error);
        }
      })();

    } catch (error: any) {
      console.error("Error starting batch generation:", error);
      res.status(500).json({ error: error.message || "Failed to start batch generation" });
    }
  });

  // Download image endpoint
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filepath = path.join(IMAGES_DIR, filename);

      res.download(filepath, filename, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          if (!res.headersSent) {
            res.status(404).json({ error: "File not found" });
          }
        }
      });
    } catch (error) {
      console.error("Error in download endpoint:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}