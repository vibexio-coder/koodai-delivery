import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { Camera, X } from "lucide-react";
import { indianStates } from "../../data/indianStates";

export default function Step1BasicInfo() {
  const navigate = useNavigate();
  const { basicInfo, setBasicInfo } = useOnboardingStore();

  /* ---------- STATE ---------- */
  const [profilePhoto, setProfilePhoto] = useState<string>(basicInfo?.profilePhoto || "");
  const [name, setName] = useState(basicInfo?.name || "");

  // Split address fields
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
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(!!basicInfo?.phone); // Assume verified if loaded from store? Maybe safer to require re-verification or store verification status. 
  // For now, let's keep phoneVerified false to require re-verification or add it to store. 
  // Actually usually phone is verified once. Let's start with unverified to be safe or check if store has phone.
  // If phone exists in store, we might assume it was verified before saving?
  // Let's stick to user request: "details should be there".
  // Note: Phone verification state isn't part of 'basicInfo' interface currently except the phone number itself.
  // I'll leave phoneVerified as false, forcing re-verification if they change it, or true if phone matches?
  // Let's modify:
  // const [phoneVerified, setPhoneVerified] = useState(!!basicInfo?.phone);
  // This is a reasonable assumption for "draft" saving if we allowed saving partials, but here we only save on "Next".
  // So if data is in store, it was verified.

  const [phoneTimer, setPhoneTimer] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- EFFECT FOR DISTRICTS ---------- */
  useEffect(() => {
    if (state && indianStates[state]) {
      setDistricts(indianStates[state]);
      // Reset city if not in new districts list
      if (!indianStates[state].includes(city)) {
        setCity("");
      }
    } else {
      setDistricts([]);
      setCity("");
    }
  }, [state]);

  /* ---------- OTP TIMER ---------- */
  useEffect(() => {
    if (phoneTimer <= 0) return;
    const interval = setInterval(() => {
      setPhoneTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------- PROFILE PHOTO ---------- */
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit
        toast.error("File size should be less than 500KB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------- SEND OTP (MOCK) ---------- */
  const sendPhoneOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setPhoneOTPSent(true);
    setPhoneTimer(60);
    setPhoneOTP("");

    toast.success("OTP sent", {
      description: "Use 111111 (mock verification)",
    });
  };

  /* ---------- VERIFY OTP ---------- */
  const confirmPhoneOTP = () => {
    if (phoneOTP.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    if (phoneOTP !== "111111") {
      toast.error("Invalid OTP");
      return;
    }

    setPhoneVerified(true);
    setPhoneTimer(0);
    toast.success("Mobile number verified");
  };

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    const normalizedName = name.replace(/\s+/g, " ").trim();
    const normalizedHouseNo = houseNo.trim();
    const normalizedStreet = street.trim();
    const normalizedArea = area.trim();
    const normalizedLandmark = landmark.trim(); // Mandatory as per request
    const normalizedCity = city.trim();
    const normalizedPincode = pincode.trim();
    const normalizedEmail = email.trim();

    if (!profilePhoto) {
      toast.error("Profile photo is required");
      return;
    }

    if (!normalizedName) {
      toast.error("Full name is required");
      return;
    }

    if (!normalizedHouseNo) {
      toast.error("House No. is required");
      return;
    }
    if (!normalizedStreet) {
      toast.error("Street Name is required");
      return;
    }
    if (!normalizedArea) {
      toast.error("Area is required");
      return;
    }

    if (!normalizedCity) {
      toast.error("City is required");
      return;
    }
    if (!state) {
      toast.error("State is required");
      return;
    }
    if (!/^\d{6}$/.test(normalizedPincode)) {
      toast.error("Enter a valid 6-digit Pincode");
      return;
    }

    if (!normalizedLandmark) {
      toast.error("Landmark is required");
      return;
    }

    if (!phoneVerified) {
      toast.error("Please verify your mobile number");
      return;
    }

    if (normalizedEmail && !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      toast.error("Enter a valid email address");
      return;
    }

    /* SAVE TO STORE */
    setBasicInfo({
      profilePhoto,
      name: normalizedName,
      houseNo: normalizedHouseNo,
      street: normalizedStreet,
      area: normalizedArea,
      landmark: normalizedLandmark,
      city: normalizedCity,
      state,
      pincode: normalizedPincode,
      emergency,
      phone,
      email: normalizedEmail,
    });

    navigate("/onboarding/step-2");
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Basic Information</h1>

      {/* PROFILE PHOTO */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <div className={`w-full h-full rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted ${profilePhoto ? 'border-primary' : ''}`}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          {profilePhoto && (
            <button
              onClick={removePhoto}
              className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {!profilePhoto && (
            <div className="absolute bottom-0 right-0">
              <Label htmlFor="profile-upload" className="cursor-pointer bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </Label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Upload Profile Photo <span className="text-destructive">*</span>
        </p>
      </div>

      <div className="space-y-4">
        {/* NAME */}
        <div>
          <Label className="text-foreground">Full Name <span className="text-destructive">*</span></Label>
          <Input
            value={name}
            onChange={(e) =>
              setName(e.target.value.replace(/[^A-Za-z ]/g, ""))
            }
            placeholder="Enter your full name"
          />
        </div>

        {/* ADDRESS */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Address Details</Label>

          {/* ROW 1: House No, Street */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">House No. <span className="text-destructive">*</span></Label>
              <Input
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="No. 12"
              />
            </div>
            <div>
              <Label className="text-foreground">Street Name <span className="text-destructive">*</span></Label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Gandhi Road"
              />
            </div>
          </div>

          {/* ROW 2: Area, Pincode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Area <span className="text-destructive">*</span></Label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Adyar"
              />
            </div>
            <div>
              <Label className="text-foreground">Pincode <span className="text-destructive">*</span></Label>
              <Input
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="600001"
              />
            </div>
          </div>

          {/* ROW 3: State, City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">State <span className="text-destructive">*</span></Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(indianStates).sort().map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">City/District <span className="text-destructive">*</span></Label>
              <Select
                value={city}
                onValueChange={setCity}
                disabled={!state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {districts.sort().map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ROW 4: Landmark */}
          <div>
            <Label className="text-foreground">Landmark <span className="text-destructive">*</span></Label>
            <Input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Near Bus Stand"
            />
          </div>
        </div>

        {/* EMERGENCY */}
        <div>
          <Label className="text-foreground">Emergency Contact (Optional)</Label>
          <Input
            value={emergency}
            maxLength={10}
            onChange={(e) =>
              setEmergency(e.target.value.replace(/\D/g, ""))
            }
            placeholder="10-digit number"
          />
        </div>

        {/* PHONE */}
        <div className="space-y-2">
          <Label className="text-foreground">Mobile Number <span className="text-destructive">*</span></Label>

          <div className="flex gap-2">
            <Input
              value={phone}
              disabled={phoneVerified}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter mobile number"
            />

            <Button
              onClick={sendPhoneOTP}
              disabled={phoneVerified || phoneTimer > 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {phoneTimer > 0 ? formatTime(phoneTimer) : "Verify"}
            </Button>
          </div>

          {phoneOTPSent && !phoneVerified && (
            <div className="space-y-2">
              <InputOTP
                value={phoneOTP}
                onChange={setPhoneOTP}
                maxLength={6}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={confirmPhoneOTP}
                >
                  Confirm OTP
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={phoneTimer > 0}
                  onClick={sendPhoneOTP}
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <Label className="text-foreground">Email Address (Optional)</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
      >
        Save & Continue
      </Button>
    </div>
  );
}
