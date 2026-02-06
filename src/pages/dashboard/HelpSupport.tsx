import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    AlertTriangle,
    Phone,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function HelpSupport() {
    const navigate = useNavigate();

    const supportOptions = [
        {
            icon: MessageSquare,
            label: "In-App Chat Support",
            description: "Chat with our support team",
            action: () => alert("Chat support clicked"), // Placeholder
        },
        {
            icon: AlertTriangle,
            label: "Report Order Issue",
            description: "Report a problem with an order",
            action: () => alert("Report issue clicked"), // Placeholder
        },
        {
            icon: Phone,
            label: "Call Support",
            description: "+91 98765 43210",
            action: () => window.location.href = "tel:+919876543210",
        },
        {
            icon: HelpCircle,
            label: "FAQ's",
            description: "Frequently asked questions",
            action: () => alert("FAQs clicked"), // Placeholder
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-background p-4 border-b border-border flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="-ml-2"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-lg font-bold text-foreground">
                        Help & Support
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        How can we help you?
                    </p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Support Options */}
                <Card className="border-none rounded-2xl bg-card overflow-hidden">
                    <CardContent className="p-0 divide-y divide-border">
                        {supportOptions.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="w-full flex items-center justify-between px-4 py-4
                  hover:bg-accent/50 transition text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                                        <item.icon className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-foreground">
                                            {item.label}
                                        </span>
                                        <span className="block text-xs text-muted-foreground">
                                            {item.description}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
