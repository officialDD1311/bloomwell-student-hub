import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface WordScrambleProps {
  onComplete: (score: number) => void;
}

const wordList = [
  "student", "college", "learning", "education", "knowledge",
  "wellness", "health", "mindful", "stress", "balance",
  "success", "growth", "future", "career", "goals",
  "focus", "study", "brain", "memory", "friend"
];

const WordScramble = ({ onComplete }: WordScrambleProps) => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [wordsSeen, setWordsSeen] = useState<string[]>([]);

  const scrambleWord = useCallback((word: string) => {
    const letters = word.split("");
    let scrambled = "";
    
    // Keep scrambling until we get a different arrangement
    do {
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      
      scrambled = letters.join("");
    } while (scrambled === word);
    
    return scrambled;
  }, []);

  const getNewWord = useCallback(() => {
    // Filter out words we've already seen
    const remainingWords = wordList.filter(word => !wordsSeen.includes(word));
    
    // If we've seen all words, reset
    if (remainingWords.length === 0) {
      setWordsSeen([]);
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setCurrentWord(randomWord);
      setScrambledWord(scrambleWord(randomWord));
      return;
    }
    
    // Otherwise pick a new unseen word
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setCurrentWord(randomWord);
    setScrambledWord(scrambleWord(randomWord));
    setWordsSeen(prev => [...prev, randomWord]);
  }, [scrambleWord, wordsSeen]);

  useEffect(() => {
    getNewWord();
  }, [getNewWord]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            onComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, score, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setScore(prev => prev + 10);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        setUserInput("");
        getNewWord();
      }, 800);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        setFeedback("");
      }, 800);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameOver(false);
    setUserInput("");
    setFeedback("");
    setWordsSeen([]);
    getNewWord();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-background/70 px-4 py-2 rounded-full">
          <span className="font-semibold">Score: {score}</span>
        </div>
        <div className="bg-background/70 px-4 py-2 rounded-full">
          <span className="font-semibold">Time: {timeLeft}s</span>
        </div>
      </div>
      
      {!gameOver ? (
        <>
          <div className="text-center mb-8">
            <p className="text-sm mb-2">
              {!gameStarted ? "Unscramble the word and press enter to begin" : "Unscramble this word:"}
            </p>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={scrambledWord}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-bloomwell-purple/10 py-8 px-4 rounded-lg text-center"
              >
                <h2 className="text-4xl font-bold tracking-wider">
                  {scrambledWord}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                className={`text-center text-lg ${
                  feedback === "correct" ? "border-green-500" :
                  feedback === "incorrect" ? "border-red-500" : ""
                }`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer"
                autoComplete="off"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Submit Answer
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
          <p className="mb-6">Final Score: {score}</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
};

export default WordScramble;
