import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { createDeck } from "@/db/queries/decks";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const deckSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().nullable().default(false),
});

export default async function CreateDeckPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  async function createDeckAction(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) {
      redirect("/");
    }

    const validatedFields = deckSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") ? formData.get("description") : null,
      isPublic: formData.get("isPublic") === "on",
    });

    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error);
      return;
    }

    try {
      const newDeck = await createDeck(userId, validatedFields.data);
      console.log("New deck created:", newDeck);
      // Revalidate dashboard and deck list
      revalidatePath("/dashboard");
      // Automatically go back to the deck page after creation
      redirect(`/dashboard/decks/${newDeck.id}`);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Error creating deck:", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Create New Deck
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create a new flashcard deck to organize your study materials.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Deck Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your new deck.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createDeckAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Spanish Vocabulary Basics"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Optional: Add a description to help you remember what this deck is about..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Make this deck public
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Create Deck</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
