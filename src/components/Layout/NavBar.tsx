
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { 
  Bell, 
  Settings, 
  Heart, 
  User, 
  CircleUser, 
  LogOut, 
  MessageSquare, 
  BookOpen,
  FileText
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../Theme/ThemeToggle";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState<string[]>([
    "Don't forget to track your mood today!",
    "You have 2 tasks due today"
  ]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full py-2 px-4 glass border-b sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-bloomwell-purple">BloomWell</Link>
            
            <nav className="hidden md:flex ml-8">
              <ul className="flex items-center space-x-4">
                <li>
                  <Link to="/" className="px-3 py-2 hover:text-bloomwell-purple transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/social-welfare" className="px-3 py-2 hover:text-bloomwell-purple transition-colors">Social Welfare</Link>
                </li>
                <li>
                  <Link to="/chatbot" className="px-3 py-2 hover:text-bloomwell-purple transition-colors">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Chatbot</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/student" className="px-3 py-2 hover:text-bloomwell-purple transition-colors">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Student</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-bloomwell-purple text-xs flex items-center justify-center text-white">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification, i) => (
                  <DropdownMenuItem key={i} className="py-2">
                    {notification}
                  </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                  <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.name || ""} />
                    <AvatarFallback className="bg-bloomwell-purple text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CircleUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/student')}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Documents</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
