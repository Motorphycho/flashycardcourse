import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getDeckById } from "@/db/queries/decks";
import { getDeckFlashcards } from "@/db/queries/flashcards";
import StudyClient from "./study-client";

export const dynamic = "force-dynamic";

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { deckId } = await params;

  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    notFound();
  }

  const flashcards = await getDeckFlashcards(deckId, userId);

  return <StudyClient deck={deck} flashcards={flashcards} />;
}
