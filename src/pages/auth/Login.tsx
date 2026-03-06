import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isSignup = params.get("mode") === "signup";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setPartnerId(null);
  }, [isSignup]);

  const sendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const normalizedPhone = phone.replace(/^\+91/, "").trim();
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
      const status = (userData.admin_status || userData.status || "").toUpperCase();

      if (status === "APPROVED") {
        setPartnerId(userDoc.id);
        toast.success("OTP Sent", { description: "Use 123456 (mock)" });
        setStep("otp");
        setTimer(30);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        toast.error("Your account is " + status.toLowerCase().replace(/_/g, " "));
      }
    } catch (error) {
      console.error("Error checking phone number:", error);
      toast.error("Failed to verify phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue !== "123456") {
      toast.error("Invalid OTP. Try 123456");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (partnerId) localStorage.setItem("partnerId", partnerId);
      toast.success("Login Successful");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 bg-card sticky top-0 z-10 flex items-center shadow-sm">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center pr-10 text-[16px] font-bold text-foreground">
          {isSignup ? "Partner Registration" : "Partner Login"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-5 pt-10">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
          <Phone className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-[22px] font-bold text-foreground mb-2 text-center">
          {step === "phone" ? "Enter your mobile number" : "Verify your number"}
        </h2>

        <p className="text-[14px] font-medium text-muted-foreground text-center mb-8">
          {step === "phone"
            ? "We'll send you a verification code via SMS."
            : `Code sent to +91 ${phone}`}
        </p>

        <div className="w-full max-w-md space-y-6">
          {step === "phone" ? (
            <>
              {/* Phone Input */}
              <div className="flex gap-3">
                <div className="w-[72px] h-[56px] flex flex-col items-center justify-center bg-card border border-border rounded-2xl shadow-sm text-[15px] font-bold text-foreground">
                  <span className="text-muted-foreground text-[10px] uppercase">Code</span>
                  +91
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={10}
                    disabled={loading}
                    className="w-full h-[56px] pl-4 pr-4 bg-card border border-border rounded-2xl shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-[16px] font-medium text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full btn-yellow py-[16px] text-[16px] disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input Grid */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-[50px] h-[60px] text-center text-[24px] font-bold bg-card border-2 border-border rounded-2xl focus:border-primary focus:bg-secondary focus:ring-4 focus:ring-primary/20 outline-none transition-all text-foreground"
                  />
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={verifyOTP}
                  disabled={otp.join("").length !== 6 || loading}
                  className="w-full btn-yellow py-[16px] text-[16px] disabled:opacity-50 disabled:active:scale-100"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <div className="flex justify-between items-center px-2">
                  <button
                    onClick={() => setStep("phone")}
                    disabled={loading}
                    className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change Number
                  </button>
                  <button
                    onClick={sendOTP}
                    disabled={timer > 0 || loading}
                    className="text-[14px] font-bold text-[#FFB300] disabled:text-muted-foreground transition-colors"
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
