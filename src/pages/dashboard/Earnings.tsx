import { TrendingUp, Wallet, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Earnings() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-black text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-sm font-medium text-gray-400 mb-1">Total Earnings</h1>
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold">₹12,450</span>
                    <span className="text-sm text-green-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> +15%
                    </span>
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1 bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                        <Wallet className="w-4 h-4 mr-2" /> Withdraw
                    </Button>
                    <Button variant="secondary" className="flex-1 bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                        <CreditCard className="w-4 h-4 mr-2" /> History
                    </Button>
                </div>
            </div>

            <div className="p-4 -mt-6 space-y-4">
                <Card className="shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="text-base">Weekly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {[30, 45, 25, 60, 75, 50, 65].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-yellow-100 rounded-t-sm relative group">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-yellow-400 rounded-t-sm transition-all group-hover:bg-yellow-500"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <h2 className="font-bold text-lg px-1">Recent Payouts</h2>
                {[1, 2, 3].map((_, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Wallet className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Weekly Payout</p>
                                    <p className="text-xs text-muted-foreground">Oct {20 - i * 7}, 2024</p>
                                </div>
                            </div>
                            <p className="font-bold text-green-700">+ ₹3,200</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
