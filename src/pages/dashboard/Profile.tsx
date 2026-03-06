import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, HelpCircle, LogOut, ChevronRight, Car, FileText, CreditCard, Bell, Globe, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { t } from "../../i18n/translations";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (!partnerId) { navigate("/login"); return; }
      try {
        const docRef = doc(db, "delivery", partnerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("partnerId");
    toast.info(t("logoutSuccess") || "Logged out");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  const { basicInfo, deliveryPartnerId } = userData || {};
  const name = basicInfo?.name || "Delivery Partner";

  const menuGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: t("profile") || "Profile Details", path: "/dashboard/profile/details" },
        { icon: Car, label: "Vehicle Details", path: "/dashboard/vehicle" },
        { icon: FileText, label: "Documents", path: "/dashboard/documents" },
        { icon: CreditCard, label: "Payment Details", path: "/dashboard/payment" },
      ]
    },
    {
      title: "Settings & Support",
      items: [
        { icon: Settings, label: t("appSettings") || "App Settings", path: "/dashboard/settings" },
        { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
        { icon: Globe, label: "Language", path: "/dashboard/language" },
        { icon: HelpCircle, label: t("helpSupport") || "Help & Support", path: "/dashboard/help-support" },
        { icon: FileQuestion, label: "FAQ", path: "/dashboard/faq" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-b from-secondary to-card dark:from-secondary/50 px-5 pt-12 pb-8 border-b border-border shadow-sm text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-primary/10 blur-3xl pointer-events-none" />
        <div className="w-24 h-24 mx-auto mb-4 bg-secondary rounded-full border-[4px] border-primary flex items-center justify-center overflow-hidden shadow-sm">
          {basicInfo?.profilePhoto ? (
            <img src={basicInfo.profilePhoto} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <span className="text-[32px] font-extrabold text-[#FFB300]">{name[0]?.toUpperCase()}</span>
          )}
        </div>

        <h1 className="text-[20px] font-extrabold text-foreground leading-tight mb-1">{name}</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[14px] font-bold text-muted-foreground">{basicInfo?.phone}</span>
          <span className="w-1 h-1 bg-border rounded-full" />
          <span className="text-[12px] font-bold text-accent bg-secondary px-2 py-0.5 rounded-md uppercase tracking-wide">
            {deliveryPartnerId || "ID: PENDING"}
          </span>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Stat label="RATING" value="4.8" star />
          <Divider />
          <Stat label="DELIVERIES" value="1,240" />
          <Divider />
          <Stat label="EXPERIENCE" value="2.5 Yrs" />
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-4 mt-6 space-y-6 max-w-md mx-auto w-full">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {group.title}
            </p>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {group.items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-muted active:scale-[0.98] transition-all
                    ${index !== group.items.length - 1 ? 'border-b border-border' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-foreground" strokeWidth={2} />
                    </div>
                    <span className="text-[15px] font-bold text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="w-full mt-2 bg-card border border-border text-destructive hover:bg-destructive/5 active:scale-[0.98] transition-all font-bold p-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-[15px]"
        >
          <LogOut className="w-5 h-5" />
          {t("logout") || "Logout"}
        </button>

        <p className="text-center text-[12px] font-semibold text-muted-foreground mt-6">
          Koodai Delivery Partner App • Version 2.0.0
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, star = false }: { label: string; value: string, star?: boolean }) {
  return (
    <div className="text-center">
      <p className="font-extrabold text-[18px] text-foreground flex items-center justify-center gap-1">
        {value}
        {star && <svg className="w-4 h-4 text-primary fill-primary mb-0.5" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
      </p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-border h-8 self-center" />;
}
