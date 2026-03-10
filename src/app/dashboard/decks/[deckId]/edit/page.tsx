import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { getDeckById, updateDeck } from "@/db/queries/decks";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const deckSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().nullable().default(false),
});

interface EditDeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function EditDeckPage({ params }: EditDeckPageProps) {
  const { userId } = await auth();
  const { deckId } = await params;

  if (!userId) {
    redirect("/");
  }

  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    notFound();
  }

  async function updateDeckAction(formData: FormData) {
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
      await updateDeck(deckId, userId, validatedFields.data);
      revalidatePath("/dashboard");
      revalidatePath(`/dashboard/decks/${deckId}`);
      redirect(`/dashboard/decks/${deckId}`);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Error updating deck:", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href={`/dashboard/decks/${deckId}`} 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deck
          </Link>
          
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Edit Deck
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your deck details below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deck Details</CardTitle>
            <CardDescription>
              Modify the information for your deck.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateDeckAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={deck.title}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={deck.description || ""}
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  defaultChecked={deck.isPublic || false}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Make this deck public
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/decks/${deckId}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
