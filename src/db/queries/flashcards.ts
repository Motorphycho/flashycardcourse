import { db } from "@/lib/db";
import { flashcardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Flashcard } from "@/db/schema";

export async function getDeckFlashcards(deckId: string, userId: string): Promise<Flashcard[]> {
  const flashcards = await db
    .select({
      id: flashcardsTable.id,
      deckId: flashcardsTable.deckId,
      front: flashcardsTable.front,
      back: flashcardsTable.back,
      difficulty: flashcardsTable.difficulty,
      createdAt: flashcardsTable.createdAt,
      updatedAt: flashcardsTable.updatedAt,
    })
    .from(flashcardsTable)
    .innerJoin(decksTable, eq(flashcardsTable.deckId, decksTable.id))
    .where(and(
      eq(flashcardsTable.deckId, deckId),
      eq(decksTable.userId, userId)
    ))
    .orderBy(flashcardsTable.createdAt);

  return flashcards;
}

export async function getFlashcardById(flashcardId: string): Promise<Flashcard | null> {
  const flashcard = await db
    .select()
    .from(flashcardsTable)
    .where(eq(flashcardsTable.id, flashcardId))
    .limit(1);

  return flashcard[0] || null;
}

export async function createFlashcard(flashcardData: Omit<Flashcard, "id" | "createdAt" | "updatedAt">): Promise<Flashcard> {
  const [flashcard] = await db
    .insert(flashcardsTable)
    .values({
      ...flashcardData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return flashcard;
}

export async function updateFlashcard(flashcardId: string, flashcardData: Partial<Omit<Flashcard, "id" | "createdAt" | "updatedAt">>): Promise<Flashcard | null> {
  const [flashcard] = await db
    .update(flashcardsTable)
    .set({
      ...flashcardData,
      updatedAt: new Date(),
    })
    .where(eq(flashcardsTable.id, flashcardId))
    .returning();

  return flashcard[0] || null;
}

export async function deleteFlashcard(flashcardId: string): Promise<boolean> {
  const result = await db
    .delete(flashcardsTable)
    .where(eq(flashcardsTable.id, flashcardId));

  return result.rowCount > 0;
}
