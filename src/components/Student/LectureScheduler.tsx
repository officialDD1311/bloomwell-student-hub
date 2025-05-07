
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Trash2,
  Edit,
  Plus,
  Bell,
  AlarmClock
} from "lucide-react";

// Interface for lecture objects
interface Lecture {
  id: string;
  title: string;
  course: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  reminder: boolean;
  reminderTime: string;
  color: string;
}

// Sample lecture data
const sampleLectures: Lecture[] = [
  {
    id: "1",
    title: "Introduction to Physics",
    course: "PHYS101",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:30",
    location: "Science Block, Room 203",
    description: "Fundamentals of motion and energy",
    reminder: true,
    reminderTime: "15",
    color: "bg-blue-500"
  },
  {
    id: "2",
    title: "Advanced Calculus",
    course: "MATH301",
    date: addDays(new Date(), 1),
    startTime: "11:00",
    endTime: "12:30",
    location: "Mathematics Department, Room 105",
    description: "Integration techniques and applications",
    reminder: true,
    reminderTime: "30",
    color: "bg-green-500"
  },
  {
    id: "3",
    title: "Literature Studies",
    course: "LIT205",
    date: addDays(new Date(), 2),
    startTime: "14:00",
    endTime: "15:30",
    location: "Arts Building, Room A12",
    description: "Modern poetry analysis",
    reminder: false,
    reminderTime: "15",
    color: "bg-purple-500"
  },
  {
    id: "4",
    title: "Computer Science Seminar",
    course: "CS400",
    date: addDays(new Date(), 2),
    startTime: "16:00",
    endTime: "17:30",
    location: "Tech Center, Auditorium B",
    description: "Guest lecture on AI advancements",
    reminder: true,
    reminderTime: "60",
    color: "bg-red-500"
  },
];

// Time slot options for scheduling
const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

// Reminder time options
const reminderTimes = [
  { value: "5", label: "5 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" }
];

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-pink-500", label: "Pink" }
];

const LectureScheduler = () => {
  const [lectures, setLectures] = useState<Lecture[]>(sampleLectures);
  const [date, setDate] = useState<Date>(new Date());
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [newLecture, setNewLecture] = useState<Partial<Lecture>>({
    title: "",
    course: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:30",
    location: "",
    description: "",
    reminder: true,
    reminderTime: "15",
    color: "bg-blue-500"
  });
  
  const { toast } = useToast();
  
  // Filter lectures for the selected date
  const filteredLectures = lectures.filter((lecture) => {
    return format(lecture.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  });
  
  // Sort lectures by start time
  const sortedLectures = [...filteredLectures].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Handle form input changes
  const handleInputChange = (field: keyof Lecture, value: any) => {
    setNewLecture({
      ...newLecture,
      [field]: value
    });
  };
  
  // Save lecture
  const saveLecture = () => {
    // Validation
    if (!newLecture.title || !newLecture.startTime || !newLecture.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingLecture) {
      // Update existing lecture
      const updatedLectures = lectures.map((lec) => 
        lec.id === editingLecture.id ? { ...newLecture, id: editingLecture.id } as Lecture : lec
      );
      setLectures(updatedLectures);
      toast({
        title: "Lecture Updated",
        description: `'${newLecture.title}' has been updated.`
      });
    } else {
      // Add new lecture
      const lecture: Lecture = {
        ...(newLecture as Omit<Lecture, 'id'>),
        id: `lecture-${Date.now()}`,
        date: newLecture.date || new Date()
      };
      
      setLectures([...lectures, lecture]);
      toast({
        title: "Lecture Added",
        description: `'${lecture.title}' has been scheduled.`
      });
    }
    
    // Reset form and close dialog
    setNewLecture({
      title: "",
      course: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:30",
      location: "",
      description: "",
      reminder: true,
      reminderTime: "15",
      color: "bg-blue-500"
    });
    setIsAddingLecture(false);
    setEditingLecture(null);
  };
  
  // Delete lecture
  const deleteLecture = (id: string) => {
    setLectures(lectures.filter((lecture) => lecture.id !== id));
    toast({
      title: "Lecture Deleted",
      description: "The lecture has been removed from your schedule."
    });
  };
  
  // Edit lecture
  const editLecture = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setNewLecture({...lecture});
    setIsAddingLecture(true);
  };
  
  // Toggle reminder for a lecture
  const toggleReminder = (id: string) => {
    const updatedLectures = lectures.map((lecture) => {
      if (lecture.id === id) {
        const updated = { ...lecture, reminder: !lecture.reminder };
        toast({
          title: updated.reminder ? "Reminder Set" : "Reminder Turned Off",
          description: updated.reminder 
            ? `You will be reminded ${updated.reminderTime} minutes before ${updated.title}` 
            : `Reminder for ${updated.title} has been disabled`
        });
        return updated;
      }
      return lecture;
    });
    setLectures(updatedLectures);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view scheduled lectures</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border pointer-events-auto"
              components={{
                Day: (props) => {
                  // Get date from props directly
                  const date = props.date;
                  const displayMonth = props.displayMonth;
                  
                  // Now we use date instead of day
                  const hasLecture = lectures.some(
                    (lecture) => format(lecture.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                  );
                  
                  return (
                    <div className="relative">
                      <div
                        className={cn(
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          hasLecture && "font-bold",
                          date.getMonth() !== displayMonth.getMonth() && "opacity-50"
                        )}
                      >
                        {format(date, "d")}
                      </div>
                      {hasLecture && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"></div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsAddingLecture(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Lecture
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Lectures for {format(date, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>
              {sortedLectures.length === 0
                ? "No lectures scheduled for this day"
                : `${sortedLectures.length} lecture${sortedLectures.length === 1 ? "" : "s"} scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedLectures.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No lectures scheduled</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add a new lecture to get started
                </p>
                <Button variant="outline" onClick={() => setIsAddingLecture(true)}>
                  Schedule Lecture
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {sortedLectures.map((lecture) => (
                    <Card key={lecture.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div className={`h-2 w-full ${lecture.color}`}></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{lecture.title}</h3>
                              <Badge variant="outline">{lecture.course}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {lecture.startTime} - {lecture.endTime}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {lecture.location}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center" title={lecture.reminder ? "Reminder is set" : "Set a reminder"}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn(
                                  "h-8 w-8", 
                                  lecture.reminder ? "text-amber-500" : "text-muted-foreground"
                                )}
                                onClick={() => toggleReminder(lecture.id)}
                              >
                                {lecture.reminder ? (
                                  <AlarmClock className="h-4 w-4" />
                                ) : (
                                  <Bell className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => editLecture(lecture)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteLecture(lecture.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {lecture.description && (
                          <div className="mt-2 text-sm">
                            <p>{lecture.description}</p>
                          </div>
                        )}
                        {lecture.reminder && (
                          <div className="mt-2 flex items-center">
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <AlarmClock className="h-3 w-3" />
                              Reminder: {reminderTimes.find(r => r.value === lecture.reminderTime)?.label || `${lecture.reminderTime} minutes before`}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isAddingLecture} onOpenChange={setIsAddingLecture}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingLecture ? "Edit Lecture" : "Schedule New Lecture"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your lecture. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={newLecture.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Introduction to Biology"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course Code</Label>
                <Input
                  id="course"
                  value={newLecture.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder="e.g., BIO101"
                />
              </div>
              <div className="space-y-2">
                <Label>Color Tag</Label>
                <Select
                  value={newLecture.color}
                  onValueChange={(value) => handleInputChange("color", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${color.value} mr-2`}></div>
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newLecture.date ? format(newLecture.date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newLecture.date}
                    onSelect={(date) => handleInputChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newLecture.startTime}
                  onValueChange={(value) => handleInputChange("startTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newLecture.endTime}
                  onValueChange={(value) => handleInputChange("endTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newLecture.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Science Building, Room 301"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newLecture.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Additional information about this lecture"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder">Set Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified before the lecture starts
                  </p>
                </div>
                <Switch
                  id="reminder"
                  checked={newLecture.reminder}
                  onCheckedChange={(checked) => handleInputChange("reminder", checked)}
                />
              </div>
              
              {newLecture.reminder && (
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Remind me</Label>
                  <Select
                    value={newLecture.reminderTime}
                    onValueChange={(value) => handleInputChange("reminderTime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTimes.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingLecture(false);
              setEditingLecture(null);
              setNewLecture({
                title: "",
                course: "",
                date: new Date(),
                startTime: "09:00",
                endTime: "10:30",
                location: "",
                description: "",
                reminder: true,
                reminderTime: "15",
                color: "bg-blue-500"
              });
            }}>
              Cancel
            </Button>
            <Button onClick={saveLecture}>
              {editingLecture ? "Update Lecture" : "Add to Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LectureScheduler;
