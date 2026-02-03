import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export default function Step4Vehicle() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/onboarding/step-5");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Vehicle Details</h1>
                <p className="text-muted-foreground">Register your delivery vehicle.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select defaultValue="bike">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bike">Motorcycle / Bike</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                            <SelectItem value="cycle">Bicycle</SelectItem>
                            <SelectItem value="ev">Electric Vehicle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="plate">Vehicle Number Plate</Label>
                    <Input id="plate" placeholder="TN 01 AB 1234" className="uppercase" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Input id="model" placeholder="e.g. Honda Activa 6G" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dl">Driving License Number</Label>
                    <Input id="dl" placeholder="TN01 20200001234" className="uppercase" />
                </div>
            </div>

            <Button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Save Vehicle Details
            </Button>
        </div>
    );
}
