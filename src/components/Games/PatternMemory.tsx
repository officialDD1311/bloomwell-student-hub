
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PatternMemoryProps {
  onComplete: (score: number) => void;
}

const PatternMemory = ({ onComplete }: PatternMemoryProps) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<"ready" | "watching" | "repeating" | "success" | "failed" | "complete">("ready");
  const [score, setScore] = useState(0);
  
  const gridSize = 9; // 3x3 grid
  
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", 
    "bg-yellow-500", "bg-purple-500", "bg-pink-500", 
    "bg-indigo-500", "bg-orange-500", "bg-emerald-500"
  ];

  // Generate a random pattern for the current level
  const generatePattern = () => {
    const newPattern = [];
    for (let i = 0; i < level + 2; i++) {
      newPattern.push(Math.floor(Math.random() * gridSize));
    }
    return newPattern;
  };

  // Show the pattern to the player
  const showPattern = async () => {
    setGameStatus("watching");
    setIsShowingPattern(true);
    
    // Show each cell in sequence
    for (let i = 0; i < pattern.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveCell(pattern[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveCell(null);
    }
    
    setIsShowingPattern(false);
    setGameStatus("repeating");
  };

  // Handle player clicking a cell
  const handleCellClick = (index: number) => {
    if (gameStatus !== "repeating") return;
    
    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);
    
    // Check if player's pattern matches so far
    const currentIndex = newPlayerPattern.length - 1;
    if (pattern[currentIndex] !== newPlayerPattern[currentIndex]) {
      // Pattern doesn't match
      setGameStatus("failed");
      onComplete(score);
      return;
    }
    
    // Check if player completed the pattern
    if (newPlayerPattern.length === pattern.length) {
      // Pattern completed successfully
      setScore(prevScore => prevScore + (level * 10));
      
      if (level >= 10) {
        setGameStatus("complete");
        onComplete(score + (level * 10));
      } else {
        setGameStatus("success");
        setTimeout(() => {
          setLevel(prevLevel => prevLevel + 1);
          setPlayerPattern([]);
          setGameStatus("ready");
        }, 1000);
      }
    }
  };

  // Start a new game
  const startGame = () => {
    setLevel(1);
    setScore(0);
    setPlayerPattern([]);
    setGameStatus("ready");
  };

  // Start next level
  const startNextLevel = () => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    showPattern();
  };

  // When level changes, generate a new pattern
  useEffect(() => {
    if (gameStatus === "ready") {
      const newPattern = generatePattern();
      setPattern(newPattern);
    }
  }, [level, gameStatus]);

  // Render the 3x3 grid
  const renderGrid = () => {
    return Array.from({ length: gridSize }).map((_, index) => {
      const isActive = activeCell === index;
      const isPlayerSelected = playerPattern.includes(index) && gameStatus === "repeating";
      
      return (
        <motion.div
          key={index}
          whileHover={{ scale: gameStatus === "repeating" ? 1.05 : 1 }}
          whileTap={{ scale: gameStatus === "repeating" ? 0.95 : 1 }}
          className={`aspect-square rounded-lg cursor-pointer ${
            isActive || isPlayerSelected 
              ? colors[index % colors.length]
              : 'bg-muted hover:bg-muted/80'
          }`}
          onClick={() => handleCellClick(index)}
        />
      );
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div className="bg-background/70 px-4 py-2 rounded-full">
          <span className="font-semibold">Level: {level}/10</span>
        </div>
        <div className="bg-background/70 px-4 py-2 rounded-full">
          <span className="font-semibold">Score: {score}</span>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">
          {gameStatus === "ready" && "Get ready to memorize the pattern!"}
          {gameStatus === "watching" && "Watch carefully..."}
          {gameStatus === "repeating" && "Now repeat the pattern!"}
          {gameStatus === "success" && "Great job! Get ready for the next level."}
          {gameStatus === "failed" && "Game over! Try again."}
          {gameStatus === "complete" && "Congratulations! You completed all levels!"}
        </h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {renderGrid()}
      </div>
      
      <div className="flex justify-center">
        {gameStatus === "ready" && (
          <Button onClick={showPattern}>Start Level</Button>
        )}
        
        {(gameStatus === "failed" || gameStatus === "complete") && (
          <Button onClick={startGame}>Play Again</Button>
        )}
        
        {gameStatus === "success" && (
          <Button onClick={startNextLevel}>Next Level</Button>
        )}
      </div>
      
      {gameStatus === "repeating" && (
        <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-bloomwell-purple" 
            style={{ width: `${(playerPattern.length / pattern.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PatternMemory;
