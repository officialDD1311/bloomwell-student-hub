
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ReactionGameProps {
  onComplete: (score: number) => void;
}

type GameState = "waiting" | "ready" | "clicked" | "tooEarly" | "complete";

const ReactionGame = ({ onComplete }: ReactionGameProps) => {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const maxAttempts = 5;

  const startGame = useCallback(() => {
    setGameState("waiting");
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          prepareTarget();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const prepareTarget = useCallback(() => {
    // Random delay between 1-4 seconds
    const delay = Math.floor(Math.random() * 3000) + 1000;
    
    const timeout = setTimeout(() => {
      setStartTime(Date.now());
      setGameState("ready");
    }, delay);
    
    setTimeoutId(timeout);
  }, []);

  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutId) clearTimeout(timeoutId);
      setGameState("tooEarly");
      setTimeout(() => {
        startGame();
      }, 1500);
    } else if (gameState === "ready") {
      // Good click - record reaction time
      const endTime = Date.now();
      const time = startTime ? endTime - startTime : 0;
      setReactionTime(time);
      setAttempts(prev => [...prev, time]);
      setGameState("clicked");
      
      setTimeout(() => {
        if (attempts.length + 1 >= maxAttempts) {
          setGameState("complete");
          const avgTime = [...attempts, time].reduce((a, b) => a + b, 0) / (attempts.length + 1);
          // Score is inversely proportional to reaction time - faster is better
          const score = Math.round(1000 - avgTime);
          onComplete(Math.max(score, 100));
        } else {
          startGame();
        }
      }, 1500);
    }
  };

  useEffect(() => {
    startGame();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [startGame, timeoutId]);

  const getBgColor = () => {
    switch (gameState) {
      case "waiting": return "bg-muted";
      case "ready": return "bg-green-500";
      case "clicked": return "bg-blue-500";
      case "tooEarly": return "bg-red-500";
      case "complete": return "bg-purple-500";
      default: return "bg-muted";
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case "waiting": 
        return countdown > 0 ? `Get Ready... ${countdown}` : "Wait for green...";
      case "ready": 
        return "Click Now!";
      case "clicked": 
        return `${reactionTime}ms`;
      case "tooEarly": 
        return "Too early! Wait for green.";
      case "complete": 
        return "Game Complete!";
      default: 
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md">
        <motion.div
          className={`w-full aspect-[2/1] rounded-xl ${getBgColor()} flex items-center justify-center cursor-pointer`}
          onClick={handleClick}
          animate={{
            scale: gameState === "ready" ? [1, 1.02, 1] : 1
          }}
          transition={{
            repeat: gameState === "ready" ? Infinity : 0,
            duration: 0.5
          }}
        >
          <h3 className="text-xl font-bold text-white">{getMessage()}</h3>
        </motion.div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span>Attempt</span>
          <span>Reaction Time</span>
        </div>
        
        <div className="space-y-2">
          {attempts.map((time, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-background/50 p-2 rounded"
            >
              <span>#{index + 1}</span>
              <span>{time}ms</span>
            </div>
          ))}
          
          {Array.from({ length: maxAttempts - attempts.length }).map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="flex justify-between items-center bg-muted/30 p-2 rounded text-muted-foreground"
            >
              <span>#{attempts.length + index + 1}</span>
              <span>-</span>
            </div>
          ))}
        </div>
      </div>
      
      {gameState === "complete" && (
        <div className="text-center">
          <p className="mb-4">
            Average: <strong>
              {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms
            </strong>
          </p>
          <Button onClick={() => {
            setAttempts([]);
            setGameState("waiting");
            startGame();
          }}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReactionGame;
