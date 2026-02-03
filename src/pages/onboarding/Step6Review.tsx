import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";

export default function Step6Review() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        toast.success("Application Submitted!", {
            description: "Your profile is under verification. You can now access the dashboard."
        });
        // Simulate API call
        setTimeout(() => {
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Review Application</h1>
                <p className="text-muted-foreground">Please review your details before submitting.</p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">Basic Info</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/onboarding/step-1")}><Edit2 className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Name:</span> John Doe</p>
                        <p><span className="text-muted-foreground">Phone:</span> +91 98765 43210</p>
                        <p><span className="text-muted-foreground">Email:</span> john@example.com</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">Vehicle</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/onboarding/step-4")}><Edit2 className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Type:</span> Motorcycle</p>
                        <p><span className="text-muted-foreground">Plate:</span> TN 01 AB 1234</p>
                        <p><span className="text-muted-foreground">DL:</span> TN01 20200001234</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold">Payout</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/onboarding/step-5")}><Edit2 className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Bank:</span> SBI</p>
                        <p><span className="text-muted-foreground">Account:</span> ••••••••1234</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Ready to Submit?</p>
                    <p className="text-xs text-green-600 mt-1">By submitting, you confirm that all details provided are accurate. False information may lead to account suspension.</p>
                </div>
            </div>

            <Button onClick={handleSubmit} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Submit Application
            </Button>
        </div>
    );
}
