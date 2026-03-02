import { integer, pgTable, varchar, timestamp, boolean, text, real } from "drizzle-orm/pg-core";

// Flashcard decks for organizing cards
export const decksTable = pgTable("decks", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  isPublic: boolean().default(false),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

// Individual flashcards
export const flashcardsTable = pgTable("flashcards", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  deckId: varchar({ length: 255 }).notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // Question/prompt (e.g., "Dog" or "When was the battle of Hastings?")
  back: text().notNull(), // Answer (e.g., "Anjing" or "1066")
  difficulty: integer().default(1), // 1-5 difficulty scale for learning
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

// Study sessions to track progress
export const studySessionsTable = pgTable("study_sessions", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  deckId: varchar({ length: 255 }).notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  cardsStudied: integer().notNull().default(0),
  correctAnswers: integer().notNull().default(0),
  duration: integer().notNull(), // Duration in seconds
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

// Card reviews for spaced repetition algorithm
export const cardReviewsTable = pgTable("card_reviews", {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  flashcardId: varchar({ length: 255 }).notNull().references(() => flashcardsTable.id, { onDelete: "cascade" }),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  isCorrect: boolean().notNull(),
  reviewTime: integer().notNull(), // Time taken to answer in seconds
  nextReviewAt: timestamp({ withTimezone: true }), // When to review this card again
  easeFactor: real().default(2.5), // SM-2 algorithm ease factor
  interval: integer().default(1), // Days until next review
  repetitions: integer().default(0), // Number of successful repetitions
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript
export type Deck = typeof decksTable.$inferSelect;
export type NewDeck = typeof decksTable.$inferInsert;
export type Flashcard = typeof flashcardsTable.$inferSelect;
export type NewFlashcard = typeof flashcardsTable.$inferInsert;
export type StudySession = typeof studySessionsTable.$inferSelect;
export type NewStudySession = typeof studySessionsTable.$inferInsert;
export type CardReview = typeof cardReviewsTable.$inferSelect;
export type NewCardReview = typeof cardReviewsTable.$inferInsert;
