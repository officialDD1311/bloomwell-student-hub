
import { useState } from "react";
import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";
import { 
  SidebarProvider, 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  FilePlus, 
  Calendar, 
  Clock, 
  BookOpen, 
  Trash2,
  Download,
  FileUp,
  Search,
  PlusCircle,
  FolderPlus,
  AlarmClock,
  StickyNote,
  Upload,
  ChevronRight
} from "lucide-react";
import FileManager from "@/components/Student/FileManager";
import LectureScheduler from "@/components/Student/LectureScheduler";
import StudentNotes from "@/components/Student/StudentNotes";

// Define file types
const FileTypes = {
  PDF: "pdf",
  DOC: "doc",
  IMAGE: "image",
  NOTE: "note",
  PPT: "ppt"
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("files");
  const { toast } = useToast();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="flex justify-center py-4">
            <h3 className="font-bold text-lg">Student Hub</h3>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Resources</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "files"} 
                    onClick={() => setActiveTab("files")}
                    tooltip="Files"
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Files</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "schedule"} 
                    onClick={() => setActiveTab("schedule")}
                    tooltip="Schedule"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Lecture Schedule</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === "notes"} 
                    onClick={() => setActiveTab("notes")}
                    tooltip="Notes"
                  >
                    <StickyNote className="h-4 w-4" />
                    <span>Study Notes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => toast({ title: "Creating new note..." })}>
                    <FilePlus className="h-4 w-4" />
                    <span>New Note</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => toast({ title: "Upload dialog opening..." })}>
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => toast({ title: "Adding new lecture..." })}>
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Lecture</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="pb-4 px-2">
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("schedule")}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Upcoming Lectures</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
      
        <SidebarInset className="gradient-bg">
          <NavBar />
          
          <div className="container mx-auto px-4 py-6 max-w-screen-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Student Resources</h2>
              <p className="text-muted-foreground">Manage your files, lectures, and study materials</p>
            </div>
            
            {activeTab === "files" && <FileManager />}
            {activeTab === "schedule" && <LectureScheduler />}
            {activeTab === "notes" && <StudentNotes />}
          </div>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
