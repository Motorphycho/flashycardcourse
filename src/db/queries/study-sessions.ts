import { db } from "@/lib/db";
import { studySessionsTable } from "@/db/schema";
import type { StudySession } from "@/db/schema";

export async function createStudySession(
  userId: string,
  deckId: string,
  cardsStudied: number,
  correctAnswers: number,
  duration: number
): Promise<StudySession> {
  const [session] = await db
    .insert(studySessionsTable)
    .values({
      userId,
      deckId,
      cardsStudied,
      correctAnswers,
      duration,
    })
    .returning();

  return session;
}
