import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Truck,
    CreditCard,
    Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
            if (!partnerId) {
                navigate("/login");
                return;
            }

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
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-muted-foreground">Failed to load profile data</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const { basicInfo, vehicle, payment, status } = userData;

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-background p-4 flex items-center gap-4 border-b border-border sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/profile")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">My Profile</h1>
                <div className="ml-auto">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${status === 'approved' || status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Card */}
                <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4 ring-4 ring-yellow-200 dark:ring-yellow-500/30">
                        <AvatarImage src={basicInfo?.profilePhoto || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{basicInfo?.name?.[0] || "D"}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{basicInfo?.name}</h2>
                    <p className="text-muted-foreground">{basicInfo?.phone}</p>
                    <p className="text-sm text-muted-foreground">{basicInfo?.email}</p>
                </div>

                {/* Personal Details */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <User className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="col-span-2">{basicInfo?.street}, {basicInfo?.city}, {basicInfo?.state} - {basicInfo?.pincode}</span>
                        </div>
                        {basicInfo?.emergency && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Emergency:</span>
                                <span className="col-span-2">{basicInfo?.emergency}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Vehicle Details */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">Vehicle Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="col-span-2 capitalize">{vehicle?.vehicleType}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Model:</span>
                            <span className="col-span-2">{vehicle?.model}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Plate:</span>
                            <span className="col-span-2 font-mono">{vehicle?.plate}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">License:</span>
                            <span className="col-span-2 font-mono">{vehicle?.license}</span>
                        </div>
                        {vehicle?.insuranceImage && (
                            <div className="mt-2 pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Insurance Document Uploaded</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paying Details */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">Payout Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Bank:</span>
                            <span className="col-span-2">{payment?.bankName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Holder:</span>
                            <span className="col-span-2">{payment?.holderName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Account:</span>
                            <span className="col-span-2 font-mono">•••• {payment?.accountNo?.slice(-4)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">IFSC:</span>
                            <span className="col-span-2 font-mono">{payment?.ifsc}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
