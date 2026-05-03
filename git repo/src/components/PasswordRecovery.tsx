import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Mail, MessageSquare, ArrowLeft, Lock, Eye, EyeOff, BarChart3 } from "lucide-react";

interface PasswordRecoveryProps {
  email: string;
  onBack: () => void;
  onComplete: () => void;
}

export function PasswordRecovery({ email, onBack, onComplete }: PasswordRecoveryProps) {
  const [step, setStep] = useState<"method" | "verify" | "reset">("method");
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setIsLoading(true);
      // Mock OTP verification
      setTimeout(() => {
        setIsLoading(false);
        setStep("reset");
      }, 1000);
    }
  };

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      setIsLoading(true);
      // Mock password reset
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-medium">ExpenseTracker</span>
          </div>
          <h2 className="text-xl font-medium">
            {step === "method" && "Choose Recovery Method"}
            {step === "verify" && "Verify Your Identity"}
            {step === "reset" && "Reset Your Password"}
          </h2>
          <p className="text-muted-foreground">
            {step === "method" && "How would you like to receive your verification code?"}
            {step === "verify" && `We've sent a 6-digit code to your ${method === "email" ? "email" : "phone"}`}
            {step === "reset" && "Create a new password for your account"}
          </p>
        </div>

        <Card className="p-6">
          {step === "method" && (
            <div className="space-y-4">
              <Tabs value={method} onValueChange={(value) => setMethod(value as "email" | "sms")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll send a verification code to this email address.
                    </p>
                  </div>

                  <Button onClick={handleSendOTP} disabled={isLoading} className="w-full">
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </TabsContent>

                <TabsContent value="sms" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll send a verification code to this phone number.
                    </p>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !phoneNumber}
                    className="w-full"
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </TabsContent>
              </Tabs>

              <Button variant="ghost" onClick={onBack} className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <Label>Enter Verification Code</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Code sent to {method === "email" ? email : phoneNumber}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Didn't receive the code? Resend
                  </Button>
                </div>
              </div>

              <Button variant="ghost" onClick={() => setStep("method")} className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Change Method
              </Button>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Password must be at least 8 characters long.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match.</p>
                )}
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
                className="w-full"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}