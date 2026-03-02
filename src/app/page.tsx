export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Welcome to FlashyCardyCourse
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Your interactive flashcard learning platform. Master new concepts with smart, personalized flashcards.
          </p>
        </div>
        
        <div className="flex gap-4 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">Adaptive flashcards that adjust to your learning pace</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">Monitor your learning journey with detailed analytics</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Study Anywhere</h3>
            <p className="text-gray-600 dark:text-gray-300">Access your flashcards on any device, anytime</p>
          </div>
        </div>
      </main>
    </div>
  );
}
