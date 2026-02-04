import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg mb-6">
        <Truck className="w-10 h-10 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-2">
        KOODAI DELIVERY
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Delivery Partner App. Join the fleet.
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => navigate("/login")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium"
        >
          Login
        </Button>

        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-300" />
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        <Button
          onClick={() => navigate("/onboarding")}
          variant="outline"
          className="w-full border-2 border-yellow-400 hover:bg-yellow-50 text-black py-6 rounded-xl font-medium"
        >
          Register as Partner
        </Button>
      </div>
    </div>
  );
}
