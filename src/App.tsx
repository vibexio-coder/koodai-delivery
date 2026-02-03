import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Login from "./pages/auth/Login";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Step1BasicInfo from "./pages/onboarding/Step1BasicInfo";
import Step2Permissions from "./pages/onboarding/Step2Permissions";
import Step3KYC from "./pages/onboarding/Step3KYC";
import Step4Vehicle from "./pages/onboarding/Step4Vehicle";
import Step5Payment from "./pages/onboarding/Step5Payment";
import Step6Review from "./pages/onboarding/Step6Review";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import OrderHistory from "./pages/dashboard/OrderHistory";
import Earnings from "./pages/dashboard/Earnings";
import Profile from "./pages/dashboard/Profile";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                <div className="max-w-md mx-auto relative bg-background min-h-screen shadow-xl border-x">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/onboarding" element={<OnboardingLayout />}>
                            <Route path="step-1" element={<Step1BasicInfo />} />
                            <Route path="step-2" element={<Step2Permissions />} />
                            <Route path="step-3" element={<Step3KYC />} />
                            <Route path="step-4" element={<Step4Vehicle />} />
                            <Route path="step-5" element={<Step5Payment />} />
                            <Route path="step-6" element={<Step6Review />} />
                        </Route>
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<Home />} />
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="earnings" element={<Earnings />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </div>
                <Toaster position="top-center" />
            </div>
        </BrowserRouter>
    );
}
