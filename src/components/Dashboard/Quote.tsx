
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const quotes = [
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
    author: "Lori Deschene"
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience.",
    author: "Unknown"
  },
  {
    text: "Be gentle with yourself, you're doing the best you can.",
    author: "Unknown"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  },
  {
    text: "You are not alone. You are seen. You are heard. You are loved.",
    author: "Unknown"
  }
];

const Quote = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const [fadeIn, setFadeIn] = useState(true);

  const getRandomQuote = () => {
    const currentQuoteIndex = quotes.findIndex(q => q.text === quote.text);
    let newIndex;
    
    // Make sure we get a different quote
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    
    return quotes[newIndex];
  };

  const handleNewQuote = () => {
    setFadeIn(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFadeIn(true);
    }, 300);
  };

  // Get a random quote on initial load
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <Card className="w-full bloom-shadow border-none">
      <CardHeader>
        <CardTitle>Daily Inspiration</CardTitle>
        <CardDescription>Quotes to nurture your well-being</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <motion.div
          animate={{ opacity: fadeIn ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-bloomwell-purple/10 rounded-xl"
        >
          <blockquote className="text-lg italic mb-2">"{quote.text}"</blockquote>
          <cite className="text-sm text-muted-foreground">— {quote.author}</cite>
        </motion.div>
        
        <Button
          variant="outline"
          className="border-bloomwell-purple text-bloomwell-purple hover:bg-bloomwell-purple/10"
          onClick={handleNewQuote}
        >
          New Quote
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quote;
