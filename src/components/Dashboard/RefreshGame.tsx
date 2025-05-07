
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MemoryMatch from "../Games/MemoryMatch";
import ReactionGame from "../Games/ReactionGame";
import ColorMatch from "../Games/ColorMatch";
import WordScramble from "../Games/WordScramble";
import MathChallenge from "../Games/MathChallenge";
import PatternMemory from "../Games/PatternMemory";

const games = [
  { 
    id: "memory", 
    name: "Memory Match",
    description: "Test your visual memory by matching pairs of cards", 
    component: MemoryMatch,
    color: "bg-bloomwell-purple/10"
  },
  { 
    id: "reaction", 
    name: "Reaction Time",
    description: "Test your reaction speed by clicking when the color changes", 
    component: ReactionGame,
    color: "bg-bloomwell-green/10"
  },
  { 
    id: "color", 
    name: "Color Match",
    description: "Check if the color name matches the actual color", 
    component: ColorMatch,
    color: "bg-bloomwell-blue/10"
  },
  { 
    id: "word", 
    name: "Word Scramble",
    description: "Unscramble words to test your language skills", 
    component: WordScramble,
    color: "bg-bloomwell-yellow/10"
  },
  { 
    id: "math", 
    name: "Math Challenge",
    description: "Solve quick math problems to stimulate your brain", 
    component: MathChallenge,
    color: "bg-bloomwell-purple/10"
  },
  { 
    id: "pattern", 
    name: "Pattern Memory",
    description: "Remember and reproduce patterns to boost memory", 
    component: PatternMemory,
    color: "bg-bloomwell-green/10"
  }
];

const RefreshGame = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGameComplete = (score: number) => {
    toast({
      title: "Game Completed!",
      description: `Great job! Your score: ${score}`,
    });
  };

  return (
    <Card className="w-full glass-card border-none">
      <CardHeader>
        <CardTitle>Brain Refresh Games</CardTitle>
        <CardDescription>Take a 5-minute brain break with these mini-games</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`${game.color} rounded-xl p-6 cursor-pointer`}
                onClick={() => setSelectedGame(game.id)}
              >
                <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {games.find(g => g.id === selectedGame)?.name}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedGame(null)}
              >
                Back to Games
              </Button>
            </div>
            
            {selectedGame === "memory" && <MemoryMatch onComplete={handleGameComplete} />}
            {selectedGame === "reaction" && <ReactionGame onComplete={handleGameComplete} />}
            {selectedGame === "color" && <ColorMatch onComplete={handleGameComplete} />}
            {selectedGame === "word" && <WordScramble onComplete={handleGameComplete} />}
            {selectedGame === "math" && <MathChallenge onComplete={handleGameComplete} />}
            {selectedGame === "pattern" && <PatternMemory onComplete={handleGameComplete} />}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default RefreshGame;
