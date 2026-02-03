import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Step5Payment() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/onboarding/step-6");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Payout Details</h1>
                <p className="text-muted-foreground">Add bank account to receive earnings.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="account-holder">Account Holder Name</Label>
                    <Input id="account-holder" placeholder="Name as per Passbook" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="account-num">Bank Account Number</Label>
                    <Input id="account-num" type="password" placeholder="Enter Account Number" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-account-num">Confirm Account Number</Label>
                    <Input id="confirm-account-num" placeholder="Re-enter Account Number" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" placeholder="SBIN0001234" className="uppercase" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID (Optional)</Label>
                    <Input id="upi" placeholder="username@bank" />
                </div>
            </div>

            <Button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Save Payout Details
            </Button>
        </div>
    );
}
