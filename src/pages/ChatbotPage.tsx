
import { useState, useRef, useEffect } from "react";
import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare, Send, ArrowDown, AlertCircle, Bot, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your BloomWell assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Check localStorage for API key
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setUseOpenAI(true);
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      setUseOpenAI(true);
      setShowApiKeyDialog(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved.",
      });
    }
  };

  // Clear API key
  const clearApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setUseOpenAI(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed.",
    });
  };

  // Get AI response from OpenAI API
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      if (!apiKey) {
        return "I need an OpenAI API key to use the AI features. Please set up your API key in the settings.";
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful student assistant named BloomWell. Provide concise, accurate information to help students with their studies, wellness, and time management. Keep responses brief and friendly."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        return "Sorry, there was an error connecting to the AI service. Please try again later.";
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "Sorry, there was an error connecting to the AI service. Please try again later.";
    }
  };

  // Get simple pre-defined response (fallback)
  const getSimpleResponse = (userInput: string): string => {
    const botResponses: Record<string, string> = {
      "hi": "Hello! How can I help you today?",
      "hello": "Hi there! What can I assist you with?",
      "how are you": "I'm just a digital assistant, but I'm functioning well! How can I help you?",
      "what can you do": "I can answer questions about student life, help with wellness tips, remind you of tasks, and provide information about BloomWell's features.",
      "help": "I can assist with various topics. Try asking about wellness tips, task management, or study techniques!",
    };
    
    // Check if we have a predefined response for this input
    let responseText = "I'm not sure how to respond to that yet. As an AI assistant, I'm still learning. Can I help you with something else?";
    
    const normalizedInput = userInput.toLowerCase();
    
    // Check if any key words are in the input
    Object.keys(botResponses).forEach(key => {
      if (normalizedInput.includes(key)) {
        responseText = botResponses[key];
      }
    });
    
    // If question contains study or learning
    if (normalizedInput.includes("study") || normalizedInput.includes("learn")) {
      responseText = "For effective studying, try the Pomodoro technique - 25 minutes of focused study followed by a 5-minute break. You can also check out our Student Dashboard for more resources!";
    }
    
    // If question contains stress or anxiety
    if (normalizedInput.includes("stress") || normalizedInput.includes("anxiety") || normalizedInput.includes("worried")) {
      responseText = "I'm sorry to hear you're feeling this way. Try deep breathing exercises or meditation. BloomWell's Mood Tracker can also help you monitor your emotional well-being.";
    }
    
    return responseText;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    let responseText = "";
    
    if (useOpenAI && apiKey) {
      // Get response from OpenAI API
      responseText = await getAIResponse(input.trim());
    } else {
      // Use simple pre-defined responses
      responseText = getSimpleResponse(input.trim());
    }
    
    // Add slight delay to simulate thinking/typing
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl flex-grow flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            BloomWell Assistant
          </h2>
          
          <div className="flex items-center gap-2">
            <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  API Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>OpenAI API Settings</DialogTitle>
                  <DialogDescription>
                    Enter your OpenAI API key to enable AI-powered responses.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="use-openai" 
                      checked={useOpenAI && !!apiKey}
                      onCheckedChange={(checked) => setUseOpenAI(checked && !!apiKey)}
                      disabled={!apiKey}
                    />
                    <Label htmlFor="use-openai">Use OpenAI for responses</Label>
                  </div>
                  
                  {apiKey && (
                    <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Your API key is stored only in your browser. Using OpenAI will incur charges to your OpenAI account.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <DialogFooter className="flex justify-between">
                  {apiKey && (
                    <Button variant="outline" onClick={clearApiKey}>
                      Clear API Key
                    </Button>
                  )}
                  <Button onClick={saveApiKey} disabled={!apiKey}>
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {useOpenAI && (
              <Card className="bg-green-50 text-green-800 border-green-200">
                <CardContent className="p-2 text-xs flex items-center">
                  <Bot className="h-3 w-3 mr-1" />
                  AI Mode
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="glass-card flex-grow flex flex-col p-4 mb-4 relative">
          <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
            <div className="space-y-4 min-h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                      message.sender === "user"
                        ? "bg-bloomwell-purple text-white"
                        : "glass"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt="BloomWell Assistant" />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            BW
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1">
                        <div className="break-words">{message.content}</div>
                        <div
                          className={`text-xs ${
                            message.sender === "user"
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt="User" />
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 shadow-sm glass">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          BW
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex gap-1">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse delay-100">●</span>
                        <span className="animate-pulse delay-200">●</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-4 rounded-full shadow-md bg-background opacity-70 hover:opacity-100"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          
          <div className="mt-4 flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow shadow-sm"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatbotPage;
