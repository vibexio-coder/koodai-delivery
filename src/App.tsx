import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";

function AppSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      const path = location.pathname;

      // 1. Home Tab -> Exit App
      if (path === "/dashboard" || path === "/dashboard/home" || path === "/") {
        CapacitorApp.exitApp();
        return;
      }

      // 2. Other Tabs (Orders, Earnings, Profile) -> Go to Home
      if (
        path === "/dashboard/orders" ||
        path === "/dashboard/earnings" ||
        path === "/dashboard/profile"
      ) {
        navigate("/dashboard");
        return;
      }

      // 3. Login / Root -> Exit
      if (path === "/login") {
        CapacitorApp.exitApp();
        return;
      }

      // 4. Any other page -> Go back
      navigate(-1);
    };

    // Add Listener
    const backButtonListener = CapacitorApp.addListener("backButton", handleBackButton);

    // Cleanup
    return () => {
      backButtonListener.then(f => f.remove());
    };
  }, [navigate, location]);

  return <AppRoutes />;
}

export default function App() {
  return (
    // App shell (mobile container)
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="max-w-md mx-auto relative bg-background min-h-screen shadow-xl border-x">
        <AppSetup />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
