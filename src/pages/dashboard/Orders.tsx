import { Package, Calendar, MapPin } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

export default function OrderHistory() {
    const orders = [
        { id: "ORD-9921", date: "Today, 10:30 AM", amount: "₹85", status: "Delivered", from: "Hotel Saravana Bhavan", to: "Anna Nagar" },
        { id: "ORD-9920", date: "Today, 09:15 AM", amount: "₹120", status: "Delivered", from: "A2B Sweets", to: "Koyambedu" },
        { id: "ORD-9918", date: "Yesterday", amount: "₹65", status: "Delivered", from: "Sangeetha Veg", to: "Vadapalani" },
        { id: "ORD-9915", date: "Yesterday", amount: "₹45", status: "Cancelled", from: "KFC", to: "Ashok Nagar" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white p-4 sticky top-0 border-b z-10">
                <h1 className="text-lg font-bold">Past Orders</h1>
            </div>
            <div className="p-4 space-y-4">
                {orders.map((order, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-sm">{order.id}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                        <Calendar className="w-3 h-3" />
                                        {order.date}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{order.amount}</p>
                                    <Badge variant={order.status === "Delivered" ? "default" : "destructive"} className={order.status === "Delivered" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2 relative pl-4 border-l-2 border-dashed border-gray-200 ml-1">
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                                    <p className="text-xs font-medium">{order.from}</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                                    <p className="text-xs font-medium">{order.to}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
