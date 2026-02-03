import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export default function Step1BasicInfo() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/onboarding/step-2");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Basic Information</h1>
                <p className="text-muted-foreground">Tell us a bit about yourself.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Current Address</Label>
                    <Textarea id="address" placeholder="123 Main St, Apartment 4B" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact (Optional)</Label>
                    <Input id="emergency" type="tel" placeholder="+91 98765 43210" />
                </div>
            </div>

            <Button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Save & Continue
            </Button>
        </div>
    );
}
