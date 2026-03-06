import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { compressImage } from "../../utils/compressImage";

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export default function Step3KYC() {
  const navigate = useNavigate();
  const setKYC = useOnboardingStore((s) => s.setKYC);

  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [license, setLicense] = useState<File | null>(null);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRefs = {
    aadhaar: useRef<HTMLInputElement>(null),
    pan: useRef<HTMLInputElement>(null),
    license: useRef<HTMLInputElement>(null)
  };

  const validateFile = (file: File | null, label: string) => {
    if (!file) { toast.error(`${label} is required`); return false; }
    if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`${label}: Only JPG, PNG or PDF allowed`); return false; }
    if (file.size > MAX_FILE_SIZE) { toast.error(`${label}: File must be under 500KB`); return false; }
    return true;
  };

  const handleNext = async () => {
    if (!validateFile(aadhaar, "Aadhaar Card")) return;
    if (!validateFile(pan, "PAN Card")) return;
    if (!validateFile(license, "Driving License")) return;

    try {
      setLoading(true);
      const aadhaarBase64 = aadhaar ? await compressImage(aadhaar) : "";
      const panBase64 = pan ? await compressImage(pan) : "";
      const licenseBase64 = license ? await compressImage(license) : "";

      setKYC({ aadhaarBase64, panBase64, licenseBase64 });

      toast.success("Documents attached successfully");
      navigate("/onboarding/step-4");
    } catch {
      toast.error("Failed to process documents");
    } finally {
      setLoading(false);
    }
  };

  const UploadBox = ({ label, file, setFile, inputRef, description }: any) => (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden mb-4">
      <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[13px] font-bold text-[#1A1A1A]">{label} <span className="text-[#D32F2F]">*</span></h2>
        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">{file ? 'Uploaded' : description}</span>
      </div>

      <div className="p-4">
        {!file ? (
          <label className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 bg-[#FAFAFA] flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.98]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <Upload className="w-5 h-5 text-[#FFB300]" />
            </div>
            <p className="text-[13px] font-bold text-[#1A1A1A] text-center mb-1">Click to upload document</p>
            <p className="text-[11px] font-medium text-[#9CA3AF] text-center">JPG, PNG or PDF under 500KB</p>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              ref={inputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#FAFAFA] flex items-center justify-between">
            <div
              className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer"
              onClick={() => setPreviewFile(file)}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                <FileText className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <div className="truncate pr-4">
                <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{file.name}</p>
                <p className="text-[11px] font-medium text-[#4CAF50]">{(file.size / 1024).toFixed(1)} KB • Ready</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); if (inputRef.current) inputRef.current.value = ''; }}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">KYC Verification</h1>
      <p className="text-[13px] text-[#666666] font-medium mt-[-12px] mb-4">Upload documents for mandatory ID verification.</p>

      <UploadBox label="Aadhaar Card" file={aadhaar} setFile={setAadhaar} inputRef={fileInputRefs.aadhaar} description="Front & Back" />
      <UploadBox label="PAN Card" file={pan} setFile={setPan} inputRef={fileInputRefs.pan} description="Clear Photo" />
      <UploadBox label="Driving License" file={license} setFile={setLicense} inputRef={fileInputRefs.license} description="Valid Only" />

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
              <h3 className="text-[14px] font-bold text-[#1A1A1A] truncate pr-4">{previewFile.name}</h3>
              <button onClick={() => setPreviewFile(null)} className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                <X className="w-4 h-4 text-[#1A1A1A]" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex justify-center items-center bg-[#F5F5F5]">
              {previewFile.type === "application/pdf" ? (
                <iframe src={URL.createObjectURL(previewFile)} className="w-full h-[60vh] rounded-lg border border-gray-200" />
              ) : (
                <img src={URL.createObjectURL(previewFile)} className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-200 shadow-sm" />
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
            {loading ? <div className="w-5 h-5 rounded-full border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] animate-spin" /> : "Submit Documents"}
          </button>
        </div>
      </div>
    </div>
  );
}