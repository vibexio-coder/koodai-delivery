import { useState, useEffect } from "react";
import { User, MapPin, Clock, Navigation } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";

type OrderState = "idle" | "offered" | "active" | "completed";

export default function Home() {
    const [isOnline, setIsOnline] = useState(false);
    const [orderState, setOrderState] = useState<OrderState>("idle");
    const [countdown, setCountdown] = useState(30);

    // Poll for orders when Online and Idle
    useEffect(() => {
        let timer: any;
        if (isOnline && orderState === "idle") {
            timer = setTimeout(() => {
                setOrderState("offered");
                setCountdown(30);
                toast.info("New Order Request!", { description: "Pickup from Anna Nagar" });
            }, 5000); // 5 seconds to get an order
        }
        return () => clearTimeout(timer);
    }, [isOnline, orderState]);

    // Countdown logic for Offered state
    useEffect(() => {
        let interval: any;
        if (orderState === "offered" && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (orderState === "offered" && countdown === 0) {
            setOrderState("idle"); // Missed
            toast.error("Order Missed", { description: "You missed the delivery request." });
        }
        return () => clearInterval(interval);
    }, [orderState, countdown]);

    const handleAccept = () => {
        setOrderState("active");
        toast.success("Order Accepted!", { description: "Navigate to pickup location." });
    };

    const handleReject = () => {
        setOrderState("idle");
        toast.info("Order Rejected");
    };

    const handleComplete = () => {
        setOrderState("completed");
        toast.success("Delivery Completed!", { description: "Earnings updated." });
        setTimeout(() => {
            setOrderState("idle");
            setIsOnline(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-sm font-bold text-black">John Doe</h1>
                        <p className="text-xs text-muted-foreground">ID: KD-8821</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}>
                        {isOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                    <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 flex flex-col gap-4">
                {/* Earnings Summary Card */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-black text-white border-none">
                        <CardContent className="p-4">
                            <p className="text-xs text-gray-400">Earnings</p>
                            <p className="text-xl font-bold">₹1,240</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Orders</p>
                            <p className="text-xl font-bold text-black">12</p>
                        </CardContent>
                    </Card>
                </div>

                {/* State Views */}
                {!isOnline && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground mt-10">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-black">You are Offline</h2>
                        <p className="text-sm">Go Online to start receiving orders.</p>
                    </div>
                )}

                {isOnline && orderState === "idle" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                            <span className="absolute w-full h-full rounded-full bg-yellow-400/20 animate-ping"></span>
                            <div className="relative w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                <Navigation className="w-8 h-8 text-black" />
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold text-black">Looking for orders...</h2>
                        <p className="text-sm text-muted-foreground">Stay in high demand areas for faster requests.</p>
                    </div>
                )}

                {isOnline && orderState === "offered" && (
                    <Card className="border-2 border-yellow-400 shadow-xl animate-in slide-in-from-bottom-5">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">New Request</Badge>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-black">₹85</p>
                                    <p className="text-xs text-muted-foreground">Exp. Earnings</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Hotel Saravana Bhavan</p>
                                    <p className="text-xs text-muted-foreground">Anna Nagar, 2nd Avenue</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Drop Location</p>
                                    <p className="text-xs text-muted-foreground">Flat 4B, Green Park Apts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 25 mins</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 4.2 km</span>
                            </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline" className="flex-1" onClick={handleReject}>Reject</Button>
                            <Button className="flex-1 bg-black text-white hover:bg-gray-800" onClick={handleAccept}>
                                Accept ({countdown}s)
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {orderState === "active" && (
                    <Card className="flex-1 flex flex-col border-none shadow-none">
                        <div className="bg-gray-200 flex-1 rounded-xl flex items-center justify-center mb-4 min-h-[300px]">
                            <span className="text-muted-foreground font-medium flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> Map View Placeholder
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">Ongoing Delivery</h3>
                                <p className="text-sm text-muted-foreground">Picking up order #ORD-9921</p>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleComplete}>
                                    Mark Delivered
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => window.open('tel:9876543210')}>
                                    <User className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {orderState === "completed" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <h2 className="text-2xl font-bold">Delivery Success!</h2>
                        <p className="text-muted-foreground mb-6">₹85 added to your wallet.</p>
                        <Button onClick={() => setOrderState("idle")} className="bg-black text-white">Continue Working</Button>
                    </div>
                )}
            </main>
        </div>
    );
}
