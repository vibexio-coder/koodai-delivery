import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step5Payment() {
  const navigate = useNavigate();
  const setPayment = useOnboardingStore((s) => s.setPayment);

  const [mounted, setMounted] = useState(false);

  const [bankName, setBankName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (!bankName.trim()) return toast.error("Bank name is required");
    if (!/^[A-Za-z ]+$/.test(holderName.trim())) return toast.error("Enter valid account holder name");
    if (!/^\d{9,18}$/.test(accountNo)) return toast.error("Account number must be 9–18 digits");
    if (accountNo !== confirmAccountNo) return toast.error("Account numbers do not match");
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return toast.error("Enter valid IFSC code");
    if (upi && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi)) return toast.error("Enter valid UPI ID");

    setPayment({
      bankName: bankName.trim(),
      holderName,
      accountNo,
      ifsc,
      upi,
    });

    toast.success("Payout details saved");
    navigate("/onboarding/step-6");
  };

  if (!mounted) return null;

  return (
    <form autoComplete="off" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      <input type="text" name="fakeusernameremembered" hidden />
      <input type="password" name="fakepasswordremembered" hidden />

      <div>
        <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">Payout Details</h1>
        <p className="text-[13px] text-[#666666] font-medium mt-1 mb-4">Add bank account to receive your earnings.</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[rgba(0,0,0,0.08)] shadow-sm space-y-4">

        {/* BANK NAME */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Bank Name <span className="text-[#D32F2F]">*</span></label>
          <input
            autoComplete="organization"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. State Bank of India"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
          />
        </div>

        {/* ACCOUNT HOLDER */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Account Holder <span className="text-[#D32F2F]">*</span></label>
          <input
            autoComplete="new-password"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="Name as per Passbook"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
          />
        </div>

        {/* ACCOUNT NUMBER */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Account Number <span className="text-[#D32F2F]">*</span></label>
          <input
            type="password"
            autoComplete="new-password"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter Account Number"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors font-mono placeholder:font-sans tracking-widest"
          />
        </div>

        {/* CONFIRM ACCOUNT NUMBER */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">Confirm Number <span className="text-[#D32F2F]">*</span></label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmAccountNo}
            onChange={(e) => setConfirmAccountNo(e.target.value.replace(/\D/g, ""))}
            placeholder="Re-enter Account Number"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors font-mono placeholder:font-sans tracking-widest"
          />
        </div>

        {/* IFSC CODE */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">IFSC Code <span className="text-[#D32F2F]">*</span></label>
          <input
            autoComplete="new-password"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value.replace(/[^A-Z0-9]/gi, "").toUpperCase())}
            placeholder="SBIN0001234"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors uppercase placeholder:normal-case font-mono"
          />
        </div>

        {/* UPI ID */}
        <div>
          <label className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">UPI ID <span className="text-[10px] text-gray-400 font-normal lowercase">(Optional)</span></label>
          <input
            autoComplete="off"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="username@bank"
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1A1A] text-[15px] font-semibold rounded-xl px-4 py-3.5 outline-none focus:border-[#FFC107] transition-colors"
          />
        </div>

      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleNext}
            className="w-full btn-yellow py-[16px] text-[16px] flex justify-center items-center gap-2"
          >
            Save Payout Details
          </button>
        </div>
      </div>
    </form>
  );
}
