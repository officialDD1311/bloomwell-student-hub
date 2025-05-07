
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Quote {
  text: string;
  author: string;
}

const quotes = [
  {
    text: "No act of kindness, no matter how small, is ever wasted.",
    author: "Aesop"
  },
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Life's most persistent and urgent question is, 'What are you doing for others?'",
    author: "Martin Luther King Jr."
  },
  {
    text: "We rise by lifting others.",
    author: "Robert Ingersoll"
  },
  {
    text: "Alone we can do so little; together we can do so much.",
    author: "Helen Keller"
  }
];

const SocialWelfare = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    // In a real app, we would fetch from Firestore
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Social Welfare Initiatives</h1>
          
          <Card className="glass-card mb-10">
            <CardHeader>
              <CardTitle>Quote for Social Wellbeing</CardTitle>
              <CardDescription>Inspiring thoughts for a better community</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="italic text-lg mb-2">"{quote.text}"</blockquote>
              <cite className="text-sm text-muted-foreground">— {quote.author}</cite>
            </CardContent>
          </Card>
          
          <motion.div
            className="glass-card p-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Join Our Blood Donation Program</h2>
            <p className="mb-6">
              Your single donation can save up to three lives. Join our community of donors and 
              help those in need. Each donation earns you a "Slug" which can be redeemed if you 
              or someone you know needs blood.
            </p>
            <Button 
              onClick={() => navigate('/blood-donor')}
              className="bg-bloomwell-purple hover:bg-bloomwell-purple-dark gap-2"
              size="lg"
            >
              <Heart className="h-5 w-5" />
              Become a Blood Donor
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SocialWelfare;
