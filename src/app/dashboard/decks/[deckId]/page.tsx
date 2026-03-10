import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeckById } from "@/db/queries/decks";
import { getDeckFlashcards, deleteFlashcardWithAuth } from "@/db/queries/flashcards";
import { ArrowLeft, Plus, Edit, Trash2, Play } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  const { deckId } = await params;

  if (!userId) {
    redirect("/");
  }

  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    notFound();
  }

  const flashcards = await getDeckFlashcards(deck.id, userId);

  async function deleteFlashcardAction(flashcardId: string) {
    "use server";
    
    const { userId } = await auth();
    if (!userId) {
      redirect("/");
    }

    try {
      await deleteFlashcardWithAuth(flashcardId, userId);
      // Revalidate the cache and redirect to show updated flashcard list
      revalidatePath(`/dashboard/decks/${deckId}`);
      redirect(`/dashboard/decks/${deckId}`);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {deck.title}
              </h1>
              {deck.description && (
                <p className="mt-2 text-muted-foreground">
                  {deck.description}
                </p>
              )}
              <div className="mt-2 text-sm text-muted-foreground">
                {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'} • 
                Updated {new Date(deck.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex gap-2">
              {flashcards.length > 0 && (
                <Button asChild>
                  <Link href={`/decks/${deck.id}/study`}>
                    <Play className="mr-2 h-4 w-4" />
                    Study
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={`/dashboard/decks/${deck.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Flashcards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Flashcards</h2>
            <Button asChild size="sm">
              <Link href={`/dashboard/decks/${deck.id}/flashcards/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Link>
            </Button>
          </div>

          {flashcards.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No flashcards in this deck yet.</p>
              <Button asChild>
                <Link href={`/dashboard/decks/${deck.id}/flashcards/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Flashcard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {flashcards.map((flashcard) => (
                <Card key={flashcard.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            ID: {flashcard.id}
                          </span>
                        </div>
                        <CardTitle className="text-base">Front</CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {flashcard.front}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 ml-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/decks/${deck.id}/flashcards/${flashcard.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteFlashcardAction.bind(null, flashcard.id)}>
                          <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Back:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {flashcard.back}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Difficulty: {flashcard.difficulty}/5</span>
                        <span>Created {new Date(flashcard.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
