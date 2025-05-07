
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  onToggleForm: () => void;
}

const SignupForm = ({ onToggleForm }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading } = useAuth();
  const { toast } = useToast();

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value || e.target.value === "");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    await signup(name, email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto gradient-card bloom-shadow animate-scale-in border-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to register with BloomWell
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/50 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="••••••••"
              className={`bg-white/50 ${!passwordMatch ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {!passwordMatch && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-bloomwell-purple hover:bg-bloomwell-purple-dark"
            disabled={loading || !passwordMatch}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" onClick={onToggleForm} className="text-bloomwell-purple p-0">
              Sign in
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignupForm;
