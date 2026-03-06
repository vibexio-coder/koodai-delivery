import { useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardList, Wallet, User } from "lucide-react";
import { t } from "../i18n/translations";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: t("navHome") || "Home",
    },
    {
      path: "/dashboard/orders",
      icon: ClipboardList,
      label: t("navOrders") || "Orders",
    },
    {
      path: "/dashboard/earnings",
      icon: Wallet,
      label: t("navEarnings") || "Earnings",
    },
    {
      path: "/dashboard/profile",
      icon: User,
      label: t("navProfile") || "Profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pt-2 pb-3 shadow-[0_-6px_24px_rgba(0,0,0,0.06)] z-50">
      <div className="flex items-end justify-around max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 relative flex-1 py-1"
            >
              {/* Icon pill container */}
              <div className="relative">
                <div
                  className={`w-12 h-7 rounded-2xl flex items-center justify-center transition-all duration-200 ${active ? "bg-secondary" : "bg-transparent"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${active ? "text-accent" : "text-muted-foreground"
                      }`}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-semibold transition-colors duration-200 leading-none ${active ? "text-accent" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}