
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhoneAuth from "./pages/auth/PhoneAuth";
import UserTypeSelection from "./pages/auth/UserTypeSelection";
import CreateProfile from "./pages/auth/CreateProfile";
import ServiceDetails from "./pages/services/ServiceDetails";
import BookingConfirmation from "./pages/bookings/BookingConfirmation";
import BookingsList from "./pages/bookings/BookingsList";
import BookingDetails from "./pages/bookings/BookingDetails";
import ProfilePage from "./pages/profile/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/phone" element={<PhoneAuth />} />
          <Route path="/auth/user-type" element={<UserTypeSelection />} />
          <Route path="/auth/create-profile" element={<CreateProfile />} />
          <Route path="/services/:serviceId" element={<ServiceDetails />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/bookings/:bookingId" element={<BookingDetails />} />
          <Route path="/bookings/:bookingId/confirmation" element={<BookingConfirmation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
