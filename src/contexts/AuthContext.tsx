
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define our context types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<any>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize the auth state and set up listeners
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Logged in",
            description: "You've successfully signed in!",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out",
            description: "You've been signed out.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Auth state is updated by the listener
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Use Supabase authentication with user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // If email confirmation is required
      if (!data.session) {
        toast({
          title: "Check your email",
          description: "A confirmation link has been sent to your email address.",
        });
      }
      
      // Auth state is updated by the listener
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state is updated by the listener
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get user profile
  const getProfile = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
