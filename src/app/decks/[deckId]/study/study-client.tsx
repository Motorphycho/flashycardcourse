"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, RotateCcw, Trophy, Clock, Target } from "lucide-react";
import { saveStudySession } from "./actions";
import type { Flashcard, Deck } from "@/db/schema";

interface StudyClientProps {
  deck: Deck;
  flashcards: Flashcard[];
}

type StudyState = "studying" | "completed";

interface CardResult {
  flashcardId: string;
  isCorrect: boolean;
}

export default function StudyClient({ deck, flashcards }: StudyClientProps) {
  const [studyState, setStudyState] = useState<StudyState>("studying");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number>(0);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>(() => 
    [...flashcards].sort(() => Math.random() - 0.5)
  );

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleAnswer = useCallback(async (isCorrect: boolean) => {
    const currentCard = shuffledCards[currentIndex];
    setResults((prev) => [...prev, { flashcardId: currentCard.id, isCorrect }]);

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      const computedEndTime = Date.now();
      const duration = Math.round((computedEndTime - startTime) / 1000);
      const correctCount = results.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0);

      await saveStudySession(
        deck.id,
        shuffledCards.length,
        correctCount,
        duration
      );

      setEndTime(computedEndTime);
      setStudyState("completed");
    }
  }, [currentIndex, shuffledCards, results, deck.id, startTime]);

  const handleRestart = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setStudyState("studying");
  };

  const handleStudyIncorrectOnly = () => {
    const incorrectCards = shuffledCards.filter(
      (card) => !results.find((r) => r.flashcardId === card.id && r.isCorrect)
    );
    setShuffledCards(incorrectCards.length > 0 ? incorrectCards : shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setStudyState("studying");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (studyState === "completed") return;

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "Digit1" || e.code === "ArrowRight") {
        if (isFlipped) handleAnswer(true);
      } else if (e.code === "Digit2" || e.code === "ArrowLeft") {
        if (isFlipped) handleAnswer(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleAnswer, isFlipped, studyState]);

  const currentCard = shuffledCards[currentIndex];
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.filter((r) => !r.isCorrect).length;
  const duration = useMemo(() => {
    if (startTime === 0 || endTime === 0) return 0;
    return Math.round((endTime - startTime) / 1000);
  }, [startTime, endTime]);

  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Cards to Study</h2>
          <p className="text-muted-foreground mb-6">
            This deck has no flashcards yet.
          </p>
          <Button asChild>
            <Link href={`/dashboard/decks/${deck.id}/flashcards/new`}>
              Add Cards
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (studyState === "completed") {
    const percentage = Math.round((correctCount / shuffledCards.length) * 100);
    
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Study Complete!</h2>
            <p className="text-muted-foreground mt-2">
              You finished studying {deck.title}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{shuffledCards.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <Check className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg">
              <X className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>Time: {duration}s</span>
            <span className="mx-2">•</span>
            <span>{percentage}% accuracy</span>
          </div>

          <div className="space-y-3">
            <Button onClick={handleRestart} className="w-full" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Study Again
            </Button>
            {incorrectCount > 0 && (
              <Button onClick={handleStudyIncorrectOnly} variant="outline" className="w-full" size="lg">
                Study Incorrect Only ({incorrectCount})
              </Button>
            )}
            <Button asChild variant="ghost" className="w-full">
              <Link href={`/dashboard/decks/${deck.id}`}>Back to Deck</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={`/dashboard/decks/${deck.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deck
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{deck.title}</h1>
              <p className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {shuffledCards.length}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-500 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                {correctCount}
              </span>
              <span className="text-red-500 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {incorrectCount}
              </span>
            </div>
          </div>

          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <div
            onClick={handleFlip}
            className="cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full min-h-[300px] transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <Card className="w-full min-h-[300px] backface-hidden">
                <CardContent className="flex items-center justify-center min-h-[300px] p-8">
                  <div className="text-center text-lg">
                    {currentCard?.front}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="w-full min-h-[300px] absolute inset-0 backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <CardContent className="flex items-center justify-center min-h-[300px] p-8">
                  <div className="text-center text-lg">
                    {currentCard?.back}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Click card to flip • Press Space to flip
          </p>
        </div>

        {isFlipped ? (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleAnswer(false)}
              size="lg"
              variant="destructive"
              className="w-40"
            >
              <X className="w-5 h-5 mr-2" />
              Don&apos;t Know
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              size="lg"
              variant="default"
              className="w-40 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5 mr-2" />
              Know
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to reveal answer
          </p>
        )}
      </div>
    </div>
  );
}
