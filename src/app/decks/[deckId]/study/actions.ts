"use server";

import { auth } from "@clerk/nextjs/server";
import { createStudySession } from "@/db/queries/study-sessions";
import { redirect } from "next/navigation";

export async function saveStudySession(
  deckId: string,
  cardsStudied: number,
  correctAnswers: number,
  duration: number
) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return await createStudySession(
    userId,
    deckId,
    cardsStudied,
    correctAnswers,
    duration
  );
}
