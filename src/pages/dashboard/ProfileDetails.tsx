import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Truck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function ProfileDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const partnerId = localStorage.getItem("partnerId");
            if (!partnerId) { navigate("/login"); return; }
            try {
                const docRef = doc(db, "delivery", partnerId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    toast.error("Profile not found");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
                <p className="text-muted-foreground font-bold">Failed to load profile data</p>
                <button className="btn-yellow px-6 py-3" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const { basicInfo, vehicle, payment, status } = userData;
    const isApproved = status === 'approved' || status === 'APPROVED';

    return (
        <div className="flex flex-col min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-card p-4 pt-10 flex items-center justify-between border-b border-border sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate("/dashboard/profile")} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted active:scale-95 transition-transform">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h1 className="text-[16px] font-bold text-foreground">My Details</h1>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isApproved ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#FFF8E1] text-[#FFB300]'
                    }`}>
                    {status || "PENDING"}
                </span>
            </div>

            <div className="p-4 space-y-4 max-w-md mx-auto w-full">
                {/* Personal Details */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                        <div className="p-1.5 bg-card rounded-lg shadow-sm">
                            <User className="w-4 h-4 text-foreground" />
                        </div>
                        <h2 className="text-[14px] font-bold text-foreground">Personal Information</h2>
                    </div>
                    <div className="p-4 space-y-4 text-[13px]">
                        <Row label="Full Name" value={basicInfo?.name} />
                        <Row label="Phone" value={basicInfo?.phone} />
                        <Row label="Email" value={basicInfo?.email} />
                        <div className="pt-2 border-t border-border">
                            <Row label="Address" value={`${basicInfo?.street}, ${basicInfo?.city}, ${basicInfo?.state} - ${basicInfo?.pincode}`} />
                        </div>
                        {basicInfo?.emergency && (
                            <div className="pt-2 border-t border-border">
                                <Row label="Emergency Contact" value={basicInfo?.emergency} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                        <div className="p-1.5 bg-card rounded-lg shadow-sm">
                            <Truck className="w-4 h-4 text-foreground" />
                        </div>
                        <h2 className="text-[14px] font-bold text-foreground">Vehicle Details</h2>
                    </div>
                    <div className="p-4 space-y-4 text-[13px]">
                        <Row label="Type" value={vehicle?.vehicleType} capitalize />
                        <Row label="Model" value={vehicle?.model} />
                        <Row label="License Plate" value={vehicle?.plate} mono />
                        <div className="pt-2 border-t border-border">
                            <Row label="Driving License" value={vehicle?.license} mono />
                        </div>
                        {vehicle?.insuranceImage && (
                            <div className="mt-2 pt-3 border-t border-border flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#4CAF50] rounded-full" />
                                <span className="text-[12px] font-bold text-[#4CAF50]">Insurance Verified</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payout Details */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                        <div className="p-1.5 bg-card rounded-lg shadow-sm">
                            <CreditCard className="w-4 h-4 text-foreground" />
                        </div>
                        <h2 className="text-[14px] font-bold text-foreground">Payout Details</h2>
                    </div>
                    <div className="p-4 space-y-4 text-[13px]">
                        <Row label="Bank Name" value={payment?.bankName} />
                        <Row label="Account Holder" value={payment?.holderName} />
                        <div className="pt-2 border-t border-border">
                            <Row label="Account Number" value={`•••• •••• ${payment?.accountNo?.slice(-4) || 'XXXX'}`} mono />
                            <Row label="IFSC Code" value={payment?.ifsc} mono />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Row({ label, value, mono = false, capitalize = false }: { label: string, value: any, mono?: boolean, capitalize?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className={`text-[14px] font-semibold text-foreground ${mono ? 'font-mono' : ''} ${capitalize ? 'capitalize' : ''}`}>
                {value}
            </span>
        </div>
    );
}
