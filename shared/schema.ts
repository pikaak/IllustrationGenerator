import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tarotCards = pgTable("tarot_cards", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

export const insertTarotCardSchema = createInsertSchema(tarotCards).omit({
  id: true,
  generatedAt: true,
});

export type InsertTarotCard = z.infer<typeof insertTarotCardSchema>;
export type TarotCard = typeof tarotCards.$inferSelect;

export const TAROT_CARDS = [
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "Judgement",
  "The World",
] as const;

export type TarotCardName = typeof TAROT_CARDS[number];

export interface GenerationProgress {
  cardName: string;
  status: "pending" | "generating" | "completed" | "error";
  imageUrl?: string;
  error?: string;
}

export interface BatchGenerationStatus {
  total: number;
  completed: number;
  inProgress: string[];
  cards: GenerationProgress[];
}
