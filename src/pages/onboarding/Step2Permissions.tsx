import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Bell } from "lucide-react";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step2Permissions() {
  const navigate = useNavigate();
  const setPermissions = useOnboardingStore((s) => s.setPermissions);

  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [notificationAllowed, setNotificationAllowed] = useState(true);

  // GPS is mandatory and always enabled
  const gpsAllowed = true;

  const handleNext = () => {
    if (!cameraAllowed) return toast.error("Camera permission is required");
    if (!notificationAllowed) return toast.error("Notification permission is required");

    setPermissions({ cameraAllowed, notificationAllowed, gpsAllowed });
    navigate("/onboarding/step-3");
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">System Permissions</h1>
      <p className="text-[13px] text-[#666666] font-medium mt-[-12px] mb-4">We need access to these features to provide the delivery service.</p>

      <div className="space-y-4">
        {/* GPS */}
        <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center border border-[rgba(255,193,7,0.2)] shrink-0">
            <MapPin className="w-6 h-6 text-[#FFB300]" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[15px] font-bold text-[#1A1A1A]">Location (GPS)</label>
              <div className="w-11 h-6 bg-[#4CAF50] rounded-full relative opacity-50 cursor-not-allowed">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
            <p className="text-[12px] font-medium text-[#9CA3AF] leading-tight">Required for order assignment and navigation.</p>
          </div>
        </div>

        {/* CAMERA */}
        <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center border border-[rgba(255,193,7,0.2)] shrink-0">
            <Camera className="w-6 h-6 text-[#FFB300]" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[15px] font-bold text-[#1A1A1A]">Camera Access</label>
              <button
                onClick={() => setCameraAllowed(!cameraAllowed)}
                className={`w-11 h-6 rounded-full relative transition-colors ${cameraAllowed ? 'bg-[#4CAF50]' : 'bg-[#E5E7EB]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${cameraAllowed ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
            <p className="text-[12px] font-medium text-[#9CA3AF] leading-tight">Required to capture proof of delivery at drop-off.</p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center border border-[rgba(255,193,7,0.2)] shrink-0">
            <Bell className="w-6 h-6 text-[#FFB300]" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[15px] font-bold text-[#1A1A1A]">Notifications</label>
              <button
                onClick={() => setNotificationAllowed(!notificationAllowed)}
                className={`w-11 h-6 rounded-full relative transition-colors ${notificationAllowed ? 'bg-[#4CAF50]' : 'bg-[#E5E7EB]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notificationAllowed ? 'left-[22px]' : 'left-[2px]'}`} />
              </button>
            </div>
            <p className="text-[12px] font-medium text-[#9CA3AF] leading-tight">Required to receive instant order alerts.</p>
          </div>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!cameraAllowed || !notificationAllowed}
            className="w-full btn-yellow py-[16px] text-[16px] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            Grant Permissions & Continue
          </button>
        </div>
      </div>
    </div>
  );
}