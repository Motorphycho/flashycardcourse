import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDeckById } from "@/db/queries/decks";
import { createFlashcard } from "@/db/queries/flashcards";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const flashcardSchema = z.object({
  front: z.string().min(1, "Front content is required").max(1000, "Front content must be less than 1000 characters"),
  back: z.string().min(1, "Back content is required").max(1000, "Back content must be less than 1000 characters"),
  difficulty: z.number().int().min(1, "Difficulty must be between 1 and 5").max(5, "Difficulty must be between 1 and 5").default(1),
});

interface AddCardPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function AddCardPage({ params }: AddCardPageProps) {
  const { userId } = await auth();
  const { deckId } = await params;

  if (!userId) {
    redirect("/");
  }

  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    notFound();
  }

  async function createFlashcardAction(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) {
      redirect("/");
    }

    const validatedFields = flashcardSchema.safeParse({
      front: formData.get("front"),
      back: formData.get("back"),
      difficulty: parseInt(formData.get("difficulty") as string) || 1,
    });

    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error);
      return;
    }

    try {
      await createFlashcard({
        deckId,
        front: validatedFields.data.front,
        back: validatedFields.data.back,
        difficulty: validatedFields.data.difficulty,
      });
      
      revalidatePath(`/dashboard/decks/${deckId}`);
      redirect(`/dashboard/decks/${deckId}`);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Error creating flashcard:", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Add New Flashcard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create a new flashcard for the &quot;{deck.title}&quot; deck.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Flashcard Content</CardTitle>
            <CardDescription>
              Enter the question/prompt for the front and the answer for the back of the card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createFlashcardAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="front">Front *</Label>
                <Textarea
                  id="front"
                  name="front"
                  placeholder="e.g., What is the capital of France?"
                  rows={3}
                  className="w-full resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="back">Back *</Label>
                <Textarea
                  id="back"
                  name="back"
                  placeholder="e.g., Paris"
                  rows={3}
                  className="w-full resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="1"
                >
                  <option value="1">1 - Very Easy</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - Hard</option>
                  <option value="5">5 - Very Hard</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Create Flashcard</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
