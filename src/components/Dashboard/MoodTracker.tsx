import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import EmojiButton from "@/components/ui/EmojiButton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MoodOption {
  emoji: string;
  label: string;
  message: string;
}

const moodOptions: MoodOption[] = [
  { emoji: "😄", label: "Happy", message: "That's wonderful! Keep that positive energy flowing." },
  { emoji: "😊", label: "Good", message: "Great to hear you're doing well today!" },
  { emoji: "😐", label: "Okay", message: "Remember that it's okay to have average days too." },
  { emoji: "😔", label: "Sad", message: "It's okay to feel down. Take some time for self-care today." },
  { emoji: "😠", label: "Angry", message: "Take a deep breath. It's okay to feel frustrated sometimes." }
];

const getMotivationalQuote = (mood: string) => {
  const quotes = {
    "Happy": "The only way to do great work is to love what you do.",
    "Good": "Believe you can and you're halfway there.",
    "Okay": "Every day may not be good, but there's something good in every day.",
    "Sad": "This feeling, like all feelings, will pass. Be gentle with yourself today.",
    "Angry": "You are braver than you believe, stronger than you seem, and smarter than you think."
  };
  return quotes[mood as keyof typeof quotes] || quotes["Okay"];
};

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: string;
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load mood history from Supabase on component mount
  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching mood history:", error);
          return;
        }
        
        if (data) {
          setMoodHistory(data.map(entry => ({
            id: entry.id,
            mood: entry.mood,
            note: entry.note || '',
            timestamp: entry.timestamp
          })));
        }
      } catch (error) {
        console.error("Failed to fetch mood history:", error);
      }
    };
    
    fetchMoodHistory();
  }, [user]);

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    setQuote(getMotivationalQuote(label));
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "No mood selected",
        description: "Please select how you're feeling today",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to track your mood",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Save mood entry to Supabase
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          note: note,
        })
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update local state with the new entry
      const newEntry: MoodEntry = {
        id: data.id,
        mood: selectedMood,
        note: note,
        timestamp: data.timestamp
      };
      
      setMoodHistory([newEntry, ...moodHistory]);
      
      toast({
        title: "Mood tracked!",
        description: "Your mood has been recorded successfully.",
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Failed to save mood",
        description: "There was an error saving your mood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setNote("");
    setQuote("");
    setSubmitted(false);
  };

  return (
    <Card className="w-full bloom-shadow border-none bg-white">
      <CardHeader className="bg-white text-black rounded-t-md">
        <CardTitle className="text-black">How are you feeling today?</CardTitle>
        <CardDescription className="text-gray-600">Track your mood and reflect on your day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 bg-white">
        {!submitted ? (
          <>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <EmojiButton
                  key={option.label}
                  emoji={option.emoji}
                  label={option.label}
                  selected={selectedMood === option.label}
                  onClick={() => handleMoodSelect(option.label)}
                />
              ))}
            </div>

            {selectedMood && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="p-4 bg-bloomwell-purple/10 rounded-lg border border-bloomwell-purple/20">
                  <p className="text-sm font-medium text-black">{quote}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black">Add a note (optional)</p>
                  <Textarea
                    placeholder="How was your day? What's on your mind?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="resize-none bg-white/90 border-gray-300 text-black min-h-[100px]"
                  />
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 space-y-4 text-black"
          >
            <div className="text-5xl mb-2">
              {moodOptions.find(m => m.label === selectedMood)?.emoji || "✅"}
            </div>
            <h3 className="text-xl font-medium text-black">Mood Tracked: {selectedMood}</h3>
            {note && (
              <div className="bg-white/90 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-black">{note}</p>
              </div>
            )}
            <p className="italic text-sm text-black">{quote}</p>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="bg-white rounded-b-md">
        {!submitted ? (
          <Button 
            className="w-full bg-bloomwell-purple hover:bg-bloomwell-purple-dark text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button 
            className="w-full bg-bloomwell-green hover:bg-bloomwell-green-dark text-white"
            onClick={handleReset}
          >
            Track Another Mood
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
