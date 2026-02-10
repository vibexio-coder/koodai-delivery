import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { toast } from "sonner";

import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step6Review() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const { basicInfo, permissions, vehicle, payment, kyc, reset } =
        useOnboardingStore();

    /* ---------- GUARD ---------- */
    useEffect(() => {
        if (!basicInfo || !permissions || !vehicle || !payment || !kyc) {
            toast.error("Incomplete onboarding");
            navigate("/onboarding/step-1");
        }
    }, []);

    /* ---------- HELPERS ---------- */
    const maskAccount = (acc?: string) =>
        acc ? "••••••••" + acc.slice(-4) : "";

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async () => {
        if (submitting) return;

        try {
            setSubmitting(true);

            // Construct payload
            const payload = {
                basicInfo,
                permissions,
                vehicle,
                payment,
                kyc, // Base64s (Compressed)
                status: "pending_verification",
                createdAt: serverTimestamp(),
            };

            // Size Check
            const json = JSON.stringify(payload);
            const size = new Blob([json]).size;
            console.log("Payload size:", size);

            if (size > 950000) { // < 1MB safety
                throw new Error(`Data too large (${Math.round(size / 1024)}KB). Please use smaller images.`);
            }

            await addDoc(collection(db, "delivery"), payload);

            toast.success("Application submitted!", {
                description: "Your profile is under verification.",
            });

            setTimeout(() => {
                reset();
                navigate("/");
            }, 1500);
        } catch (error: any) {
            console.error("Submission Error:", error);
            toast.error("Submission failed", {
                description: error.message || "Please try again later",
            });
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- UI ---------- */
    /* ---------- UI ---------- */
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Review Application</h1>
                <p className="text-muted-foreground">
                    Please review your details before submitting.
                </p>
            </div>

            {/* BASIC INFO */}
            <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Basic Info
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/onboarding/step-1")}
                        className="hover:bg-accent/50"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent className="text-sm space-y-3 text-muted-foreground">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
                            {basicInfo?.profilePhoto ? (
                                <img
                                    src={basicInfo.profilePhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-xs">No Photo</div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-lg">{basicInfo?.name}</p>
                            <p>{basicInfo?.phone}</p>
                            <p>{basicInfo?.email}</p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border mt-2">
                        <span className="text-foreground block mb-1 font-medium">Address:</span>
                        {basicInfo?.houseNo}, {basicInfo?.street}, {basicInfo?.area}<br />
                        {basicInfo?.landmark}<br />
                        {basicInfo?.city}, {basicInfo?.state} - {basicInfo?.pincode}
                    </div>
                </CardContent>
            </Card>

            {/* VEHICLE */}
            <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Vehicle
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/onboarding/step-4")}
                        className="hover:bg-accent/50"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent className="text-sm space-y-1 text-muted-foreground">
                    <p>
                        <span className="text-foreground">Type:</span>{" "}
                        {vehicle?.vehicleType}
                    </p>
                    <p>
                        <span className="text-foreground">Plate:</span>{" "}
                        {vehicle?.plate}
                    </p>
                    <p>
                        <span className="text-foreground">DL:</span>{" "}
                        {vehicle?.license}
                    </p>
                    <p>
                        <span className="text-foreground">Model:</span>{" "}
                        {vehicle?.model}
                    </p>
                    {vehicle?.insuranceImage && (
                        <div className="mt-2">
                            <span className="text-foreground">Insurance:</span>
                            <span className="ml-2 text-green-600 text-xs">Uploaded</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* PAYMENT */}
            <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Payout
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/onboarding/step-5")}
                        className="hover:bg-accent/50"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent className="text-sm space-y-1 text-muted-foreground">
                    <p>
                        <span className="text-foreground">
                            Account Holder:
                        </span>{" "}
                        {payment?.holderName}
                    </p>
                    <p>
                        <span className="text-foreground">Account:</span>{" "}
                        {maskAccount(payment?.accountNo)}
                    </p>
                    <p>
                        <span className="text-foreground">IFSC:</span>{" "}
                        {payment?.ifsc}
                    </p>
                </CardContent>
            </Card>

            {/* CONFIRM */}
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Ready to submit?
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        By submitting, you confirm all details are accurate.
                    </p>
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium disabled:opacity-50"
            >
                {submitting ? "Submitting..." : "Submit Application"}
            </Button>
        </div>
    );
}