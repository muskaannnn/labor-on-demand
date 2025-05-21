
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import { UserRole } from "@/types";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = location.state || {};
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    // Save role selection temporarily and continue to profile creation
    navigate("/auth/create-profile", { 
      state: { 
        phoneNumber,
        role: selectedRole 
      } 
    });
  };

  return (
    <AuthLayout 
      title="How will you use the app?"
      subtitle="Please select your role"
    >
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant={selectedRole === "employer" ? "default" : "outline"}
            className={`h-auto py-6 ${
              selectedRole === "employer" ? "border-primary" : ""
            }`}
            onClick={() => setSelectedRole("employer")}
          >
            <div className="flex flex-col items-center">
              <div className="text-xl font-medium">I need workers</div>
              <div className="text-sm text-muted-foreground mt-1">
                Hire workers for various services
              </div>
            </div>
          </Button>
          
          <Button
            variant={selectedRole === "worker" ? "default" : "outline"}
            className={`h-auto py-6 ${
              selectedRole === "worker" ? "border-primary" : ""
            }`}
            onClick={() => setSelectedRole("worker")}
          >
            <div className="flex flex-col items-center">
              <div className="text-xl font-medium">I am a worker</div>
              <div className="text-sm text-muted-foreground mt-1">
                Find work opportunities
              </div>
            </div>
          </Button>
        </div>
        
        <Button 
          className="w-full mt-8" 
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </AuthLayout>
  );
};

export default UserTypeSelection;
