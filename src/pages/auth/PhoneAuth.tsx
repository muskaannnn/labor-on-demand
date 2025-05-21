
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";

const PhoneAuth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      toast({
        title: "OTP Sent Successfully",
        description: "Please check your phone for the OTP",
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    // Validate OTP
    if (!/^\d{4}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if user exists in the system
      const isNewUser = true; // This would be determined by your API
      
      if (isNewUser) {
        navigate("/auth/user-type", { state: { phoneNumber } });
      } else {
        navigate("/");
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    }, 1000);
  };

  return (
    <AuthLayout 
      title={isOtpSent ? "Verify OTP" : "Welcome"}
      subtitle={isOtpSent 
        ? `We've sent an OTP to +91 ${phoneNumber}` 
        : "Enter your phone number to continue"
      }
    >
      <div className="space-y-6">
        {!isOtpSent ? (
          <>
            <div className="flex items-center border rounded-md overflow-hidden">
              <span className="px-3 py-2 bg-muted text-muted-foreground border-r">+91</span>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.slice(0, 10))}
                className="border-none focus-visible:ring-0"
              />
            </div>
            <Button 
              className="w-full" 
              disabled={phoneNumber.length !== 10 || isLoading}
              onClick={handleSendOTP}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                className="text-center text-lg tracking-widest"
                maxLength={4}
              />
              <Button 
                className="w-full" 
                disabled={otp.length !== 4 || isLoading}
                onClick={handleVerifyOTP}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </div>
            <p className="text-center mt-4 text-sm">
              Didn't receive the OTP?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-normal" 
                onClick={handleSendOTP} 
                disabled={isLoading}
              >
                Resend
              </Button>
            </p>
            <Button 
              variant="link" 
              className="p-0 w-full h-auto text-sm font-normal" 
              onClick={() => setIsOtpSent(false)}
            >
              Change Phone Number
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default PhoneAuth;
