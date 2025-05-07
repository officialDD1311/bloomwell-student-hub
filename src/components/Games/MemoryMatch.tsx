
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Tile = {
  id: number;
  color: string;
  revealed: boolean;
  matched: boolean;
};

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-orange-400",
];

interface MemoryMatchProps {
  onComplete: (score: number) => void;
}

const MemoryMatch = ({ onComplete }: MemoryMatchProps) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedTiles, setFlippedTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateTiles = () => {
    const newTiles: Tile[] = [];
    const colorPairs = [...colors, ...colors];
    
    // Shuffle the colors
    for (let i = colorPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorPairs[i], colorPairs[j]] = [colorPairs[j], colorPairs[i]];
    }
    
    // Generate tiles with shuffled colors
    colorPairs.forEach((color, index) => {
      newTiles.push({
        id: index,
        color,
        revealed: false,
        matched: false,
      });
    });
    
    return newTiles;
  };

  useEffect(() => {
    setTiles(generateTiles());
  }, []);

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameCompleted]);

  useEffect(() => {
    if (flippedTiles.length === 2) {
      const firstTile = tiles[flippedTiles[0]];
      const secondTile = tiles[flippedTiles[1]];

      if (firstTile.color === secondTile.color) {
        // Match found
        setTiles(prevTiles =>
          prevTiles.map((tile, index) =>
            flippedTiles.includes(index) ? { ...tile, matched: true } : tile
          )
        );
        setFlippedTiles([]);
      } else {
        // No match, hide after delay
        const timeout = setTimeout(() => {
          setTiles(prevTiles =>
            prevTiles.map((tile, index) =>
              flippedTiles.includes(index) ? { ...tile, revealed: false } : tile
            )
          );
          setFlippedTiles([]);
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
      
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedTiles, tiles]);
  
  useEffect(() => {
    if (gameStarted && tiles.every(tile => tile.matched)) {
      setGameCompleted(true);
      // Calculate score - lower moves and time is better
      const score = Math.max(1000 - (moves * 10 + timeElapsed * 2), 100);
      onComplete(score);
    }
  }, [tiles, moves, gameStarted, timeElapsed, onComplete]);

  const handleTileClick = (index: number) => {
    // Prevent clicking if already two tiles are flipped or this tile is already flipped
    if (flippedTiles.length === 2 || tiles[index].revealed || tiles[index].matched) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    // Reveal the tile
    setTiles(prevTiles =>
      prevTiles.map((tile, i) =>
        i === index ? { ...tile, revealed: true } : tile
      )
    );
    
    // Add to flipped tiles
    setFlippedTiles(prev => [...prev, index]);
  };

  const resetGame = () => {
    setTiles(generateTiles());
    setFlippedTiles([]);
    setMoves(0);
    setGameCompleted(false);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-4">
          <span className="text-sm font-medium bg-bloomwell-purple/10 px-3 py-1 rounded-full">
            Moves: {moves}
          </span>
          <span className="text-sm font-medium bg-bloomwell-green/10 px-3 py-1 rounded-full">
            Time: {timeElapsed}s
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetGame}
        >
          Reset Game
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {tiles.map((tile, index) => (
          <motion.div
            key={tile.id}
            whileHover={{ scale: tile.revealed || tile.matched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="aspect-square"
            onClick={() => handleTileClick(index)}
          >
            <motion.div 
              className={`w-full h-full rounded-lg cursor-pointer transition-all duration-300 transform flex items-center justify-center ${
                tile.revealed || tile.matched 
                  ? `${tile.color}` 
                  : 'bg-bloomwell-purple'
              }`}
              initial={false}
              animate={{
                rotateY: tile.revealed || tile.matched ? 0 : 180,
                opacity: tile.matched ? 0.7 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {(tile.revealed || tile.matched) && (
                <span className="text-white text-xl">
                  {/* Icon or symbol could go here */}
                </span>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {gameCompleted && (
        <div className="text-center mt-6">
          <h3 className="text-xl font-semibold text-bloomwell-purple">
            Congratulations!
          </h3>
          <p className="mb-4">
            You completed the game in {moves} moves and {timeElapsed} seconds.
          </p>
          <Button onClick={resetGame}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
