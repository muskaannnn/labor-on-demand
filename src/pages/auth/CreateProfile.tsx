
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

  // Determine if we should show Hindi labels based on role
  const showBilingual = formData.role === "worker";

  return (
    <AuthLayout 
      title="Create your profile"
      subtitle="Please provide the following information"
    >
      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {showBilingual ? "Name / नाम" : "Full Name"}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={showBilingual ? "Enter your name / अपना नाम दर्ज करें" : "Enter your full name"}
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white border-primary focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              {showBilingual ? "Phone Number / फोन नंबर" : "Phone Number"}
            </Label>
            <div className="flex items-center border rounded-md overflow-hidden border-primary bg-white">
              <span className="px-3 py-2 text-muted-foreground border-r bg-muted">+91</span>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                disabled
                className="border-none focus-visible:ring-0 bg-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">
              {showBilingual ? "City / शहर" : "City"}
            </Label>
            <Input
              id="city"
              name="city"
              placeholder={showBilingual ? "Enter your city / अपना शहर दर्ज करें" : "Enter your city"}
              value={formData.city}
              onChange={handleChange}
              required
              className="bg-white border-primary focus:ring-primary focus:border-primary"
            />
          </div>
          
          {formData.role === "worker" && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                A team member will contact you to complete your worker profile with additional information / टीम का सदस्य आपसे संपर्क करके आपकी प्रोफाइल को पूरा करने में मदद करेगा
              </p>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating profile..." : showBilingual ? "Complete Profile / प्रोफाइल पूरा करें" : "Complete Profile"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default CreateProfile;
