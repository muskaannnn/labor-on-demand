
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Booking } from "@/types";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import BottomNavigation from "@/components/BottomNavigation";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  
  useEffect(() => {
    // Get booking from local storage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const foundBooking = bookings.find((b: Booking) => b.id === bookingId);
    
    if (foundBooking) {
      setBooking(foundBooking);
    } else {
      navigate("/bookings");
      toast({
        title: "Booking not found",
        description: "The requested booking could not be found",
        variant: "destructive",
      });
    }
  }, [bookingId, navigate]);
  
  const handleEdit = () => {
    // In a real app, this would navigate back to the booking form with prefilled data
    navigate(-1);
  };
  
  if (!booking) {
    return <div className="container max-w-md mx-auto px-4 py-8">Loading...</div>;
  }
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/bookings")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <h1 className="text-xl font-bold">Booking Confirmation</h1>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <svg className="mx-auto h-12 w-12 text-green-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-lg font-medium text-green-800">Booking Successful</h2>
          <p className="text-green-600">Your booking has been confirmed</p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Status</h3>
            <BookingStatusBadge status={booking.status} />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Service Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted-foreground">Service:</p>
              <p>{booking.serviceName}</p>
              
              <p className="text-muted-foreground">Date:</p>
              <p>{booking.date}</p>
              
              <p className="text-muted-foreground">Time:</p>
              <p>{booking.timeSlot}</p>
              
              <p className="text-muted-foreground">Workers:</p>
              <p>{booking.numberOfWorkers}</p>
              
              <p className="text-muted-foreground">Address:</p>
              <p>{booking.address}</p>
              
              <p className="text-muted-foreground">Lift Available:</p>
              <p>{booking.liftAvailable ? "Yes" : "No"}</p>
              
              <p className="text-muted-foreground">Cost:</p>
              <p>₹{booking.estimatedCost}</p>
            </div>
          </div>
        </div>
        
        <div className="h-40 bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Tracking map will be shown here</p>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleEdit}>Edit Booking</Button>
          <Button onClick={() => navigate("/bookings")}>View All Bookings</Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default BookingConfirmation;
