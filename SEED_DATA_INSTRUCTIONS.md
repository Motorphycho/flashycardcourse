# Seeding Example Data

This document explains how to add the example flashcard decks to your database.

## What's Included

1. **Spanish Vocabulary Basics** - 15 common English words with Spanish translations
2. **British History Quiz** - 15 questions about British history with answers

## Method 1: Using the API Endpoint (Recommended)

1. Start your Next.js application:
   ```bash
   npm run dev
   ```

2. Make sure you're logged in through Clerk authentication

3. Run the test script:
   ```bash
   node test-seed.js
   ```

4. Visit `http://localhost:3000/dashboard` to see your new decks!

## Method 2: Manual API Call

You can also make a POST request directly to the seed endpoint:

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json"
```

## Method 3: Using in Your Code

You can also import and use the seed function directly:

```typescript
import { seedExampleData } from "@/lib/seed-data";

// In your server component or API route
const result = await seedExampleData(userId);
```

## Deck Contents

### Spanish Vocabulary Basics
- Hello → Hola
- Goodbye → Adiós
- Thank you → Gracias
- Please → Por favor
- Water → Agua
- Food → Comida
- House → Casa
- Book → Libro
- Friend → Amigo
- Family → Familia
- Today → Hoy
- Tomorrow → Mañana
- Beautiful → Hermoso
- Important → Importante
- Difficult → Difícil

### British History Quiz
- When was the Battle of Hastings? → 1066
- Who was the first Tudor monarch? → Henry VII
- In what year did Queen Elizabeth I die? → 1603
- Who was the Prime Minister during World War II? → Winston Churchill
- When did the Great Fire of London occur? → 1666
- Who wrote the Magna Carta? → King John
- When was the Act of Union passed? → 1707
- Who was known as the 'Virgin Queen'? → Queen Elizabeth I
- When did the Roman Empire leave Britain? → 410 AD
- Who defeated the Spanish Armada? → Queen Elizabeth I's navy
- When was the Industrial Revolution in Britain? → 1760-1840
- Who was the first British Prime Minister? → Robert Walpole
- When did Victoria become Queen? → 1837
- What was the War of the Roses about? → Civil war between Lancaster and York
- When did the British Empire reach its peak? → Late 19th to early 20th century

## Dashboard Features

After seeding, your dashboard will display:
- Both example decks with card counts
- Individual deck cards with titles and descriptions
- "Study" buttons for each deck (links to deck study pages)
- "Create New Deck" button for adding your own decks

## Notes

- The seed data is associated with the currently logged-in user
- Each deck has 15 cards with varying difficulty levels (1-4)
- Cards are designed to be suitable for spaced repetition learning
- All data follows your project's schema and authentication rules
