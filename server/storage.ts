import { type TarotCard, type InsertTarotCard, tarotCards } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Tarot card operations
  getTarotCard(id: string): Promise<TarotCard | undefined>;
  getTarotCardByName(name: string): Promise<TarotCard | undefined>;
  getAllTarotCards(): Promise<TarotCard[]>;
  createTarotCard(card: InsertTarotCard): Promise<TarotCard>;
  updateTarotCard(id: string, card: Partial<InsertTarotCard>): Promise<TarotCard | undefined>;
  deleteTarotCard(id: string): Promise<boolean>;
  deleteAllTarotCards(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTarotCard(id: string): Promise<TarotCard | undefined> {
    const [card] = await db.select().from(tarotCards).where(eq(tarotCards.id, id));
    return card;
  }

  async getTarotCardByName(name: string): Promise<TarotCard | undefined> {
    const [card] = await db.select().from(tarotCards).where(eq(tarotCards.name, name));
    return card;
  }

  async getAllTarotCards(): Promise<TarotCard[]> {
    return await db.select().from(tarotCards);
  }

  async createTarotCard(insertCard: InsertTarotCard): Promise<TarotCard> {
    const id = randomUUID();
    const [card] = await db.insert(tarotCards).values({
      ...insertCard,
      id,
    }).returning();
    return card;
  }

  async updateTarotCard(id: string, updateData: Partial<InsertTarotCard>): Promise<TarotCard | undefined> {
    const [updated] = await db.update(tarotCards)
      .set(updateData)
      .where(eq(tarotCards.id, id))
      .returning();
    return updated;
  }

  async deleteTarotCard(id: string): Promise<boolean> {
    const result = await db.delete(tarotCards).where(eq(tarotCards.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteAllTarotCards(): Promise<void> {
    await db.delete(tarotCards);
  }
}

export const storage = new DatabaseStorage();