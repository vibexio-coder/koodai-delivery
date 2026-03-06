import { useState } from "react";
import { Moon, Bell, Power, Trash2, Languages, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import { t } from "../../i18n/translations";
import { useAppStore } from "../../store/useAppStore";

export default function AppSettings() {
  const navigate = useNavigate();
  const { language, setLanguage, darkMode, toggleDarkMode, autoOnline, setAutoOnline } = useAppStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const clearAppData = () => {
    localStorage.clear();
    toast.success(t("dataCleared") || "App data cleared successfully");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card p-4 pt-10 flex items-center gap-3 border-b border-border sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-foreground">Settings</h1>
          <p className="text-[12px] font-medium text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">App Preferences</h2>
          </div>
          <div className="divide-y divide-border">
            <SettingRow icon={Moon} label="Dark Mode" description="Switch between light and dark themes">
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </SettingRow>
            <SettingRow icon={Bell} label="Sound Alerts" description="Play sounds for new orders">
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </SettingRow>
            <SettingRow icon={Power} label="Auto Online" description="Go online when app opens">
              <Switch checked={autoOnline} onCheckedChange={setAutoOnline} />
            </SettingRow>
          </div>
        </div>

        {/* Language */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Localization</h2>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-background border border-border/10 flex items-center justify-center">
                <Languages className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-foreground">Language</p>
                <p className="text-[12px] font-medium text-muted-foreground">Select app language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-background border border-border text-foreground text-[13px] font-bold rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Clear Data */}
        <button
          onClick={clearAppData}
          className="w-full mt-4 bg-card border border-destructive/30 text-destructive hover:bg-destructive/5 active:scale-[0.98] transition-all font-bold p-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-[15px]"
        >
          <Trash2 className="w-5 h-5" />
          Clear App Data
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, disabled, children }: any) {
  return (
    <div className={`flex items-center justify-between p-4 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-background border border-border/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-foreground" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[15px] font-bold text-foreground">{label}</p>
          <p className="text-[12px] font-medium text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}