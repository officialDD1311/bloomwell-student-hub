
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { ThemeToggle } from "../Theme/ThemeToggle";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen w-full gradient-bg flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md mb-8 text-center">
        <div className="mb-6 animate-bloom">
          <h1 className="text-5xl font-bold text-bloomwell-purple-dark dark:text-bloomwell-purple tracking-tight mb-2">
            BloomWell
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Your Student Wellness Hub</p>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <SignupForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
