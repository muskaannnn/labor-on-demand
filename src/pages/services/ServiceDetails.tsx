import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Service, User, Worker } from "@/types";
import BottomNavigation from "@/components/BottomNavigation";
import WorkerCard from "@/components/WorkerCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, Star, Search } from "lucide-react";
import { format } from "date-fns";

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

// Sample workers data
const sampleWorkers: Worker[] = [
  {
    id: "w1",
    phoneNumber: "+919876543210",
    name: "Rajesh Kumar",
    languages: ["Hindi", "English"],
    services: ["Construction", "Loading"],
    rating: 4.5,
    city: "Delhi"
  },
  {
    id: "w2",
    phoneNumber: "+919876543211",
    name: "Suresh Singh",
    languages: ["Hindi"],
    services: ["Construction", "Gas Cutting"],
    rating: 4.8,
    city: "Delhi"
  },
  {
    id: "w3",
    phoneNumber: "+919876543212",
    name: "Mohan Lal",
    languages: ["Hindi", "Punjabi"],
    services: ["Loading", "Material Sorting"],
    rating: 3.9,
    city: "Delhi"
  },
  {
    id: "w4",
    phoneNumber: "+919876543213",
    name: "Deepak Sharma",
    languages: ["Hindi", "English"],
    services: ["Construction", "Material Sorting"],
    rating: 4.2,
    city: "Delhi"
  },
  {
    id: "w5",
    phoneNumber: "+919876543214",
    name: "Vikram Yadav",
    languages: ["Hindi"],
    services: ["Loading", "Gas Cutting"],
    rating: 4.7,
    city: "Delhi"
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
    duration: "hourly", // New field for duration
    numberOfWorkers: 1,
    address: "",
    location: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
    liftAvailable: false,
    termsAccepted: false
  });
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  
  // Generate time slots in 30-minute intervals in 12-hour format
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      const hourFormatted = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "pm" : "am";
      
      // Add hour slot (e.g., 1:00 pm)
      slots.push(`${hourFormatted}:00 ${ampm}`);
      
      // Add half-hour slot (e.g., 1:30 pm)
      slots.push(`${hourFormatted}:30 ${ampm}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  // New state for worker selection
  const [availableWorkers, setAvailableWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<"rating" | "distance">("rating");
  const [searchQuery, setSearchQuery] = useState("");
  
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
    
    // Load sample workers (in a real app, this would be from an API)
    setAvailableWorkers(sampleWorkers);
  }, [serviceId, navigate]);
  
  // Filter and sort workers
  const filteredWorkers = availableWorkers.filter(worker => {
    // Filter by search query (name and languages)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        worker.name.toLowerCase().includes(query) ||
        worker.languages.some(lang => lang.toLowerCase().includes(query))
      );
    }
    return true;
  });
  
  // Sort workers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortOption === "rating") {
      return b.rating - a.rating;
    } else {
      // For distance, we would calculate actual distance 
      // but for now just sort by a random number to simulate distance
      return Math.random() - 0.5;
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleWorkerCountChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      numberOfWorkers: Math.max(1, prev.numberOfWorkers + change)
    }));
  };
  
  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkers(prev => {
      // If already selected, remove it
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      } 
      // If not selected, add it if we haven't reached the limit
      else if (prev.length < formData.numberOfWorkers) {
        return [...prev, workerId];
      }
      // If we've reached the limit, show a toast and don't change
      else {
        toast({
          title: "Worker limit reached",
          description: `You can only select ${formData.numberOfWorkers} workers. Increase the number of workers or deselect a worker first.`,
          variant: "destructive",
        });
        return prev;
      }
    });
  };
  
  const nextStep = () => {
    if (step === 1) {
      if (!formData.date || !formData.time || !formData.duration) {
        toast({
          title: "Missing information",
          description: "Please select date, time and duration",
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
    } else if (step === 3) {
      // Moving from step 3 to worker selection step
      // Reset selected workers when number of workers changes
      setSelectedWorkers([]);
    } else if (step === 4) {
      // Moving from worker selection to confirmation
      if (selectedWorkers.length < formData.numberOfWorkers) {
        toast({
          title: "Missing workers",
          description: `Please select ${formData.numberOfWorkers} workers to continue`,
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
    
    if (selectedWorkers.length < formData.numberOfWorkers) {
      toast({
        title: "Worker selection incomplete",
        description: `Please select all ${formData.numberOfWorkers} workers to continue`,
        variant: "destructive",
      });
      return;
    }
    
    // Get selected worker objects
    const workers = availableWorkers.filter(worker => 
      selectedWorkers.includes(worker.id)
    );
    
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
      workers: workers,
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
              <Label htmlFor="date">Date/दिनांक</Label>
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
              <Label htmlFor="duration">Duration/अवधि</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange("duration", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly/घंटे के हिसाब से</SelectItem>
                  <SelectItem value="half-day">Half Day/आधा दिन</SelectItem>
                  <SelectItem value="full-day">Full Day/पूरा दिन</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time/समय</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => handleSelectChange("time", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <MapPin className="h-6 w-6 text-muted-foreground mr-2" />
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
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Select Workers</Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select Workers ({selectedWorkers.length}/{formData.numberOfWorkers})</h2>
            
            <div className="flex items-center space-x-2 mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name or language"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>
              
              <Select 
                value={sortOption} 
                onValueChange={(value) => setSortOption(value as "rating" | "distance")}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      <span>Top Rated</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="distance">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Nearest</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {sortedWorkers.length > 0 ? (
                sortedWorkers.map((worker) => (
                  <WorkerCard 
                    key={worker.id} 
                    worker={worker} 
                    selected={selectedWorkers.includes(worker.id)}
                    onSelect={toggleWorkerSelection}
                  />
                ))
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">No workers found matching your criteria</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2 border-t pt-4">
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
              <Button 
                onClick={handleSubmit}
                disabled={selectedWorkers.length !== formData.numberOfWorkers || !formData.termsAccepted}
              >
                Book Now
              </Button>
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
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-muted-foreground">Step {step}/4</span>
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
      
      {user && <BottomNavigation />}
    </div>
  );
};

export default ServiceDetails;
