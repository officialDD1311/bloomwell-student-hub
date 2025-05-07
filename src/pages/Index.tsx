
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/Auth/AuthPage";
import Dashboard from "@/components/Dashboard/Dashboard";
import { motion } from "framer-motion";

// Main component that uses the auth context
const Index = () => {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-bloomwell-purple mb-2">BloomWell</h1>
          <p className="text-lg text-gray-600">Your Student Wellness Hub</p>
        </motion.div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

export default Index;
