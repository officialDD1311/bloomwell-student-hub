import { useState, useEffect } from "react";
import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, Shield, UserCog, Eye, Save, Trash } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || "",
      email: user?.email || "",
      bio: "Student at State University",
    },
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      moodTrackerReminders: true,
      newsletter: false,
    },
    privacy: {
      profileVisibility: "friends", // public, friends, private
      shareActivity: true,
      allowTagging: true,
    },
    preferences: {
      language: "english",
      fontSize: "medium", // small, medium, large
      highContrast: false,
      reduceMotion: false,
    },
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
          // Ensure we keep the user's current data
          profile: {
            ...parsedSettings.profile,
            name: user?.name || parsedSettings.profile.name,
            email: user?.email || parsedSettings.profile.email
          }
        }));
      } catch (error) {
        console.error("Error loading saved settings:", error);
      }
    }
  }, [user]);
  
  const handleSettingChange = (
    category: keyof typeof settings,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };
  
  const saveSettings = (category: string) => {
    // Apply settings changes to local storage
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    // Apply font size changes immediately
    applyFontSizeSettings();
    
    // Apply motion settings
    applyMotionSettings();
    
    // Apply contrast settings
    applyContrastSettings();
    
    toast({
      title: "Settings Saved",
      description: `Your ${category} settings have been updated successfully.`,
    });
  };
  
  // Helper functions to apply settings
  const applyFontSizeSettings = () => {
    const htmlElement = document.documentElement;
    const { fontSize } = settings.preferences;
    
    // Remove existing font size classes
    htmlElement.classList.remove("text-sm", "text-base", "text-lg");
    
    // Apply new font size
    switch (fontSize) {
      case "small":
        htmlElement.classList.add("text-sm");
        break;
      case "medium":
        htmlElement.classList.add("text-base");
        break;
      case "large":
        htmlElement.classList.add("text-lg");
        break;
      default:
        htmlElement.classList.add("text-base");
    }
  };
  
  const applyMotionSettings = () => {
    const htmlElement = document.documentElement;
    
    if (settings.preferences.reduceMotion) {
      htmlElement.classList.add("reduce-motion");
    } else {
      htmlElement.classList.remove("reduce-motion");
    }
  };
  
  const applyContrastSettings = () => {
    const htmlElement = document.documentElement;
    
    if (settings.preferences.highContrast) {
      htmlElement.classList.add("high-contrast");
    } else {
      htmlElement.classList.remove("high-contrast");
    }
  };
  
  // Apply settings on component mount
  useEffect(() => {
    applyFontSizeSettings();
    applyMotionSettings();
    applyContrastSettings();
  }, []); // Apply once on mount
  
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6 max-w-screen-lg flex-grow">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Settings</h2>
            <p className="text-muted-foreground">Customize your BloomWell experience</p>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="glass grid grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex gap-2 items-center">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex gap-2 items-center">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex gap-2 items-center">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-6">
            <TabsContent value="profile" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal information and how it appears to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) =>
                          handleSettingChange("profile", "name", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) =>
                          handleSettingChange("profile", "email", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={settings.profile.bio}
                        onChange={(e) =>
                          handleSettingChange("profile", "bio", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" className="flex gap-2">
                      <Trash className="h-4 w-4" />
                      Delete Account
                    </Button>
                    <Button 
                      onClick={() => saveSettings("profile")}
                      className="flex gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-base">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "email", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="text-base">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "push", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="task-reminders" className="text-base">
                          Task Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminded about upcoming tasks
                        </p>
                      </div>
                      <Switch
                        id="task-reminders"
                        checked={settings.notifications.taskReminders}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "taskReminders", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="mood-reminders" className="text-base">
                          Mood Tracker Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Reminders to track your daily mood
                        </p>
                      </div>
                      <Switch
                        id="mood-reminders"
                        checked={settings.notifications.moodTrackerReminders}
                        onCheckedChange={(checked) =>
                          handleSettingChange(
                            "notifications",
                            "moodTrackerReminders",
                            checked
                          )
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newsletter" className="text-base">
                          Newsletter
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive monthly wellness tips and updates
                        </p>
                      </div>
                      <Switch
                        id="newsletter"
                        checked={settings.notifications.newsletter}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", "newsletter", checked)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => saveSettings("notifications")}
                      className="flex gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base">Profile Visibility</Label>
                      <RadioGroup
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) =>
                          handleSettingChange("privacy", "profileVisibility", value)
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public" className="font-normal">
                            Public - Anyone can view your profile
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="friends" id="friends" />
                          <Label htmlFor="friends" className="font-normal">
                            Friends Only - Only your friends can view your profile
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private" className="font-normal">
                            Private - Only you can view your profile
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="share-activity" className="text-base">
                          Activity Sharing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Share your wellness achievements with friends
                        </p>
                      </div>
                      <Switch
                        id="share-activity"
                        checked={settings.privacy.shareActivity}
                        onCheckedChange={(checked) =>
                          handleSettingChange("privacy", "shareActivity", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow-tagging" className="text-base">
                          Allow Tagging
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow friends to tag you in posts and activities
                        </p>
                      </div>
                      <Switch
                        id="allow-tagging"
                        checked={settings.privacy.allowTagging}
                        onCheckedChange={(checked) =>
                          handleSettingChange("privacy", "allowTagging", checked)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => saveSettings("privacy")}
                      className="flex gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how BloomWell looks and behaves.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose between light and dark mode
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label className="text-base">Language</Label>
                      <RadioGroup
                        value={settings.preferences.language}
                        onValueChange={(value) =>
                          handleSettingChange("preferences", "language", value)
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="english" id="english" />
                          <Label htmlFor="english" className="font-normal">
                            English
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="spanish" id="spanish" />
                          <Label htmlFor="spanish" className="font-normal">
                            Spanish
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="french" id="french" />
                          <Label htmlFor="french" className="font-normal">
                            French
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label className="text-base">Font Size</Label>
                      <RadioGroup
                        value={settings.preferences.fontSize}
                        onValueChange={(value) =>
                          handleSettingChange("preferences", "fontSize", value)
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small" className="font-normal">
                            Small
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="font-normal">
                            Medium
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large" className="font-normal">
                            Large
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-contrast" className="text-base">
                          High Contrast Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.preferences.highContrast}
                        onCheckedChange={(checked) =>
                          handleSettingChange("preferences", "highContrast", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reduce-motion" className="text-base">
                          Reduce Motion
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations throughout the app
                        </p>
                      </div>
                      <Switch
                        id="reduce-motion"
                        checked={settings.preferences.reduceMotion}
                        onCheckedChange={(checked) =>
                          handleSettingChange("preferences", "reduceMotion", checked)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => saveSettings("appearance")}
                      className="flex gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
