
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    await login(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card backdrop-blur-md animate-scale-in border-2 border-white/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your details to sign in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/80 border-white/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Button variant="link" size="sm" className="text-sm text-bloomwell-purple px-0">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background/80 border-white/30 text-foreground pr-10 placeholder:text-muted-foreground"
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <Button 
            type="submit" 
            className="w-full bg-bloomwell-purple hover:bg-bloomwell-purple-dark font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" onClick={onToggleForm} className="text-bloomwell-purple p-0">
              Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
