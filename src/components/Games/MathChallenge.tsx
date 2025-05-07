
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface MathChallengeProps {
  onComplete: (score: number) => void;
}

interface Problem {
  question: string;
  answer: number;
}

const MathChallenge = ({ onComplete }: MathChallengeProps) => {
  const [problem, setProblem] = useState<Problem>({ question: "", answer: 0 });
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [streak, setStreak] = useState(0);

  const generateProblem = useCallback(() => {
    // Generate random numbers based on current score difficulty
    const difficulty = Math.min(Math.floor(score / 50) + 1, 4);
    const operations = ['+', '-', '*'];
    
    let num1, num2, operation, answer;
    
    // Scale difficulty based on score
    switch (difficulty) {
      case 1:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = operations[Math.floor(Math.random() * 2)]; // Only + and -
        break;
      case 2:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = operations[Math.floor(Math.random() * 3)]; // All operations
        break;
      case 3:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
        operation = operations[Math.floor(Math.random() * 3)];
        break;
      default:
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 25) + 1;
        operation = operations[Math.floor(Math.random() * 3)];
    }
    
    // Ensure the answer is positive for subtraction
    if (operation === '-' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }
    
    // Calculate the answer
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }
    
    const question = `${num1} ${operation} ${num2} = ?`;
    
    return { question, answer };
  }, [score]);

  useEffect(() => {
    setProblem(generateProblem());
  }, [generateProblem]);

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
    
    const userAnswer = parseFloat(userInput);
    
    if (userAnswer === problem.answer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Bonus points for streaks
      const streakBonus = Math.floor(newStreak / 3) * 5;
      setScore(prev => prev + 10 + streakBonus);
      
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        setUserInput("");
        setProblem(generateProblem());
      }, 800);
    } else {
      setStreak(0);
      setFeedback("incorrect");
      setTimeout(() => {
        setFeedback("");
        setUserInput("");
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
    setStreak(0);
    setProblem(generateProblem());
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
        {streak >= 3 && (
          <div className="bg-bloomwell-purple/20 px-4 py-2 rounded-full">
            <span className="font-semibold">Streak: {streak}🔥</span>
          </div>
        )}
      </div>
      
      {!gameOver ? (
        <>
          <div className="text-center mb-8">
            <p className="text-sm mb-2">
              {!gameStarted ? "Solve the equation and press enter to begin" : "Solve this equation:"}
            </p>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={problem.question}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="bg-bloomwell-purple/10 py-8 px-4 rounded-lg text-center"
              >
                <h2 className="text-4xl font-bold">
                  {problem.question}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="number"
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

export default MathChallenge;
