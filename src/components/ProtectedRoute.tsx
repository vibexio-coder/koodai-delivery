import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

export default function ProtectedRoute() {
    const partnerId = localStorage.getItem("partnerId");

    if (!partnerId) {
        toast.error("Please login to access this page");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
