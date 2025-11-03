import { type TarotCard, type InsertTarotCard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tarot card operations
  getTarotCard(id: string): Promise<TarotCard | undefined>;
  getTarotCardByName(name: string): Promise<TarotCard | undefined>;
  getAllTarotCards(): Promise<TarotCard[]>;
  createTarotCard(card: InsertTarotCard): Promise<TarotCard>;
  updateTarotCard(id: string, card: Partial<InsertTarotCard>): Promise<TarotCard | undefined>;
}

export class MemStorage implements IStorage {
  private tarotCards: Map<string, TarotCard>;

  constructor() {
    this.tarotCards = new Map();
  }

  async getTarotCard(id: string): Promise<TarotCard | undefined> {
    return this.tarotCards.get(id);
  }

  async getTarotCardByName(name: string): Promise<TarotCard | undefined> {
    return Array.from(this.tarotCards.values()).find(
      (card) => card.name === name,
    );
  }

  async getAllTarotCards(): Promise<TarotCard[]> {
    return Array.from(this.tarotCards.values());
  }

  async createTarotCard(insertCard: InsertTarotCard): Promise<TarotCard> {
    const id = randomUUID();
    const card: TarotCard = {
      ...insertCard,
      id,
      generatedAt: new Date(),
    };
    this.tarotCards.set(id, card);
    return card;
  }

  async updateTarotCard(id: string, updateData: Partial<InsertTarotCard>): Promise<TarotCard | undefined> {
    const card = this.tarotCards.get(id);
    if (!card) return undefined;

    const updatedCard: TarotCard = { ...card, ...updateData };
    this.tarotCards.set(id, updatedCard);
    return updatedCard;
  }
}

export const storage = new MemStorage();
