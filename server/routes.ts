import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { generateTarotCardImage, batchGenerateTarotCards } from "./gemini";
import { saveImageToFile } from "./image-storage";
import { TAROT_CARDS } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve generated images
  app.use("/images", express.static(path.join(process.cwd(), "generated_images")));

  // GET /api/cards - Get all generated tarot cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllTarotCards();

      // Return as a Map-compatible structure (array of [key, value] pairs)
      const cardsMap = new Map<string, string>();
      cards.forEach(card => {
        cardsMap.set(card.name, card.imageUrl);
      });

      // Convert Map to object for JSON serialization
      const cardsObject = Object.fromEntries(cardsMap);
      res.json(cardsObject);
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
      if (existingCard) {
        return res.json(existingCard);
      }

      // Generate image using Gemini AI
      console.log(`Generating tarot card: ${cardName}`);
      const prompt = customPrompt || `Cat tarot card illustrations for ${cardName}, ornate border, mystical atmosphere, 2:3 aspect ratio`;
      const base64Image = await generateTarotCardImage(cardName, prompt);

      // Save image to file
      const imageUrl = saveImageToFile(cardName, base64Image);

      // Store in database
      const card = await storage.createTarotCard({
        name: cardName,
        imageUrl,
        prompt,
      });

      console.log(`Successfully generated: ${cardName}`);
      res.json(card);
    } catch (error: any) {
      console.error("Error generating card:", error);
      res.status(500).json({ error: error.message || "Failed to generate card" });
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

              await storage.createTarotCard({
                name: cardName,
                imageUrl,
                prompt,
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

  const httpServer = createServer(app);
  return httpServer;
}