
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/ServiceCard";
import UserRoleToggle from "@/components/UserRoleToggle";
import BottomNavigation from "@/components/BottomNavigation";
import { Service, User, UserRole } from "@/types";

// Sample services data
const services: Service[] = [
  {
    id: "construction",
    name: "Construction Worker",
    icon: "/placeholder.svg",
    description: "General construction labor for various tasks"
  },
  {
    id: "loading",
    name: "Loading/Unloading",
    icon: "/placeholder.svg",
    description: "Workers for loading & unloading goods"
  },
  {
    id: "sorting",
    name: "Material Sorting",
    icon: "/placeholder.svg",
    description: "Sorting of materials and goods"
  },
  {
    id: "gas-cutting",
    name: "Gas Cutting",
    icon: "/placeholder.svg",
    description: "Professional gas cutting services"
  }
];

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
          <p className="text-center text-muted-foreground">Please login to continue</p>
          <Link to="/auth/phone">
            <Button>Login / Sign up</Button>
          </Link>
        </div>
      );
    }
    
    if (user.role === "employer") {
      return (
        <>
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Select a service/सेवा चुनें</h2>
            <div className="grid grid-cols-2 gap-4">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Link to="/bookings">
              <Button variant="outline" className="w-full">View Active Bookings</Button>
            </Link>
          </div>
        </>
      );
    }
    
    if (user.role === "worker") {
      return (
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Worker Dashboard</h2>
            <p className="text-muted-foreground text-sm">
              You are currently logged in as a worker. You'll receive notifications about job opportunities here.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-md font-medium">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Construction Worker</Badge>
              <Badge>Loading/Unloading</Badge>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">No Active Jobs</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any active jobs at the moment. We'll notify you when new opportunities are available.
            </p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Labour-on-Demand</h1>
        {user && <UserRoleToggle />}
      </div>
      
      {renderContent()}
      
      {/* Only show bottom navigation when user is logged in */}
      {user && <BottomNavigation />}
    </div>
  );
};

export default Home;
