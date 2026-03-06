import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { compressImage } from "../../utils/compressImage";

export default function Step4Vehicle() {
  const navigate = useNavigate();
  const setVehicle = useOnboardingStore((s) => s.setVehicle);

  const [vehicleType, setVehicleType] = useState("bike");
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [license, setLicense] = useState("");

  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [insurancePreview, setInsurancePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File size must be less than 5MB");
      setInsuranceFile(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInsuranceFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNext = async () => {
    const normalizedPlate = plate.replace(/\s+/g, " ").trim();
    const normalizedModel = model.trim();
    const normalizedLicense = license.replace(/\s+/g, "").trim();

    if (!vehicleType) return toast.error("Please select a vehicle type");
    if (!/^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{3,4}$/.test(normalizedPlate)) return toast.error("Enter valid vehicle number (TN 01 AB 1234)");
    if (!normalizedModel) return toast.error("Vehicle model is required");
    if (!/^(?:[A-Z]{2}-\d{2}-\d{4}-\d{7}|[A-Z]{2}\d{2}\d{4}\d{8})$/.test(normalizedLicense)) return toast.error("Enter valid DL number");
    if (!insuranceFile) return toast.error("Vehicle insurance is required");

    try {
      setLoading(true);
      const compressed = await compressImage(insuranceFile);

      setVehicle({
        vehicleType,
        plate: normalizedPlate,
        model: normalizedModel,
        license: normalizedLicense,
        insuranceImage: compressed
      });

      toast.success("Vehicle details saved");
      navigate("/onboarding/step-5");
    } catch (e) {
      toast.error("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">Vehicle Details</h1>
      <p className="text-[13px] text-[#666666] font-medium mt-[-12px] mb-4">Register your delivery vehicle.</p>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm space-y-4">

        {/* VEHICLE TYPE */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Vehicle Type <span className="text-[#D32F2F]">*</span></label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
          >
            <option value="bike">Motorcycle / Bike</option>
            <option value="scooter">Scooter</option>
            <option value="ev">Electric Vehicle</option>
          </select>
        </div>

        {/* NUMBER PLATE */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Vehicle Number <span className="text-[#D32F2F]">*</span></label>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value.replace(/[^A-Z0-9\s]/gi, "").toUpperCase())}
            placeholder="TN 01 AB 1234"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors uppercase placeholder:normal-case"
          />
        </div>

        {/* MODEL */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Vehicle Model <span className="text-[#D32F2F]">*</span></label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Honda Activa 6G"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
          />
        </div>

        {/* LICENSE */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Driving License <span className="text-[#D32F2F]">*</span></label>
          <input
            value={license}
            onChange={(e) => setLicense(e.target.value.replace(/[^A-Z0-9-]/gi, "").toUpperCase())}
            placeholder="TN77202400002053"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors uppercase placeholder:normal-case"
          />
        </div>

      </div>

      {/* INSURANCE UPLOAD */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden mb-4">
        <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[13px] font-bold text-[#1A1A1A]">Vehicle Insurance <span className="text-[#D32F2F]">*</span></h2>
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">{insuranceFile ? 'Uploaded' : 'Clear Photo'}</span>
        </div>

        <div className="p-4">
          {!insuranceFile ? (
            <label className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 bg-[#FAFAFA] flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.98]">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <Upload className="w-5 h-5 text-[#FFB300]" />
              </div>
              <p className="text-[13px] font-bold text-[#1A1A1A] text-center mb-1">Upload Insurance Policy</p>
              <p className="text-[11px] font-medium text-[#9CA3AF] text-center">JPG, PNG or PDF under 5MB</p>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#FAFAFA] flex items-center justify-between">
              <div
                className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer"
                onClick={() => setInsurancePreview(URL.createObjectURL(insuranceFile))}
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                  <FileText className="w-5 h-5 text-[#4CAF50]" />
                </div>
                <div className="truncate pr-4">
                  <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{insuranceFile.name}</p>
                  <p className="text-[11px] font-medium text-[#4CAF50]">{(insuranceFile.size / 1024).toFixed(1)} KB • Ready</p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {insurancePreview && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
              <h3 className="text-[14px] font-bold text-[#1A1A1A] truncate pr-4">{insuranceFile?.name}</h3>
              <button onClick={() => setInsurancePreview(null)} className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                <X className="w-4 h-4 text-[#1A1A1A]" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex justify-center items-center bg-[#F5F5F5]">
              {insuranceFile?.type === "application/pdf" ? (
                <iframe src={insurancePreview} className="w-full h-[60vh] rounded-lg border border-gray-200" />
              ) : (
                <img src={insurancePreview} className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-200 shadow-sm" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full btn-yellow py-[16px] text-[16px] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 rounded-full border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] animate-spin" /> : "Save Vehicle Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
