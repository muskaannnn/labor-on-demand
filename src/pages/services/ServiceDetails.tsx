
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Service, User } from "@/types";
import BottomNavigation from "@/components/BottomNavigation";

// Sample services data
const services = [
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

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    numberOfWorkers: 1,
    address: "",
    location: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
    liftAvailable: false,
    termsAccepted: false
  });
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  
  useEffect(() => {
    // Get the service details
    const foundService = services.find(s => s.id === serviceId);
    if (foundService) {
      setService(foundService);
    } else {
      navigate("/");
      toast({
        title: "Service not found",
        description: "The requested service could not be found",
        variant: "destructive",
      });
    }
    
    // Get user from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/auth/phone");
    }
  }, [serviceId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleWorkerCountChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      numberOfWorkers: Math.max(1, prev.numberOfWorkers + change)
    }));
  };
  
  const nextStep = () => {
    if (step === 1) {
      if (!formData.date || !formData.time) {
        toast({
          title: "Missing information",
          description: "Please select date and time",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.address) {
        toast({
          title: "Missing information",
          description: "Please enter your address",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Terms and conditions",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    // Create a booking and navigate to confirmation
    const booking = {
      id: `booking-${Date.now()}`,
      serviceId: service?.id || "",
      serviceName: service?.name || "",
      userId: user?.id || "",
      date: formData.date,
      timeSlot: formData.time,
      address: formData.address,
      location: formData.location,
      numberOfWorkers: formData.numberOfWorkers,
      status: "pending" as const,
      liftAvailable: formData.liftAvailable,
      estimatedCost: formData.numberOfWorkers * 500, // Simple calculation for demo
    };
    
    // Save booking to local storage (would be saved to a database in a real app)
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    
    navigate(`/bookings/${booking.id}/confirmation`);
  };
  
  if (!service) {
    return <div className="container max-w-md mx-auto px-4 py-8">Loading...</div>;
  }
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">When do you need {service.name}?</h2>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Button className="w-full" onClick={nextStep}>Continue</Button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Where do you need service?</h2>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="h-40 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Map view will be shown here</p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Continue</Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">How many workers do you need?</h2>
            
            <div className="flex items-center justify-center space-x-4 border rounded-md p-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleWorkerCountChange(-1)}
                disabled={formData.numberOfWorkers <= 1}
              >
                -
              </Button>
              <span className="text-xl font-medium">{formData.numberOfWorkers}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleWorkerCountChange(1)}
              >
                +
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="liftAvailable" 
                  name="liftAvailable"
                  checked={formData.liftAvailable}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, liftAvailable: !!checked }))
                  }
                />
                <Label htmlFor="liftAvailable">Service lift available for workers</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="termsAccepted" 
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, termsAccepted: !!checked }))
                  }
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I agree to the{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm font-normal"
                    onClick={() => setShowTermsDialog(true)}
                  >
                    terms and conditions
                  </Button>
                </Label>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-md font-medium mb-2">Estimated Cost</h3>
              <p className="text-xl font-bold">₹{formData.numberOfWorkers * 500}</p>
              <p className="text-xs text-muted-foreground">Final amount may vary based on actual work duration</p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleSubmit}>Book Now</Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <h1 className="text-xl font-bold">{service.name}</h1>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-muted-foreground">Step {step}/3</span>
        </div>
      </div>
      
      {renderStep()}
      
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              1. The platform connects employers with workers and is not responsible for the quality of work.
            </p>
            <p>
              2. Payment for services must be made directly to the workers upon completion of the job.
            </p>
            <p>
              3. The platform charges a service fee for connecting employers with workers.
            </p>
            <p>
              4. Workers and employers must treat each other with respect and professionalism.
            </p>
            <p>
              5. Cancellations must be made at least 2 hours before the scheduled service time to avoid cancellation fees.
            </p>
          </div>
          <Button onClick={() => setShowTermsDialog(false)}>Close</Button>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default ServiceDetails;
