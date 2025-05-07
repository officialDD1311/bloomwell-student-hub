import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Check, Plus, Calendar, Clock, X, AlarmClock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import AlarmSound from "@/utils/AlarmSound";

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  completed: boolean;
  alarm: boolean;
}

const TaskScheduler = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [enableAlarm, setEnableAlarm] = useState(false);
  const [activeAlarms, setActiveAlarms] = useState<string[]>([]);
  const { toast } = useToast();

  // Check for alarms that need to be triggered
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const currentDate = format(now, "yyyy-MM-dd");
      
      tasks.forEach(task => {
        if (
          task.alarm && 
          !task.completed &&
          format(task.date, "yyyy-MM-dd") === currentDate &&
          task.time === currentTime &&
          !activeAlarms.includes(task.id)
        ) {
          // Trigger alarm
          AlarmSound.getInstance().play();
          
          // Add to active alarms
          setActiveAlarms(prev => [...prev, task.id]);
          
          // Show toast notification
          toast({
            title: "⏰ Task Alarm!",
            description: `It's time for: ${task.title}`,
            duration: 0, // Don't auto-dismiss
            action: (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => dismissAlarm(task.id)}
              >
                Dismiss
              </Button>
            ),
          });
        }
      });
    };

    // Check every minute
    const intervalId = setInterval(checkAlarms, 60000);
    
    // Also check immediately on mount and when tasks change
    checkAlarms();
    
    return () => clearInterval(intervalId);
  }, [tasks, activeAlarms, toast]);

  const dismissAlarm = (taskId: string) => {
    // Stop the alarm sound
    AlarmSound.getInstance().stop();
    
    // Remove from active alarms
    setActiveAlarms(prev => prev.filter(id => id !== taskId));
    
    toast({
      title: "Alarm dismissed",
      description: "You've successfully dismissed the alarm.",
    });
  };

  // Mark task as completed and dismiss any active alarm
  const toggleTaskComplete = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          // If task is being marked as complete and has an active alarm, dismiss it
          if (!task.completed && activeAlarms.includes(task.id)) {
            dismissAlarm(task.id);
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const addTask = () => {
    if (!newTask.trim() || !date || !time) {
      toast({
        title: "Incomplete task",
        description: "Please provide a title, date, and time",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      date: date,
      time: time,
      completed: false,
      alarm: enableAlarm,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setDate(new Date());
    setTime("09:00");
    setEnableAlarm(false);
    setIsAddingTask(false);

    if (enableAlarm) {
      toast({
        title: "Alarm set",
        description: `Alarm set for "${newTask}" at ${time} on ${format(date, "MMM d")}`,
      });
    } else {
      toast({
        title: "Task added",
        description: "Your task has been scheduled",
      });
    }
  };

  const deleteTask = (id: string) => {
    // If there's an active alarm for this task, dismiss it
    if (activeAlarms.includes(id)) {
      dismissAlarm(id);
    }
    
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been removed",
    });
  };

  const toggleAlarm = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, alarm: !task.alarm } : task
      )
    );
    
    const targetTask = tasks.find(task => task.id === id);
    if (targetTask) {
      toast({
        title: targetTask.alarm ? "Alarm removed" : "Alarm set",
        description: targetTask.alarm 
          ? `Alarm removed for "${targetTask.title}"` 
          : `Alarm set for "${targetTask.title}" at ${targetTask.time} on ${format(targetTask.date, "MMM d")}`,
      });
    }
  };

  // Sort tasks by date and time
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(`${format(a.date, 'yyyy-MM-dd')}T${a.time}`);
    const dateB = new Date(`${format(b.date, 'yyyy-MM-dd')}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const viewTaskDetails = (task: Task) => {
    toast({
      title: task.title,
      description: `Scheduled for ${format(task.date, "PPP")} at ${task.time}${task.alarm ? " with alarm" : ""}`,
    });
  };

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("scheduledTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("scheduledTasks");
    if (savedTasks) {
      try {
        // Parse the tasks and convert date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          date: new Date(task.date)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading saved tasks:", error);
      }
    }
  }, []);

  return (
    <Card className="w-full bloom-shadow border-none dark:bg-[#1A1F2C]/80">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-white">Tasks & Schedule</CardTitle>
            <CardDescription className="dark:text-gray-300">Plan your day for better productivity</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-bloomwell-purple text-white hover:bg-bloomwell-purple-dark dark:bg-bloomwell-purple/80 dark:hover:bg-bloomwell-purple"
            onClick={() => setIsAddingTask(!isAddingTask)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 mb-4 overflow-hidden dark:bg-[#222222]/50 p-4 rounded-lg"
            >
              <div>
                <Label htmlFor="task" className="dark:text-white">Task Title</Label>
                <Input
                  id="task"
                  placeholder="What do you need to do?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="bg-white/50 dark:bg-[#1A1F2C]/70 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-white">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-[#1A1F2C]/70 dark:text-white dark:border-gray-700",
                          !date && "text-muted-foreground dark:text-gray-400"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark:bg-[#1A1F2C] dark:border-gray-700">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="dark:bg-[#1A1F2C]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="time" className="dark:text-white">Time</Label>
                  <div className="flex">
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-white/50 dark:bg-[#1A1F2C]/70 dark:text-white dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="enable-alarm" 
                  checked={enableAlarm} 
                  onCheckedChange={setEnableAlarm}
                  className="data-[state=checked]:bg-bloomwell-purple"
                />
                <Label htmlFor="enable-alarm" className="dark:text-white flex items-center">
                  <AlarmClock className="h-4 w-4 mr-2" />
                  Set Alarm
                </Label>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-bloomwell-purple hover:bg-bloomwell-purple-dark dark:bg-bloomwell-purple dark:hover:bg-bloomwell-purple-dark"
                  onClick={addTask}
                >
                  Add Task
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 dark:border-gray-700 dark:text-white dark:hover:bg-[#222222]"
                  onClick={() => setIsAddingTask(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground dark:text-gray-400">
            <p>No tasks scheduled yet</p>
            <p className="text-sm">Add tasks to start planning your day</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "p-3 rounded-lg flex items-center justify-between",
                  task.completed
                    ? "dark:bg-[#222222]/60 bg-gray-100 text-gray-500 dark:text-gray-400"
                    : "bg-white dark:bg-[#1A1F2C]/70 dark:text-white"
                )}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-6 w-6 p-0 mr-2"
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center",
                      task.completed
                        ? "bg-bloomwell-green border-bloomwell-green"
                        : "border-gray-300 dark:border-gray-500"
                    )}>
                      {task.completed && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </Button>

                  <div className="overflow-hidden" onClick={() => viewTaskDetails(task)}>
                    <p className={cn(
                      "font-medium truncate",
                      task.completed && "line-through"
                    )}>
                      {task.title}
                    </p>
                    <div className="flex text-xs text-muted-foreground dark:text-gray-400">
                      <span className="flex items-center mr-3">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(task.date, "MMM d")}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlarm(task.id)}
                    className={cn(
                      "text-gray-400 p-1 h-8 w-8",
                      task.alarm ? "text-bloomwell-yellow dark:text-bloomwell-yellow-light hover:text-bloomwell-yellow-dark" : "hover:text-gray-500 dark:hover:text-gray-300"
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    {task.alarm && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-bloomwell-yellow"></span>}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskScheduler;
