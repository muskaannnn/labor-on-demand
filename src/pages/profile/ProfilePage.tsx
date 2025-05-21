import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";
import BottomNavigation from "@/components/BottomNavigation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/auth/phone");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    
    navigate("/");
  };
  
  if (!user) {
    return <div className="container max-w-md mx-auto px-4 py-8">Loading...</div>;
  }
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-medium">{user.name}</h2>
            <p className="text-muted-foreground">+91 {user.phoneNumber}</p>
          </div>
        </div>
        
        <div className="border rounded-lg divide-y">
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">User Type</h3>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">City</h3>
              <p className="text-sm text-muted-foreground">{user.city}</p>
            </div>
          </div>
        </div>
        
        {user.role === "employer" && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">Add a payment method to easily pay for services</p>
            <Button variant="outline" className="w-full mt-3">Add Payment Method</Button>
          </div>
        )}
        
        {user.role === "worker" && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Services Offered</h3>
            <p className="text-sm text-muted-foreground">Update your skills and services</p>
            <Button variant="outline" className="w-full mt-3">Update Services</Button>
          </div>
        )}
        
        <div className="space-y-3 pt-4">
          <Button variant="outline" className="w-full">Account Settings</Button>
          <Button variant="outline" className="w-full">Help Center</Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      
      {user && <BottomNavigation />}
    </div>
  );
};

export default ProfilePage;
