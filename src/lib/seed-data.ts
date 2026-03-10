import { db } from "@/lib/db";
import { createDeck } from "@/db/queries/decks";
import { createFlashcard } from "@/db/queries/flashcards";
import type { NewDeck, NewFlashcard } from "@/db/schema";

// Example user ID - replace with actual user ID from Clerk
const EXAMPLE_USER_ID = "user_example_123"; // You should replace this with actual Clerk user ID

const spanishDeckData: Omit<NewDeck, "id" | "createdAt" | "updatedAt"> = {
  title: "Spanish Vocabulary Basics",
  description: "Common English words and their Spanish translations for beginners",
  userId: EXAMPLE_USER_ID,
  isPublic: false,
};

const spanishCards: Array<{
  deckId: string;
  front: string;
  back: string;
  difficulty: number | null;
}> = [
  { deckId: "", front: "Hello", back: "Hola", difficulty: 1 },
  { deckId: "", front: "Goodbye", back: "Adiós", difficulty: 1 },
  { deckId: "", front: "Thank you", back: "Gracias", difficulty: 1 },
  { deckId: "", front: "Please", back: "Por favor", difficulty: 1 },
  { deckId: "", front: "Water", back: "Agua", difficulty: 1 },
  { deckId: "", front: "Food", back: "Comida", difficulty: 1 },
  { deckId: "", front: "House", back: "Casa", difficulty: 1 },
  { deckId: "", front: "Book", back: "Libro", difficulty: 1 },
  { deckId: "", front: "Friend", back: "Amigo", difficulty: 1 },
  { deckId: "", front: "Family", back: "Familia", difficulty: 1 },
  { deckId: "", front: "Today", back: "Hoy", difficulty: 1 },
  { deckId: "", front: "Tomorrow", back: "Mañana", difficulty: 2 },
  { deckId: "", front: "Beautiful", back: "Hermoso", difficulty: 2 },
  { deckId: "", front: "Important", back: "Importante", difficulty: 2 },
  { deckId: "", front: "Difficult", back: "Difícil", difficulty: 2 },
];

const britishHistoryDeckData: Omit<NewDeck, "id" | "createdAt" | "updatedAt"> = {
  title: "British History Quiz",
  description: "Key questions and answers about British history",
  userId: EXAMPLE_USER_ID,
  isPublic: false,
};

const britishHistoryCards: Array<{
  deckId: string;
  front: string;
  back: string;
  difficulty: number | null;
}> = [
  { deckId: "", front: "When was the Battle of Hastings?", back: "1066", difficulty: 2 },
  { deckId: "", front: "Who was the first Tudor monarch?", back: "Henry VII", difficulty: 3 },
  { deckId: "", front: "In what year did Queen Elizabeth I die?", back: "1603", difficulty: 3 },
  { deckId: "", front: "Who was the Prime Minister during World War II?", back: "Winston Churchill", difficulty: 1 },
  { deckId: "", front: "When did the Great Fire of London occur?", back: "1666", difficulty: 2 },
  { deckId: "", front: "Who wrote the Magna Carta?", back: "King John", difficulty: 3 },
  { deckId: "", front: "When was the Act of Union passed?", back: "1707", difficulty: 3 },
  { deckId: "", front: "Who was known as the 'Virgin Queen'?", back: "Queen Elizabeth I", difficulty: 2 },
  { deckId: "", front: "When did the Roman Empire leave Britain?", back: "410 AD", difficulty: 4 },
  { deckId: "", front: "Who defeated the Spanish Armada?", back: "Queen Elizabeth I's navy", difficulty: 3 },
  { deckId: "", front: "When was the Industrial Revolution in Britain?", back: "1760-1840", difficulty: 3 },
  { deckId: "", front: "Who was the first British Prime Minister?", back: "Robert Walpole", difficulty: 4 },
  { deckId: "", front: "When did Victoria become Queen?", back: "1837", difficulty: 3 },
  { deckId: "", front: "What was the War of the Roses about?", back: "Civil war between Lancaster and York", difficulty: 4 },
  { deckId: "", front: "When did the British Empire reach its peak?", back: "Late 19th to early 20th century", difficulty: 3 },
];

export async function seedExampleData(userId: string) {
  try {
    // Create Spanish Vocabulary deck
    const spanishDeck = await createDeck(userId, spanishDeckData);
    
    // Add Spanish flashcards
    for (const card of spanishCards) {
      await createFlashcard({
        ...card,
        deckId: spanishDeck.id,
      });
    }

    // Create British History deck
    const britishHistoryDeck = await createDeck(userId, britishHistoryDeckData);
    
    // Add British History flashcards
    for (const card of britishHistoryCards) {
      await createFlashcard({
        ...card,
        deckId: britishHistoryDeck.id,
      });
    }

    return {
      success: true,
      spanishDeckId: spanishDeck.id,
      britishHistoryDeckId: britishHistoryDeck.id,
    };
  } catch (error) {
    console.error("Error seeding data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
