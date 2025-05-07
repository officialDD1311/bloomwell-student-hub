
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-4 glass border-t border-white/10 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">BloomWell</h3>
            <p className="text-sm text-muted-foreground">
              Your Student Wellness Hub - helping students maintain mental and physical wellbeing.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/social-welfare" className="text-sm hover:text-primary transition-colors">Social Welfare</Link>
              </li>
              <li>
                <Link to="/blood-donor" className="text-sm hover:text-primary transition-colors">Blood Donor</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Social Impact</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Join our mission to create a healthier, more supportive student community.
            </p>
            <Link 
              to="/social-welfare" 
              className="inline-flex items-center text-bloomwell-purple hover:text-bloomwell-purple-dark text-sm font-medium"
            >
              <Heart className="h-4 w-4 mr-1" />
              Make a difference
            </Link>
          </div>
        </div>
        
        <div className="border-t border-border mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} BloomWell. All rights reserved.
          </p>
          
          <div className="flex items-center mt-2 md:mt-0">
            <span className="text-xs text-muted-foreground">
              Made with <Heart className="inline h-3 w-3 text-bloomwell-purple" /> for student wellbeing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
