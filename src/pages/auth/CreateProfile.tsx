
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";
import { User } from "@/types";

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, role } = location.state || {};
  
  const [formData, setFormData] = useState<Partial<User>>({
    phoneNumber: phoneNumber || "",
    name: "",
    city: "",
    role: role || "employer",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to create user profile
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Save user data to local storage (would be saved to a database in a real app)
      localStorage.setItem("user", JSON.stringify({
        ...formData,
        id: "user-" + Date.now(),
        profileCompleted: true,
      }));
      
      navigate("/");
      
      toast({
        title: "Profile created successfully",
        description: "Welcome to the app!",
      });
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Create your profile"
      subtitle="Please provide the following information"
    >
      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="flex items-center border rounded-md overflow-hidden bg-muted">
              <span className="px-3 py-2 text-muted-foreground border-r">+91</span>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                disabled
                className="border-none bg-muted focus-visible:ring-0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          {formData.role === "worker" && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                A team member will contact you to complete your worker profile with additional information
              </p>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating profile..." : "Complete Profile"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default CreateProfile;
