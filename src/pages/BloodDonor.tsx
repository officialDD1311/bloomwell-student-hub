
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MapPin, Heart, Plus, HeartHandshake } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const hospitals = [
  { name: "City General Hospital", address: "123 Main St, Downtown", distance: "1.2 miles" },
  { name: "University Medical Center", address: "456 College Ave, Uptown", distance: "2.5 miles" },
  { name: "Community Health Center", address: "789 Oak Dr, Westside", distance: "3.8 miles" },
  { name: "Memorial Hospital", address: "101 Pine St, Eastside", distance: "4.1 miles" },
];

const BloodDonor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slugs, setSlugs] = useState(2); // In a real app, fetch from Firestore
  const [donations, setDonations] = useState(2); // In a real app, fetch from Firestore
  
  const handleDonate = () => {
    // In a real app, update Firestore
    setSlugs(prev => prev + 1);
    setDonations(prev => prev + 1);
    
    toast({
      title: "Donation Recorded!",
      description: "Thank you for your donation. You've earned a new slug!",
    });
  };
  
  const handleRequest = () => {
    if (slugs <= 0) {
      toast({
        title: "No Slugs Available",
        description: "You need at least 1 slug to make a request",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, update Firestore
    setSlugs(prev => prev - 1);
    
    toast({
      title: "Request Submitted",
      description: "Your blood request has been submitted successfully",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Blood Donor Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Slug System</CardTitle>
                <CardDescription>How your donations translate to help</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Each time you donate blood, you earn 1 Slug. You can redeem a slug to request 
                  blood once in 3 months. Slugs are a way to ensure that donors are prioritized 
                  when they need help.
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">Your Slugs</h3>
                    <p className="text-3xl font-bold text-bloomwell-purple">{slugs}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Donations</h3>
                    <p className="text-3xl font-bold text-bloomwell-green">{donations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Help others or request assistance</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button 
                  onClick={handleDonate}
                  className="bg-bloomwell-green hover:bg-bloomwell-green-dark gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Record Blood Donation
                </Button>
                
                <Button 
                  onClick={handleRequest}
                  className="bg-bloomwell-purple hover:bg-bloomwell-purple-dark gap-2"
                  disabled={slugs <= 0}
                >
                  <HeartHandshake className="h-5 w-5" />
                  Request Blood
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Nearby Hospitals</CardTitle>
              <CardDescription>Places where you can donate or receive blood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {hospitals.map((hospital, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-start p-4 rounded-lg bg-background/50 border"
                  >
                    <MapPin className="h-5 w-5 mr-3 text-bloomwell-purple shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">{hospital.name}</h3>
                      <p className="text-sm text-muted-foreground">{hospital.address}</p>
                      <p className="text-xs mt-1">{hospital.distance} away</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BloodDonor;
