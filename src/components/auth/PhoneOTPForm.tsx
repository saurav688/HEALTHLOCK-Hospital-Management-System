import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Loader2, 
  Smartphone, 
  RefreshCw,
  Shield,
  Clock
} from "lucide-react";

interface PhoneOTPFormProps {
  phoneNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
  purpose?: 'login' | 'verification';
}

export const PhoneOTPForm = ({ 
  phoneNumber, 
  onSuccess, 
  onCancel, 
  purpose = 'login' 
}: PhoneOTPFormProps) => {
  const { verifyPhoneLogin, verifyPhone, resendPhoneOTP, isLoading } = useAuth();
  
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    let result;
    
    if (purpose === 'login') {
      result = await verifyPhoneLogin(phoneNumber, otp);
    } else {
      result = await verifyPhone(otp);
    }
    
    if (result.success) {
      onSuccess();
    } else {
      toast.error(result.message || "OTP verification failed");
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const result = await resendPhoneOTP();
      
      if (result.success) {
        toast.success("New OTP sent to your phone");
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setOtp(""); // Clear current OTP
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleanValue);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 shadow-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        <div className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Verify Phone Number
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Enter the 6-digit code sent to
          </CardDescription>
          <div className="font-semibold text-foreground mt-1">
            {phoneNumber}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium">
              Verification Code
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => handleOTPChange(e.target.value)}
                className="pl-10 text-center text-lg font-mono tracking-widest"
                maxLength={6}
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code from your SMS
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {timeLeft > 0 ? (
                <>Code expires in {formatTime(timeLeft)}</>
              ) : (
                <>Code expired</>
              )}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            disabled={isLoading || !otp || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Code
              </>
            )}
          </Button>
        </form>

        {/* Resend OTP */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendOTP}
            disabled={!canResend || resendLoading}
            className="text-primary hover:text-primary/80"
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Resend Code
              </>
            )}
          </Button>
        </div>

        {/* Help text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Make sure your phone can receive SMS messages and check your spam folder.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};