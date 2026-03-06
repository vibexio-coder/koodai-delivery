import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit2, ShieldCheck, Mail, Phone, MapPin, Truck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { useOnboardingStore } from "../../store/useOnboardingStore";

const generateDeliveryPartnerId = async (city: string): Promise<string> => {
    const cityCode = city.slice(0, 3).toUpperCase();
    const q = query(collection(db, "delivery"), where("basicInfo.city", "==", city));
    const snap = await getDocs(q);
    const nextNum = snap.size + 1;
    return `${cityCode}-DP-${String(nextNum).padStart(4, "0")}`;
};

export default function Step6Review() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const { basicInfo, permissions, vehicle, payment, kyc, reset } = useOnboardingStore();

    useEffect(() => {
        if (!basicInfo || !permissions || !vehicle || !payment || !kyc) {
            toast.error("Incomplete onboarding");
            navigate("/onboarding/step-1");
        }
    }, [basicInfo, permissions, vehicle, payment, kyc, navigate]);

    const maskAccount = (acc?: string) => acc ? "••••••••" + acc.slice(-4) : "";

    const handleSubmit = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);
            const deliveryPartnerId = await generateDeliveryPartnerId(basicInfo!.city);

            const payload = {
                deliveryPartnerId,
                basicInfo,
                permissions,
                vehicle,
                payment,
                kyc,
                status: "pending_verification",
                createdAt: serverTimestamp(),
            };

            const json = JSON.stringify(payload);
            const size = new Blob([json]).size;

            if (size > 950000) {
                throw new Error(`Data too large (${Math.round(size / 1024)}KB). Please use smaller images.`);
            }

            await addDoc(collection(db, "delivery"), payload);
            toast.success("Application submitted!", { description: "Your profile is under verification." });

            setTimeout(() => {
                reset();
                navigate("/");
            }, 1500);
        } catch (error: any) {
            console.error("Submission Error:", error);
            toast.error("Submission failed", { description: error.message || "Please try again later" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div>
                <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">Review Details</h1>
                <p className="text-[13px] text-[#666666] font-medium mt-1 mb-2">Almost done! Review your information before final submission.</p>
            </div>

            {/* BASIC INFO */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Basic Info</h2>
                    <button onClick={() => navigate("/onboarding/step-1")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
                        <Edit2 className="w-4 h-4 text-[#FFB300]" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-[rgba(0,0,0,0.08)] bg-[#F5F5F5] shrink-0">
                            {basicInfo?.profilePhoto ? (
                                <img src={basicInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">No Photo</div>
                            )}
                        </div>
                        <div>
                            <p className="text-[16px] font-extrabold text-[#1A1A1A]">{basicInfo?.name}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-[#666666]">
                                <Phone className="w-3.5 h-3.5" />
                                <span className="text-[12px] font-medium">{basicInfo?.phone}</span>
                            </div>
                            {basicInfo?.email && (
                                <div className="flex items-center gap-1.5 mt-0.5 text-[#666666]">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="text-[12px] font-medium">{basicInfo?.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-[#666666]">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-[12px] font-medium leading-relaxed">
                            <span className="font-bold text-[#1A1A1A] mr-1 block">Address</span>
                            {basicInfo?.houseNo}, {basicInfo?.street}, {basicInfo?.area}<br />
                            {basicInfo?.landmark && `Near ${basicInfo.landmark}`}<br />
                            {basicInfo?.city}, {basicInfo?.state} - {basicInfo?.pincode}
                        </p>
                    </div>
                </div>
            </div>

            {/* KYC DOCS */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">KYC Documents</h2>
                    <button onClick={() => navigate("/onboarding/step-3")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
                        <Edit2 className="w-4 h-4 text-[#FFB300]" />
                    </button>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#1A1A1A]">
                    <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl py-3 px-1 text-[#4CAF50] flex flex-col items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5" /> Aadhaar
                    </div>
                    <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl py-3 px-1 text-[#4CAF50] flex flex-col items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5" /> PAN
                    </div>
                    <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-xl py-3 px-1 text-[#4CAF50] flex flex-col items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5" /> DL
                    </div>
                </div>
            </div>

            {/* VEHICLE DETAILS */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Vehicle Details</h2>
                    <button onClick={() => navigate("/onboarding/step-4")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
                        <Edit2 className="w-4 h-4 text-[#FFB300]" />
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    <Row icon={Truck} label="Type" value={vehicle?.vehicleType} capitalize />
                    <Row label="Model" value={vehicle?.model} />
                    <Row label="Plate No." value={vehicle?.plate} mono />
                    {vehicle?.insuranceImage && (
                        <div className="flex items-center gap-2 pt-2">
                            <div className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full" />
                            <span className="text-[11px] font-bold text-[#4CAF50] uppercase tracking-wider">Insurance Attached</span>
                        </div>
                    )}
                </div>
            </div>

            {/* PAYOUT DETAILS */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Payout Details</h2>
                    <button onClick={() => navigate("/onboarding/step-5")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
                        <Edit2 className="w-4 h-4 text-[#FFB300]" />
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    <Row icon={CreditCard} label="Bank" value={payment?.bankName} />
                    <Row label="Holder" value={payment?.holderName} />
                    <Row label="Account" value={maskAccount(payment?.accountNo)} mono />
                    <Row label="IFSC Code" value={payment?.ifsc} mono />
                </div>
            </div>

            {/* AGREEMENT */}
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-2xl flex items-start gap-3 mt-4">
                <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-0.5 shrink-0" strokeWidth={2.5} />
                <div>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">Ready to submit?</p>
                    <p className="text-[11px] font-medium text-[#666666] mt-1 pr-2">By submitting this application, I confirm that the details provided are accurate and I agree to the <span className="text-[#FFB300] font-bold cursor-pointer">Terms & Conditions</span>.</p>
                </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-30">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full btn-yellow py-[16px] text-[16px] flex justify-center items-center gap-2 disabled:opacity-80"
                    >
                        {submitting ? <div className="w-5 h-5 rounded-full border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] animate-spin" /> : "Submit Application"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Row({ icon: Icon, label, value, mono = false, capitalize = false }: any) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            {Icon ? <Icon className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" /> : <div className="w-4 h-4 shrink-0" />}
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{label}</span>
                <span className={`text-[14px] font-semibold text-[#1A1A1A] ${mono ? 'font-mono tracking-wide' : ''} ${capitalize ? 'capitalize' : ''}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}