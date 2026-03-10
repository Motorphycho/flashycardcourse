// Simple test script to seed data
// Run this with: node test-seed.js

async function testSeed() {
  try {
    console.log('Seeding example data...');
    
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success!', result);
    console.log('Spanish Deck ID:', result.spanishDeckId);
    console.log('British History Deck ID:', result.britishHistoryDeckId);
    console.log('\nNow visit http://localhost:3000/dashboard to see the decks!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    console.log('\nMake sure your Next.js app is running on http://localhost:3000');
    console.log('And that you are logged in with Clerk authentication');
  }
}

testSeed();
