
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Booking } from "@/types";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import BottomNavigation from "@/components/BottomNavigation";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  
  useEffect(() => {
    // Get booking from local storage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const foundBooking = bookings.find((b: Booking) => b.id === bookingId);
    
    if (foundBooking) {
      setBooking(foundBooking);
      
      // Show rating dialog if booking is completed but not rated
      if (foundBooking.status === "completed" && !localStorage.getItem(`rating-${foundBooking.id}`)) {
        setShowRatingDialog(true);
      }
    } else {
      navigate("/bookings");
      toast({
        title: "Booking not found",
        description: "The requested booking could not be found",
        variant: "destructive",
      });
    }
  }, [bookingId, navigate]);
  
  const handleStatusUpdate = (newStatus: Booking["status"]) => {
    if (!booking) return;
    
    // Update booking status
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updatedBookings = bookings.map((b: Booking) => 
      b.id === booking.id ? { ...b, status: newStatus } : b
    );
    
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
    setBooking({ ...booking, status: newStatus });
    
    toast({
      title: "Status updated",
      description: `Booking status updated to ${newStatus}`
    });
    
    // Show rating dialog if status changed to completed
    if (newStatus === "completed") {
      setShowRatingDialog(true);
    }
  };
  
  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    
    // Save rating in local storage
    localStorage.setItem(`rating-${booking?.id}`, JSON.stringify({
      rating,
      review,
      date: new Date().toISOString()
    }));
    
    setShowRatingDialog(false);
    
    toast({
      title: "Thank you for your feedback",
      description: "Your rating has been submitted"
    });
  };
  
  const handleCancel = () => {
    if (!booking) return;
    
    // Delete booking from local storage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updatedBookings = bookings.filter((b: Booking) => b.id !== booking.id);
    
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
    toast({
      title: "Booking cancelled",
      description: "Your booking has been cancelled"
    });
    
    navigate("/bookings");
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
          <h1 className="text-xl font-bold">Booking Details</h1>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <h2 className="text-lg font-medium">{booking.serviceName}</h2>
          <BookingStatusBadge status={booking.status} />
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Booking Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
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
          
          {booking.workers && booking.workers.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-medium">Assigned Workers</h3>
              <div className="space-y-2">
                {booking.workers.map(worker => (
                  <div key={worker.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.phoneNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-40 bg-muted rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Tracking map will be shown here</p>
        </div>
        
        <div className="space-y-3">
          {booking.status === "pending" && (
            <Button variant="destructive" className="w-full" onClick={handleCancel}>
              Cancel Booking
            </Button>
          )}
          
          {/* Demo buttons to simulate status changes */}
          {booking.status === "pending" && (
            <Button className="w-full" onClick={() => handleStatusUpdate("confirmed")}>
              Simulate: Booking Confirmed
            </Button>
          )}
          
          {booking.status === "confirmed" && (
            <Button className="w-full" onClick={() => handleStatusUpdate("onTheWay")}>
              Simulate: Workers On The Way
            </Button>
          )}
          
          {booking.status === "onTheWay" && (
            <Button className="w-full" onClick={() => handleStatusUpdate("arrived")}>
              Simulate: Workers Arrived
            </Button>
          )}
          
          {booking.status === "arrived" && (
            <Button className="w-full" onClick={() => handleStatusUpdate("inProgress")}>
              Simulate: Work In Progress
            </Button>
          )}
          
          {booking.status === "inProgress" && (
            <Button className="w-full" onClick={() => handleStatusUpdate("completed")}>
              Simulate: Work Completed
            </Button>
          )}
          
          {booking.status === "completed" && localStorage.getItem(`rating-${booking.id}`) && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm">You've already rated this booking.</p>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">Please rate your experience with the worker(s)</p>
            
            <div className="flex justify-center space-x-2 py-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="review" className="block text-sm font-medium">
                Add a review (optional)
              </label>
              <textarea
                id="review"
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>
            
            <Button className="w-full" onClick={handleRatingSubmit}>
              Submit
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You must submit a rating to continue
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default BookingDetails;
