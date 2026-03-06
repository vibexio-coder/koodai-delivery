import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OnboardingLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const steps = [
        "/onboarding/step-1",
        "/onboarding/step-2",
        "/onboarding/step-3",
        "/onboarding/step-4",
        "/onboarding/step-5",
        "/onboarding/step-6",
    ];

    useEffect(() => {
        const currentIndex = steps.findIndex(step => location.pathname === step);
        if (currentIndex !== -1) {
            setProgress(((currentIndex + 1) / steps.length) * 100);
        }
    }, [location]);

    const handleBack = () => {
        const currentIndex = steps.findIndex(step => location.pathname === step);
        if (currentIndex === 0) {
            navigate("/");
        } else if (currentIndex > 0) {
            navigate(steps[currentIndex - 1]);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <div className="bg-white p-4 pt-10 flex flex-col gap-4 border-b border-[rgba(0,0,0,0.08)] sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#F5F5F5] active:scale-95 transition-transform">
                        <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
                    </button>
                    <div>
                        <h2 className="text-[16px] font-bold text-[#1A1A1A]">Partner Registration</h2>
                        <p className="text-[12px] font-medium text-[#9CA3AF]">Complete {steps.length} steps to join</p>
                    </div>
                </div>

                {/* Yellow glowing progress bar matching consumer */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#FFC107] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,193,7,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1A1A1A] w-[3ch]">{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 p-5 pb-32 max-w-md mx-auto w-full relative">
                <Outlet />
            </div>
        </div>
    );
}
