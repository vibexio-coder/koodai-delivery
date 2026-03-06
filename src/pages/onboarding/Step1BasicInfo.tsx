import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { Camera, X, Check } from "lucide-react";
import { indianStates } from "../../data/indianStates";

export default function Step1BasicInfo() {
  const navigate = useNavigate();
  const { basicInfo, setBasicInfo } = useOnboardingStore();

  const [profilePhoto, setProfilePhoto] = useState<string>(basicInfo?.profilePhoto || "");
  const [name, setName] = useState(basicInfo?.name || "");
  const [houseNo, setHouseNo] = useState(basicInfo?.houseNo || "");
  const [street, setStreet] = useState(basicInfo?.street || "");
  const [area, setArea] = useState(basicInfo?.area || "");
  const [landmark, setLandmark] = useState(basicInfo?.landmark || "");
  const [city, setCity] = useState(basicInfo?.city || "");
  const [state, setState] = useState(basicInfo?.state || "");
  const [pincode, setPincode] = useState(basicInfo?.pincode || "");
  const [districts, setDistricts] = useState<string[]>([]);
  const [emergency, setEmergency] = useState(basicInfo?.emergency || "");
  const [email, setEmail] = useState(basicInfo?.email || "");

  const [phone, setPhone] = useState(basicInfo?.phone || "");
  const [phoneOTP, setPhoneOTP] = useState(["", "", "", "", "", ""]);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(!!basicInfo?.phone);
  const [phoneTimer, setPhoneTimer] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (state && indianStates[state]) {
      setDistricts(indianStates[state]);
      if (!indianStates[state].includes(city)) setCity("");
    } else {
      setDistricts([]);
      setCity("");
    }
  }, [state]);

  useEffect(() => {
    if (phoneTimer <= 0) return;
    const interval = setInterval(() => setPhoneTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) return toast.error("File size should be less than 500KB");
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendPhoneOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return toast.error("Enter a valid 10-digit mobile number");
    setPhoneOTPSent(true);
    setPhoneTimer(30);
    setPhoneOTP(["", "", "", "", "", ""]);
    toast.success("OTP sent", { description: "Use 111111" });
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...phoneOTP];
    newOtp[index] = value;
    setPhoneOTP(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !phoneOTP[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const confirmPhoneOTP = () => {
    if (phoneOTP.join("") !== "111111") return toast.error("Invalid OTP. Try 111111");
    setPhoneVerified(true);
    setPhoneTimer(0);
    toast.success("Mobile number verified");
  };

  const handleNext = () => {
    const normalizedName = name.replace(/\s+/g, " ").trim();
    if (!profilePhoto) return toast.error("Profile photo is required");
    if (!normalizedName) return toast.error("Full name is required");
    if (!houseNo.trim()) return toast.error("House No. is required");
    if (!street.trim()) return toast.error("Street Name is required");
    if (!area.trim()) return toast.error("Area is required");
    if (!city.trim()) return toast.error("City is required");
    if (!state) return toast.error("State is required");
    if (!/^\d{6}$/.test(pincode.trim())) return toast.error("Enter a valid 6-digit Pincode");
    if (!landmark.trim()) return toast.error("Landmark is required");
    if (!phoneVerified) return toast.error("Please verify your mobile number");
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) return toast.error("Enter a valid email address");

    setBasicInfo({
      profilePhoto,
      name: normalizedName,
      houseNo: houseNo.trim(),
      street: street.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      emergency,
      phone,
      email: email.trim(),
    });
    navigate("/onboarding/step-2");
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">Basic Information</h1>
      <p className="text-[13px] text-[#666666] font-medium mt-[-12px] mb-4">Provide your personal details to get started.</p>

      {/* PHOTO UPLOAD CARD */}
      <div className="bg-white rounded-2xl p-5 border border-[rgba(0,0,0,0.08)] shadow-sm flex flex-col items-center">
        <div className="relative w-28 h-28 mb-3">
          <div className={`w-full h-full rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${profilePhoto ? 'border-[#FFC107] bg-white' : 'border-[#D1D5DB] bg-[#F5F5F5]'}`}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-[#9CA3AF]" />
            )}
          </div>
          {profilePhoto ? (
            <button onClick={removePhoto} className="absolute top-0 right-0 bg-[#D32F2F] text-white rounded-full p-1.5 shadow-md active:scale-95">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute bottom-0 right-0">
              <label htmlFor="profile-upload" className="cursor-pointer bg-[#FFC107] text-[#1A1A1A] rounded-full p-2.5 shadow-md flex items-center justify-center active:scale-95 transition-transform">
                <Camera className="w-4 h-4" />
              </label>
              <input id="profile-upload" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
            </div>
          )}
        </div>
        <p className="text-[14px] font-bold text-[#1A1A1A]">Profile Photo <span className="text-[#D32F2F]">*</span></p>
        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Please upload a clear selfie</p>
      </div>

      {/* FULL NAME */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm">
        <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Full Name <span className="text-[#D32F2F]">*</span></label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^A-Za-z ]/g, ""))}
          placeholder="e.g. Rajavel Kumar"
          className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
        />
      </div>

      {/* ADDRESS DETAILS */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm space-y-4">
        <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-2">Address Details</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">House No. <span className="text-[#D32F2F]">*</span></label>
            <input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="No. 12" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Street <span className="text-[#D32F2F]">*</span></label>
            <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Gandhi Rd" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Area <span className="text-[#D32F2F]">*</span></label>
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Adyar" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Pincode <span className="text-[#D32F2F]">*</span></label>
            <input value={pincode} maxLength={6} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="600001" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">State <span className="text-[#D32F2F]">*</span></label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors">
              <option value="" disabled>Select</option>
              {Object.keys(indianStates).sort().map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">City <span className="text-[#D32F2F]">*</span></label>
            <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!state} className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors disabled:opacity-50">
              <option value="" disabled>Select</option>
              {districts.sort().map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Landmark <span className="text-[#D32F2F]">*</span></label>
          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near Bus Stand" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
        </div>
      </div>

      {/* CONTACT DOC */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm space-y-4">
        <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-2">Contact Info</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Mobile Number <span className="text-[#D32F2F]">*</span></label>
            <div className="flex gap-2">
              <input
                value={phone}
                disabled={phoneVerified}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className={`flex-1 bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3 outline-none focus:border-[#FFC107] transition-colors ${phoneVerified ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]' : ''}`}
              />
              {phoneVerified ? (
                <div className="w-[84px] bg-[#E8F5E9] text-[#4CAF50] rounded-xl flex items-center justify-center border border-[#4CAF50]">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </div>
              ) : (
                <button onClick={sendPhoneOTP} disabled={phoneVerified || phoneTimer > 0} className="w-[84px] bg-[#FFF8E1] text-[#FFB300] font-bold rounded-xl active:scale-95 transition-transform text-[13px]">
                  {phoneTimer > 0 ? `${phoneTimer}s` : "VERIFY"}
                </button>
              )}
            </div>

            {phoneOTPSent && !phoneVerified && (
              <div className="mt-3 bg-[#FAFAFA] p-3 rounded-xl border border-gray-100">
                <p className="text-[11px] text-[#666666] mb-2">Enter 6-digit OTP sent to +91 {phone}</p>
                <div className="flex justify-between gap-1 mb-3">
                  {phoneOTP.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-[18px] font-bold bg-white border border-[#E5E7EB] rounded-xl focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 outline-none transition-all text-[#1A1A1A]"
                    />
                  ))}
                </div>
                <div className="space-y-3">
                  <button onClick={confirmPhoneOTP} disabled={phoneOTP.join("").length !== 6} className="w-full btn-yellow py-2.5 text-[13px]">Confirm OTP</button>
                  <button
                    onClick={sendPhoneOTP}
                    disabled={phoneTimer > 0}
                    className="w-full text-center text-[13px] font-bold text-[#FFB300] disabled:text-[#9CA3AF] transition-colors"
                  >
                    {phoneTimer > 0 ? `Resend OTP in ${phoneTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Email <span className="text-[10px] text-gray-400 font-normal lowercase">(Optional)</span></label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-1.5 block">Emergency Contact <span className="text-[10px] text-gray-400 font-normal lowercase">(Optional)</span></label>
            <input value={emergency} maxLength={10} onChange={(e) => setEmergency(e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[14px] font-semibold rounded-xl px-3 py-3 outline-none focus:border-[#FFC107] transition-colors" />
          </div>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30">
        <div className="max-w-md mx-auto">
          <button onClick={handleNext} className="w-full btn-yellow py-[16px] text-[16px] flex justify-center items-center gap-2">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
