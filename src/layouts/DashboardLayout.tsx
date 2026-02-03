import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";

export default function DashboardLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 pb-24">
                <Outlet />
            </div>
            <BottomNav />
        </div>
    );
}
