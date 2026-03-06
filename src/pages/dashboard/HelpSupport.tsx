import { useNavigate } from "react-router-dom";
import { MessageSquare, AlertTriangle, Phone, HelpCircle, ArrowLeft, ChevronRight } from "lucide-react";
import { t } from "../../i18n/translations";

export default function HelpSupport() {
    const navigate = useNavigate();

    const supportOptions = [
        {
            icon: MessageSquare,
            label: t("inAppChat") || "In-App Chat Support",
            description: t("chatWithSupport") || "Chat with our support team directly",
            action: () => alert("Chat support clicked"),
        },
        {
            icon: AlertTriangle,
            label: t("reportOrderIssue") || "Report Order Issue",
            description: t("reportProblemLive") || "Report a problem with a live order",
            action: () => alert("Report issue clicked"),
        },
        {
            icon: Phone,
            label: t("callSupport") || "Call Support",
            description: "+91 98765 43210 (Toll Free)",
            action: () => (window.location.href = "tel:+919876543210"),
        },
        {
            icon: HelpCircle,
            label: t("faqsLabel") || "FAQ's",
            description: t("faqsDesc") || "Frequently asked questions",
            action: () => alert("FAQs clicked"),
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-card p-4 pt-10 flex items-center gap-3 border-b border-border sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted active:scale-95 transition-transform">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                    <h1 className="text-[16px] font-bold text-foreground">{t("helpSupport") || "Help & Support"}</h1>
                    <p className="text-[12px] font-medium text-muted-foreground">{t("howCanWeHelp") || "How can we help you today?"}</p>
                </div>
            </div>

            <div className="p-4 space-y-4 max-w-md mx-auto w-full">
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b border-border">
                        <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{t("contactOptions") || "Contact Options"}</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {supportOptions.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted active:bg-muted/80 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary border border-primary/20 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-accent" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <span className="block text-[15px] font-bold text-foreground">{item.label}</span>
                                        <span className="block text-[12px] font-medium text-muted-foreground mt-0.5">{item.description}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
