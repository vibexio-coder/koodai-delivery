import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isSignup = params.get("mode") === "signup";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    setStep("phone");
    setOtp("");
    setPartnerId(null);
  }, [isSignup]);

  const sendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      // Normalize phone number: remove +91 if present, trim spaces
      const normalizedPhone = phone.replace(/^\+91/, "").trim();

      // Querying basicInfo.phone with normalized 10-digit number
      const q = query(
        collection(db, "delivery"),
        where("basicInfo.phone", "==", normalizedPhone)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("This phone number is not registered as a delivery partner.");
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      // key is admin_status as per new design, fallback to status for backward compat if needed
      const status = (userData.admin_status || userData.status || "").toUpperCase();

      if (status === "APPROVED") {
        setPartnerId(userDoc.id);
        toast.success("OTP Sent", { description: "Use 123456 (mock)" });
        setStep("otp");
      } else if (status === "PENDING" || status === "PENDING_VERIFICATION") {
        toast.error("Your application is under review");
      } else if (status === "SUSPENDED") {
        toast.error("Your account is suspended. Contact support");
      } else if (status === "REJECTED") {
        toast.error("Your application was rejected");
      } else {
        toast.error("Invalid account status: " + status);
      }
    } catch (error) {
      console.error("Error checking phone number:", error);
      toast.error("Failed to verify phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp !== "123456") {
      toast.error("Invalid OTP", { description: "Try 123456" });
      return;
    }

    setLoading(true);

    // Simulate verification delay
    setTimeout(() => {
      if (partnerId) {
        localStorage.setItem("partnerId", partnerId);
      }

      toast.success("Login Successful");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2 mt-6">
          {isSignup ? "Partner Registration" : "Partner Login"}
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          {step === "phone"
            ? "Enter your mobile number to continue"
            : `Verify OTP sent to +91 ${phone}`}
        </p>

        <div className="w-full max-w-md space-y-6">
          {step === "phone" ? (
            <>
              <div className="flex gap-2">
                <div className="w-14 flex items-center justify-center bg-card border border-border rounded-xl text-foreground">
                  +91
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="pl-9 py-6 rounded-xl"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-12 border-2 rounded-xl border-border bg-card text-foreground"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={verifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep("phone")}
                className="w-full text-foreground hover:bg-accent"
                disabled={loading}
              >
                Change Number
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
