
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

const UserRoleToggle = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>("employer");
  
  useEffect(() => {
    // Get user data from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentRole(user.role);
    }
  }, []);
  
  const toggleRole = () => {
    const newRole = currentRole === "employer" ? "worker" : "employer";
    
    // Update local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      user.role = newRole;
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    setCurrentRole(newRole);
    
    toast({
      title: "Profile switched",
      description: `You are now using the app as a ${newRole}`,
    });
  };
  
  return (
    <div className="flex items-center justify-center space-x-2 py-2 px-4 bg-muted rounded-full">
      <Button
        variant={currentRole === "employer" ? "default" : "ghost"}
        size="sm"
        onClick={() => currentRole !== "employer" && toggleRole()}
        className={`rounded-full text-xs ${currentRole === "employer" ? "bg-primary" : ""}`}
      >
        Employer
      </Button>
      <Button
        variant={currentRole === "worker" ? "default" : "ghost"}
        size="sm"
        onClick={() => currentRole !== "worker" && toggleRole()}
        className={`rounded-full text-xs ${currentRole === "worker" ? "bg-primary" : ""}`}
      >
        Worker
      </Button>
    </div>
  );
};

export default UserRoleToggle;
