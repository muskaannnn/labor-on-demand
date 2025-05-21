
import { Home, Book, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  
  const getActiveClass = (path: string) => {
    return location.pathname.startsWith(path) 
      ? "text-primary border-t-2 border-primary" 
      : "text-muted-foreground";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-input flex justify-around items-center h-16 z-50 px-1">
      <Link to="/" className={`flex flex-col items-center justify-center w-1/3 py-1 ${getActiveClass('/')}`}>
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/bookings" className={`flex flex-col items-center justify-center w-1/3 py-1 ${getActiveClass('/bookings')}`}>
        <Book className="h-5 w-5" />
        <span className="text-xs mt-1">Bookings</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center justify-center w-1/3 py-1 ${getActiveClass('/profile')}`}>
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
