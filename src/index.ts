import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { decksTable, flashcardsTable } from './db/schema';

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Test creating a deck (using a mock Clerk user ID)
    const deck: typeof decksTable.$inferInsert = {
      id: 'test-deck-123',
      title: 'Indonesian Language Learning',
      description: 'Learn Indonesian from English',
      userId: 'user-clerk-id-123', // This would come from Clerk auth
      isPublic: false,
    };
    
    await db.insert(decksTable).values(deck).onConflictDoNothing();
    console.log('✅ Deck created or already exists');
    
    // Test creating flashcards
    const flashcard1: typeof flashcardsTable.$inferInsert = {
      id: 'test-card-1',
      front: 'Dog',
      back: 'Anjing',
      deckId: deck.id!,
      difficulty: 1,
    };
    
    const flashcard2: typeof flashcardsTable.$inferInsert = {
      id: 'test-card-2',
      front: 'When was the battle of Hastings?',
      back: '1066',
      deckId: deck.id!,
      difficulty: 2,
    };
    
    const flashcard3: typeof flashcardsTable.$inferInsert = {
      id: 'test-card-3',
      front: 'Cat',
      back: 'Kucing',
      deckId: deck.id!,
      difficulty: 1,
    };
    
    await db.insert(flashcardsTable).values([flashcard1, flashcard2, flashcard3]).onConflictDoNothing();
    console.log('✅ Flashcards created or already exist');
    
    // Test reading data
    const decks = await db.select().from(decksTable);
    console.log('📊 Decks in database:', decks.length);
    console.log('� Deck:', decks[0]?.title);
    
    const flashcards = await db.select().from(flashcardsTable);
    console.log('📊 Flashcards in database:', flashcards.length);
    console.log('🎴 Sample cards:');
    flashcards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.front} → ${card.back}`);
    });
    
    // Test updating data
    await db
      .update(decksTable)
      .set({ updatedAt: new Date() })
      .where(eq(decksTable.id, deck.id!));
    console.log('✅ Deck updated successfully');
    
    console.log('🎉 All database operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    throw error;
  }
}

// Run the main function
main().catch(console.error);
