CREATE TABLE "card_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"flashcardId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"isCorrect" boolean NOT NULL,
	"reviewTime" integer NOT NULL,
	"nextReviewAt" timestamp with time zone,
	"easeFactor" real DEFAULT 2.5,
	"interval" integer DEFAULT 1,
	"repetitions" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"userId" varchar(255) NOT NULL,
	"isPublic" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"deckId" varchar(255) NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"difficulty" integer DEFAULT 1,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"deckId" varchar(255) NOT NULL,
	"cardsStudied" integer DEFAULT 0 NOT NULL,
	"correctAnswers" integer DEFAULT 0 NOT NULL,
	"duration" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card_reviews" ADD CONSTRAINT "card_reviews_flashcardId_flashcards_id_fk" FOREIGN KEY ("flashcardId") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_deckId_decks_id_fk" FOREIGN KEY ("deckId") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_deckId_decks_id_fk" FOREIGN KEY ("deckId") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;