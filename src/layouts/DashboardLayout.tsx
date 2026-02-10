import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";

export default function DashboardLayout() {
  return (
    <div className="min-h-dvh bg-background flex justify-center w-full">
      {/* Mobile container */}
      <div className="w-full max-w-[420px] bg-background relative flex flex-col min-h-dvh pb-[env(safe-area-inset-bottom)]">
        <div className="flex-1 pb-20">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}