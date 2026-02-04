import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";

import "./styles/tailwind.css";
import "./styles/theme.css";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* App shell (mobile container) */}
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <div className="max-w-md mx-auto relative bg-background min-h-screen shadow-xl border-x">
          <AppRoutes />
        </div>
        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  );
}
