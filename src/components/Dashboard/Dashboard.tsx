
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodTracker from "./MoodTracker";
import TaskScheduler from "./TaskScheduler";
import RefreshGame from "./RefreshGame";
import Quote from "./Quote";
import NavBar from "../Layout/NavBar";
import Footer from "../Layout/Footer";
import { motion } from "framer-motion";
import { ThemeToggle } from "../Theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, BookOpen, Settings } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("mood");

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6 max-w-screen-lg flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome to BloomWell</h2>
            <p className="text-muted-foreground">Your student wellness companion</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/chatbot">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat Assistant</span>
              </Button>
            </Link>
            <Link to="/student">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Study Hub</span>
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass grid grid-cols-4 mb-6">
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="refresh">Refresh</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <TabsContent value="mood" className="mt-0">
              <MoodTracker />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              <TaskScheduler />
            </TabsContent>
            
            <TabsContent value="refresh" className="mt-0">
              <RefreshGame />
            </TabsContent>
            
            <TabsContent value="wellness" className="mt-0">
              <Quote />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
