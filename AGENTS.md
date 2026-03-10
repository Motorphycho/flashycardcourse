# AGENTS.md - Flashcardy Course Agent Guidelines

## Overview
This is a Next.js 16 flashcard application with Clerk authentication, Drizzle ORM, and shadcn UI components.

---

## Development Commands

```bash
# Development
npm run dev                    # Start development server (localhost:3000)

# Build & Production
npm run build                  # Build for production
npm run start                  # Start production server

# Linting
npm run lint                   # Run ESLint
```

### Database Commands
```bash
# Generate database migrations (after schema changes)
npx drizzle-kit push           # Push schema to database
npx drizzle-kit studio         # Open Drizzle Studio for data browsing

# Seed example data
node test-seed.js              # Seed sample decks via API
```

---

## Project Structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── api/                  # API routes
│   ├── dashboard/            # Authenticated dashboard pages
│   ├── sign-in/              # Clerk sign-in
│   └── sign-up/              # Clerk sign-up
├── components/
│   └── ui/                   # shadcn UI components
├── db/
│   ├── queries/              # Database query functions
│   └── schema.ts             # Drizzle schema definitions
└── lib/                      # Utilities (db, utils, seed-data)
```

---

## Code Style Guidelines

### General Principles
- Use **Next.js App Router** (src/app/)
- Use **functional components** and hooks; avoid class components
- Use **TypeScript** for all new files; avoid `any` when possible
- Keep components small; extract reusable logic into custom hooks
- Use `"use client"` only where needed (interactivity, browser APIs)

### Imports
- Use **@/** alias for project imports (e.g., `@/components/...`, `@/lib/...`)
- Order imports: external libs → internal libs → local components
- Use absolute imports with @/ prefix

```typescript
// Good
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { decksTable } from "@/db/schema";

// Avoid
import { Button } from "../../components/ui/button";
import { db } from "../lib/db";
```

### Naming Conventions
- **Files**: kebab-case for utilities (`db.ts`, `utils.ts`), kebab-case for pages (`dashboard/page.tsx`)
- **Components**: PascalCase (e.g., `DashboardPage`, `FlashcardCard`)
- **Database tables**: camelCase with Table suffix (`decksTable`, `flashcardsTable`)
- **Types**: PascalCase (`Deck`, `Flashcard`, `NewDeck`)
- **Functions**: camelCase, use verb prefixes (`getUserDecks`, `createDeck`, `deleteDeck`)

### UI Components (shadcn UI)
- **Always use shadcn UI** for buttons, cards, dialogs, inputs, forms, etc.
- Use the `cn()` helper from `@/lib/utils.ts` for merging class names
- Run `npx shadcn@latest add <component>` to add new components

```typescript
import { cn } from "@/lib/utils";

// Good
className={cn("base-class", condition && "conditional-class")}

// shadcn component usage
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

### Authentication (Clerk)
- Always use Clerk's `auth()` from `@clerk/nextjs/server` in server components
- Check for `userId` before performing authenticated actions

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  // ... proceed with userId
}
```

### Error Handling

#### API Routes
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Server Actions
```typescript
async function action() {
  "use server";
  try {
    // ... logic
  } catch (error) {
    console.error("Action error:", error);
    // Handle error appropriately
  }
}
```

### Database (Drizzle ORM)
- Export type definitions for all tables in schema.ts
- Always include userId checks in query functions
- Use parameterized queries via Drizzle (safe from SQL injection)

```typescript
// Schema - export types
export type Deck = typeof decksTable.$inferSelect;
export type NewDeck = typeof decksTable.$inferInsert;

// Query - always filter by userId
export async function getDeckById(deckId: string, userId: string) {
  const deck = await db
    .select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .limit(1);
  return deck[0] || null;
}
```

### Server Actions & Form Submissions
- Use `bind()` for passing parameters to server action forms
- Use `revalidatePath()` to refresh data after mutations
- Use `redirect()` for navigation after actions

```typescript
<form action={deleteDeckAction.bind(null, deck.id)}>
  <Button type="submit">Delete</Button>
</form>

async function deleteDeckAction(deckId: string) {
  "use server";
  await deleteDeck(deckId, userId);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
```

### CSS & Styling
- Use Tailwind CSS classes (already configured)
- Use shadcn design tokens via CSS variables
- Follow existing className patterns in components

---

## Environment Variables

Required in `.env.local`:
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Common Patterns

### Creating a New Page
1. Create file under `src/app/<path>/page.tsx`
2. Use `export default async function PageName()` for server components
3. Add authentication check at top
4. Fetch data using query functions
5. Return JSX with shadcn components

### Adding a New Database Table
1. Add table definition to `src/db/schema.ts`
2. Run `npx drizzle-kit push` to create table
3. Export types (`Type`, `NewType`)
4. Create query functions in `src/db/queries/`

### Adding a New API Route
1. Create `src/app/api/<route>/route.ts`
2. Export handlers: `GET`, `POST`, `PUT`, `DELETE`
3. Include error handling with try/catch
4. Return appropriate `NextResponse` with status codes
