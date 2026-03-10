import { db } from "@/lib/db";
import { decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Deck, NewDeck } from "@/db/schema";

export async function getUserDecks(userId: string): Promise<Deck[]> {
  const decks = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(decksTable.createdAt);

  return decks;
}

export async function getDeckById(deckId: string, userId: string): Promise<Deck | null> {
  const deck = await db
    .select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .limit(1);

  return deck[0] || null;
}

export async function createDeck(userId: string, deckData: Omit<NewDeck, "userId" | "createdAt" | "updatedAt">): Promise<Deck> {
  const [deck] = await db
    .insert(decksTable)
    .values({
      ...deckData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return deck as Deck;
}

export async function updateDeck(deckId: string, userId: string, deckData: Partial<Omit<NewDeck, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Deck | null> {
  const [deck] = await db
    .update(decksTable)
    .set({
      ...deckData,
      updatedAt: new Date(),
    })
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .returning();

  return (deck as Deck) || null;
}

export async function deleteDeck(deckId: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));

  return (result.rowCount ?? 0) > 0;
}
