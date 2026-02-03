import { useNavigate } from "react-router-dom";
import { User, Truck, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";

export default function Profile() {
    const navigate = useNavigate();

    const handleLogout = () => {
        toast.info("Logging out...");
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    const menuItems = [
        { icon: User, label: "Personal Details", path: "/onboarding/step-6" }, // Reusing Step 6 as Profile View
        { icon: Truck, label: "Vehicle Information", path: "/onboarding/step-4" },
        { icon: Settings, label: "App Settings", path: "#" },
        { icon: HelpCircle, label: "Help & Support", path: "#" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white p-6 pb-8 text-center border-b">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-100">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-bold">John Doe</h1>
                <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                <div className="mt-4 flex justify-center gap-4 text-sm">
                    <div className="text-center">
                        <p className="font-bold text-lg">4.8 ★</p>
                        <p className="text-gray-500 text-xs">Rating</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                        <p className="font-bold text-lg">1,240</p>
                        <p className="text-gray-500 text-xs">Trips</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                        <p className="font-bold text-lg">2.5</p>
                        <p className="text-gray-500 text-xs">Years</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-0 divide-y">
                        {menuItems.map((item, index) => (
                            <button key={index} onClick={() => item.path !== '#' && navigate(item.path)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <item.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        ))}
                    </CardContent>
                </Card>

                <Button variant="outline" className="w-full bg-white text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 py-6" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>

                <p className="text-center text-xs text-gray-400 mt-6">App Version 1.0.0 (Build 2024)</p>
            </div>
        </div>
    );
}
