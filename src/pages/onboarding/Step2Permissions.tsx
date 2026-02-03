import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Bell } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

export default function Step2Permissions() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/onboarding/step-3");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">System Permissions</h1>
                <p className="text-muted-foreground">We need access to these features to provide the delivery service.</p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardContent className="flex items-start gap-4 p-4 pt-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <MapPin className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="gps" className="text-base font-semibold">Location (GPS)</Label>
                                <Checkbox id="gps" defaultChecked disabled />
                            </div>
                            <p className="text-sm text-muted-foreground">Required to track your live location for order assignment and navigation.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-start gap-4 p-4 pt-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Camera className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="camera" className="text-base font-semibold">Camera Access</Label>
                                <Checkbox id="camera" defaultChecked />
                            </div>
                            <p className="text-sm text-muted-foreground">Required to capture proof of delivery and document uploads.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-start gap-4 p-4 pt-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Bell className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notif" className="text-base font-semibold">Notifications</Label>
                                <Checkbox id="notif" defaultChecked />
                            </div>
                            <p className="text-sm text-muted-foreground">Required to receive instant order alerts and updates.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Grant Permissions & Continue
            </Button>
        </div>
    );
}
