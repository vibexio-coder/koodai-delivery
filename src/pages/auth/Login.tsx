import React, { useState } from "react";
import {
    Phone,
    ShoppingBag,
    ArrowLeft,
    Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { toast } from "sonner";

const toastDesc = (text: string): React.ReactNode => (
    <span style={{ color: "#6B7280" }}>{text}</span>
);

const WelcomeScreen = ({
    onLogin,
    onSignup,
}: {
    onLogin: () => void;
    onSignup: () => void;
}) => {
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg mb-6">
                    <Truck className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-black mb-2">KOODAI DELIVERY</h1>
                <p className="text-gray-600 text-center mb-8">
                    Delivery Partner App. Join the fleet.
                </p>

                <div className="w-full max-w-md space-y-4">
                    <Button
                        onClick={onLogin}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium transition-all duration-200"
                    >
                        Login
                    </Button>

                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <Button
                        onClick={onSignup}
                        variant="outline"
                        className="w-full border-2 border-yellow-400 hover:bg-yellow-50 text-black py-6 rounded-xl font-medium transition-all duration-200"
                    >
                        Register as Partner
                    </Button>
                </div>
            </div>
        </div>
    );
};

const LoginComponent = ({
    onBack,
    onComplete,
    isSignup = false,
}: {
    onBack: () => void;
    onComplete: (isSignup: boolean) => void;
    isSignup?: boolean;
}) => {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle phone submission (for OTP verification)
    const handleSendOTP = async () => {
        if (!phone.trim()) {
            toast.error("Mobile number required", { description: toastDesc("Please enter your mobile number.") });
            return;
        }
        if (phone.length !== 10) {
            toast.error("Invalid mobile number", { description: toastDesc("Please enter a valid 10-digit mobile number.") });
            return;
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Invalid number", { description: toastDesc("Please enter a valid mobile number") });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setStep("otp");
            toast.success("OTP Sent Successfully!", { description: toastDesc("OTP: 123456 (Mock)") });
            setLoading(false);
        }, 1500);
    };

    // Handle OTP verification
    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            toast.error("OTP required", { description: toastDesc("Please enter the 6-digit OTP.") });
            return;
        }
        if (otp.length !== 6) {
            toast.error("Invalid OTP", { description: toastDesc("Please enter a valid 6-digit OTP.") });
            return;
        }
        // Mock OTP validation
        if (otp !== "123456") {
            toast.error("Incorrect OTP", { description: toastDesc("Try 123456.") });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            toast.success(isSignup ? "Mobile Verified!" : "Login Successful!", {
                description: toastDesc(isSignup ? "Proceeding to onboarding..." : "Welcome back!"),
            });
            onComplete(isSignup);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col overflow-y-auto">
            <div className="p-4 sticky top-0 z-10 ">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center px-4 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 mt-15">
                    {isSignup ? "Partner Registration" : "Partner Login"}
                </h1>
                <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
                    {step === "phone" ? "Enter your mobile number to continue" : `Verify OTP sent to +91 ${phone}`}
                </p>

                <div className="w-full max-w-md space-y-6">
                    {step === "phone" ? (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Mobile Number
                                </label>
                                <div className="flex gap-2">
                                    <div className="w-14 sm:w-16 flex items-center justify-center bg-white border border-gray-300 rounded-xl text-black font-medium text-sm sm:text-base">
                                        +91
                                    </div>
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <Input
                                            type="tel"
                                            placeholder="9876543210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                                            maxLength={10}
                                            inputMode="numeric"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSendOTP}
                                disabled={loading || phone.length !== 10}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
                            >
                                {loading ? "Sending OTP..." : "Get OTP"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                    <InputOTPGroup>
                                        {[...Array(6)].map((_, i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-xl mx-1 sm:mx-1 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <Button
                                onClick={handleVerifyOTP}
                                disabled={otp.length !== 6 || loading}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
                            >
                                {loading ? "Verifying..." : "Verify & Continue"}
                            </Button>

                            <Button
                                onClick={() => setStep("phone")}
                                variant="ghost"
                                className="w-full"
                            >Change Number</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Login() {
    const [mode, setMode] = useState<"welcome" | "login" | "signup">("welcome");
    const navigate = useNavigate();

    const handleComplete = (isSignup: boolean) => {
        if (isSignup) {
            navigate("/onboarding/step-1");
        } else {
            navigate("/dashboard");
        }
    };

    if (mode === "welcome") {
        return <WelcomeScreen onLogin={() => setMode("login")} onSignup={() => setMode("signup")} />;
    }

    return (
        <LoginComponent
            onBack={() => setMode("welcome")}
            onComplete={handleComplete}
            isSignup={mode === "signup"}
        />
    );
}
