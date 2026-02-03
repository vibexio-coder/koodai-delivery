import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export default function Step3KYC() {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/onboarding/step-4");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Identity Verification</h1>
                <p className="text-muted-foreground">Upload government issued ID for verification.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="id-type">Document Type</Label>
                    <Select defaultValue="aadhar">
                        <SelectTrigger>
                            <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="dl">Driving License</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Front Side</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Click to upload front side</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                        <Input type="file" className="hidden" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Back Side</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Click to upload back side</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                        <Input type="file" className="hidden" />
                    </div>
                </div>
            </div>

            <Button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 text-lg font-medium">
                Submit Documents
            </Button>
        </div>
    );
}
