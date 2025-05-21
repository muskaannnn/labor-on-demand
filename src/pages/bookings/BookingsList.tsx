import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Booking, User } from "@/types";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import BottomNavigation from "@/components/BottomNavigation";

const BookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  
  useEffect(() => {
    // Get user from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/auth/phone");
      return;
    }
    
    // Get bookings from local storage
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
  }, [navigate]);
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "active") {
      return booking.status !== "completed";
    } else {
      return booking.status === "completed";
    }
  });
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Bookings</h1>
        
        <div className="flex border-b mt-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "active"
                ? "border-b-2 border-primary font-medium"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "completed"
                ? "border-b-2 border-primary font-medium"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No {activeTab} bookings found</p>
            <Link to="/">
              <Button>Book a Service</Button>
            </Link>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <Link 
              key={booking.id}
              to={`/bookings/${booking.id}`}
              className="block border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{booking.serviceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.date} • {booking.timeSlot}
                  </p>
                  <p className="text-sm mt-1">
                    {booking.numberOfWorkers} worker{booking.numberOfWorkers > 1 ? 's' : ''}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            </Link>
          ))
        )}
      </div>
      
      {user && <BottomNavigation />}
    </div>
  );
};

export default BookingsList;
