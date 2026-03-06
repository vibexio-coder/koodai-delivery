import { TrendingUp, Wallet, ChevronRight } from "lucide-react";
import { t } from "../../i18n/translations";

export default function Earnings() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-24 relative overflow-hidden">

      {/* Decorative Blur Background Hero */}
      <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-br from-[#FFC107] to-[#FF8C00] opacity-15 blur-2xl rounded-b-full pointer-events-none" />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-secondary to-[#FFE082] dark:from-secondary dark:to-primary/20 rounded-b-3xl border-b border-primary/20 pt-12 pb-8 px-5 max-w-md mx-auto w-full relative z-10 shadow-sm mb-6">
        <h1 className="text-[13px] font-extrabold text-foreground/80 uppercase tracking-widest mb-2">
          {t("totalEarnings") || "TOTAL EARNINGS"}
        </h1>

        <div className="flex items-end gap-3 mb-8">
          <span className="text-[48px] font-black text-foreground leading-none tracking-tighter drop-shadow-sm">
            ₹12,450
          </span>
          <span className="bg-[#E8F5E9] text-[#4CAF50] text-[13px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 mb-1.5 shadow-sm border border-[#4CAF50]/20">
            <TrendingUp className="w-4 h-4" strokeWidth={3} /> +15%
          </span>
        </div>

        {/* Quick Stats Row */}
        <div className="flex bg-background/60 backdrop-blur-md rounded-2xl p-1 mb-6 border border-primary/10">
          <button className="flex-1 py-2 bg-background rounded-xl shadow-sm text-[13px] font-bold text-foreground">Today</button>
          <button className="flex-1 py-2 text-[13px] font-semibold text-foreground/60 hover:text-foreground transition-colors">Week</button>
          <button className="flex-1 py-2 text-[13px] font-semibold text-foreground/60 hover:text-foreground transition-colors">Month</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-yellow flex items-center justify-center gap-2 py-3.5 shadow-sm text-[15px]">
            <Wallet className="w-4 h-4" />
            Withdraw
          </button>
          <button className="bg-card/80 backdrop-blur-md border text-foreground hover:bg-muted active:scale-[0.98] transition-all font-bold py-3.5 rounded-2xl border-border shadow-sm text-[15px]">
            History
          </button>
        </div>
      </div>

      <div className="px-5 space-y-4 max-w-md mx-auto w-full relative z-10 -mt-2">

        {/* Weekly Breakdown Chart */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <p className="text-[16px] font-extrabold text-foreground mb-6">Weekly Performance</p>

          <div className="flex items-end justify-between h-36 gap-2">
            {[30, 45, 25, 60, 75, 50, 65].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-muted rounded-md relative flex-1">
                  <div
                    style={{ height: `${h}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-md transition-all duration-500 ease-out group-hover:bg-primary-hover"
                  />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="pt-2 flex justify-between items-center">
          <h2 className="text-[16px] font-extrabold text-foreground">Recent Payouts</h2>
          <button className="text-[12px] font-bold text-accent uppercase tracking-wider">See All</button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center justify-between hover:bg-muted active:scale-[0.98] transition-transform cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground">Weekly Payout</p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">Oct {20 - i * 7}, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[15px] font-extrabold text-[#4CAF50]">+ ₹3,200</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}