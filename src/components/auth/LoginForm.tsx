import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Eye, EyeOff, Mail, Phone, Lock, Loader2,
  Shield, Smartphone, KeyRound, ShieldCheck,
} from "lucide-react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { PhoneOTPForm } from "./PhoneOTPForm";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { login, loginWithPhone, loginWithGoogle, verifyGoogleOTP, isLoading } = useAuth();

  // Email/Password login state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);

  const [activeTab, setActiveTab] = useState("email");

  // Google OTP state - lives here so Dialog renders in normal React tree
  type GoogleStep = "idle" | "otp" | "phone";
  const [googleStep, setGoogleStep] = useState<GoogleStep>("idle");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [googlePhone, setGooglePhone] = useState("");
  const [googleOtp, setGoogleOtp] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startTimer = () => {
    setResendTimer(60);
    const id = setInterval(() => {
      setResendTimer((p) => {
        if (p <= 1) { clearInterval(id); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  // Called by GoogleLoginButton when OTP has been sent
  const handleOtpReady = (email: string, token: string) => {
    setGoogleEmail(email);
    setGoogleToken(token);
    setGoogleOtp("");
    setGoogleStep("otp");
    startTimer();
  };

  // Called by GoogleLoginButton when new user needs phone
  const handlePhoneRequired = (token: string) => {
    setGoogleToken(token);
    setGooglePhone("");
    setGoogleStep("phone");
  };

  const handleGooglePhoneSubmit = async () => {
    if (!googlePhone || googlePhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(googleToken, googlePhone);
      if (result?.success) {
        setGoogleEmail(result.data.email);
        setGoogleStep("otp");
        startTimer();
        toast.success("OTP sent to " + result.data.email);
      } else {
        toast.error(result?.message || "Error sending OTP");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleOtpVerify = async () => {
    if (googleOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await verifyGoogleOTP(googleEmail, googleOtp);
      if (result?.success) {
        toast.success("Login successful!");
        setGoogleStep("idle");
        setGoogleOtp("");
      } else {
        toast.error(result?.message || "Invalid OTP");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleResend = async () => {
    if (resendTimer > 0) return;
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(googleToken, googlePhone || undefined);
      if (result?.success) {
        startTimer();
        toast.success("New OTP sent!");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email/Password ──────────────────────────────────────────────────────────
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) { toast.error("Please fill in all fields"); return; }
    const result = await login(identifier, password);
    if (result.success) { toast.success("Login successful!"); }
    else { toast.error(result.message || "Login failed"); }
  };

  // ── Phone OTP ───────────────────────────────────────────────────────────────
  const handlePhoneLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) { toast.error("Please enter your phone number"); return; }
    const result = await loginWithPhone(phoneNumber);
    if (result.success) { setShowPhoneOTP(true); toast.success("OTP sent to your phone number"); }
    else { toast.error(result.message || "Failed to send OTP"); }
  };

  if (showPhoneOTP) {
    return (
      <PhoneOTPForm
        phoneNumber={phoneNumber}
        onSuccess={() => { setShowPhoneOTP(false); setPhoneNumber(""); toast.success("Login successful!"); }}
        onCancel={() => setShowPhoneOTP(false)}
        purpose="login"
      />
    );
  }

  return (
    <>
      {/* ── Google Phone Dialog ─────────────────────────────────────────────── */}
      <Dialog open={googleStep === "phone"} onOpenChange={() => setGoogleStep("idle")}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Phone Number</DialogTitle>
            <DialogDescription>
              First time signing in with Google. Phone number is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={googlePhone}
              onChange={(e) => setGooglePhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGooglePhoneSubmit()}
              autoFocus
            />
            <Button className="w-full" onClick={handleGooglePhoneSubmit} disabled={googleLoading}>
              {googleLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : "Send OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Google OTP Dialog ───────────────────────────────────────────────── */}
      <Dialog open={googleStep === "otp"} onOpenChange={() => setGoogleStep("idle")}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Verify Gmail OTP</DialogTitle>
            <DialogDescription className="text-center">
              <span className="flex items-center justify-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                <span className="font-medium text-foreground">{googleEmail}</span>
              </span>
              <span className="block mt-1">A 6-digit OTP has been sent to your Gmail</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={googleOtp}
              onChange={(e) => setGoogleOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleGoogleOtpVerify()}
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
            <Button
              className="w-full"
              onClick={handleGoogleOtpVerify}
              disabled={googleLoading || googleOtp.length !== 6}
            >
              {googleLoading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                : "Verify & Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive OTP?{" "}
              {resendTimer > 0
                ? <span>Resend in {resendTimer}s</span>
                : <button className="text-primary underline" onClick={handleGoogleResend} disabled={googleLoading}>Resend OTP</button>}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Main Login Card ─────────────────────────────────────────────────── */}
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to your HealthLock account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email/Phone
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                OTP Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium">
                    Email or Phone Number
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your email or phone number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                        : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</>
                    : <><Lock className="mr-2 h-4 w-4" />Sign In</>}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-6">
              <div className="text-center mb-4">
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-foreground">
                  <KeyRound className="h-3 w-3 mr-1" />
                  Passwordless Login
                </span>
              </div>

              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send you a verification code via SMS
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP...</>
                    : <><Smartphone className="mr-2 h-4 w-4" />Send OTP</>}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <GoogleLoginButton
            loginWithGoogle={loginWithGoogle}
            onOtpReady={handleOtpReady}
            onPhoneRequired={handlePhoneRequired}
            onError={(msg) => toast.error(msg)}
          />

          <div className="text-center space-y-2">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => {}}
            >
              Forgot your password?
            </Button>

            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                onClick={onSwitchToRegister}
              >
                Sign up here
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
