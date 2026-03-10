import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserDecks } from "@/db/queries/decks";
import { getDeckFlashcards } from "@/db/queries/flashcards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const decks = await getUserDecks(userId);

  // Get card count for each deck
  const decksWithCardCount = await Promise.all(
    decks.map(async (deck) => {
      const flashcards = await getDeckFlashcards(deck.id, userId);
      return {
        ...deck,
        cardCount: flashcards.length,
      };
    })
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back. Manage your courses and flashcard decks here.
        </p>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Decks</h2>
          
          {decksWithCardCount.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">No decks found. Create your first deck to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {decksWithCardCount.map((deck) => (
                <Link key={deck.id} href={`/dashboard/decks/${deck.id}`} className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer hover:bg-accent/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{deck.title}</CardTitle>
                      <CardDescription>{deck.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
                          </span>
                          <span className="text-sm text-primary font-medium">Study</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated {new Date(deck.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-start">
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/dashboard/decks/new">Create New Deck</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
