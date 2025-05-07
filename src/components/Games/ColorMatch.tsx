
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ColorMatchProps {
  onComplete: (score: number) => void;
}

interface ColorQuestion {
  text: string;
  color: string;
  correctAnswer: boolean;
}

const colors = [
  { name: "Red", value: "text-red-500" },
  { name: "Blue", value: "text-blue-500" },
  { name: "Green", value: "text-green-500" },
  { name: "Yellow", value: "text-yellow-500" },
  { name: "Purple", value: "text-purple-500" },
  { name: "Orange", value: "text-orange-500" },
];

const ColorMatch = ({ onComplete }: ColorMatchProps) => {
  const [questions, setQuestions] = useState<ColorQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  const generateQuestions = useCallback(() => {
    const newQuestions: ColorQuestion[] = [];
    
    for (let i = 0; i < 20; i++) {
      const textColorIndex = Math.floor(Math.random() * colors.length);
      let displayColorIndex = Math.floor(Math.random() * colors.length);
      
      // 50% chance the color matches the text
      const shouldMatch = Math.random() > 0.5;
      
      if (shouldMatch) {
        displayColorIndex = textColorIndex;
      }
      
      newQuestions.push({
        text: colors[textColorIndex].name,
        color: colors[displayColorIndex].value,
        correctAnswer: textColorIndex === displayColorIndex,
      });
    }
    
    return newQuestions;
  }, []);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, [generateQuestions]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            onComplete(score);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, score, onComplete]);

  const handleAnswer = (answer: boolean) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 10);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setGameOver(true);
      onComplete(score);
    }
  };

  const resetGame = () => {
    setQuestions(generateQuestions());
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(30);
    setGameStarted(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full flex justify-between items-center">
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
              {!gameStarted ? "Does the color match the word? Press Yes or No to begin." : 
                "Does the word's color match its meaning?"}
            </p>
            
            {questions[currentIndex] && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center h-32"
              >
                <h2 className={`text-4xl font-bold ${questions[currentIndex].color}`}>
                  {questions[currentIndex].text}
                </h2>
              </motion.div>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button 
              className="bg-red-500 hover:bg-red-600 px-8"
              onClick={() => handleAnswer(false)}
            >
              No
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 px-8"
              onClick={() => handleAnswer(true)}
            >
              Yes
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
          <p className="mb-2">Final Score: {score}</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
      
      <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-bloomwell-purple" 
          style={{ width: `${(currentIndex / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ColorMatch;
