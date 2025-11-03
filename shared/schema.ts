import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tarotCards = pgTable("tarot_cards", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  style: varchar("style", { length: 50 }).default("mystical"),
  colorPalette: varchar("color_palette", { length: 50 }).default("vibrant"),
  borderPattern: varchar("border_pattern", { length: 50 }).default("ornate"),
  isCustom: boolean("is_custom").notNull().default(false),
  version: integer("version").notNull().default(1),
  uprightMeaning: text("upright_meaning"),
  reversedMeaning: text("reversed_meaning"),
  symbolism: text("symbolism"),
  keywords: text("keywords"),
});

export const insertTarotCardSchema = createInsertSchema(tarotCards).omit({
  id: true,
  generatedAt: true,
});

export type InsertTarotCard = z.infer<typeof insertTarotCardSchema>;
export type TarotCard = typeof tarotCards.$inferSelect;

export const cardStyles = ["mystical", "realistic", "artistic", "watercolor", "vintage"] as const;
export const colorPalettes = ["vibrant", "muted", "monochrome", "pastel", "cosmic"] as const;
export const borderPatterns = ["ornate", "simple", "geometric", "floral", "celestial"] as const;

export type CardStyle = typeof cardStyles[number];
export type ColorPalette = typeof colorPalettes[number];
export type BorderPattern = typeof borderPatterns[number];

export const TAROT_CARDS = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
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
  "The Moon",
  "The Sun",
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
