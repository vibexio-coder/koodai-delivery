import { useState, useEffect, useRef } from "react";
import { User, Navigation, Package, MapPin, Store, Check, Truck, Star, ArrowRight, TrendingUp, Clock, ShieldCheck } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import {
  doc, getDoc, collection, query, where, onSnapshot,
  collectionGroup, updateDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Order } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Step Progress Indicator - Premium Refined
───────────────────────────────────────────── */
const STEPS = [
  { key: "pending_acceptance", label: "Received" },
  { key: "accepted", label: "Accepted" },
  { key: "picked_up", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function StepProgress({ status }: { status: string }) {
  const current = getStepIndex(status);
  return (
    <div className="w-full px-2 py-4">
      <div className="flex items-center justify-between relative px-1">
        {/* Background Track */}
        <div className="absolute left-0 right-0 top-[11px] h-[3px] bg-border rounded-full z-0 mx-[14px]" />

        {/* Active Progress Fill */}
        <motion.div
          className="absolute left-0 top-[11px] h-[3px] bg-primary rounded-full z-0 mx-[14px]"
          initial={{ width: 0 }}
          animate={{ width: `calc(${(current / (STEPS.length - 1)) * 100}% - 0px)` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />

        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const future = i > current;

          return (
            <div key={step.key} className="flex flex-col items-center z-10 gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.15 : 1,
                  backgroundColor: done ? "#4CAF50" : active ? "#FFC107" : "#FFFFFF",
                  borderColor: done ? "#4CAF50" : active ? "#FFC107" : "var(--border)",
                }}
                className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-colors shadow-sm`}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                ) : active ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ) : null}
              </motion.div>
              <span
                className={`text-[10px] font-bold text-center leading-tight transition-colors duration-300
                  ${done ? "text-[#4CAF50]" : active ? "text-foreground" : "text-muted-foreground"}
                `}
                style={{ maxWidth: 50 }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Slide-to-Confirm Action - Tactile & Premium
───────────────────────────────────────────── */
interface SlideActionProps {
  label: string;
  color: "yellow" | "success" | "pending";
  onConfirm: () => void;
  loading?: boolean;
  direction?: "right" | "left";
}

const TRACK_THEMES = {
  yellow: { track: "bg-secondary", thumb: "bg-primary", label: "text-accent", fill: "bg-primary/10" },
  success: { track: "bg-[#E8F5E9]", thumb: "bg-[#4CAF50]", label: "text-[#2E7D32]", fill: "bg-[#4CAF50]/10" },
  pending: { track: "bg-muted", thumb: "bg-muted-foreground", label: "text-muted-foreground", fill: "bg-muted-foreground/10" },
};

function SlideAction({ label, color, onConfirm, loading = false, direction = "right" }: SlideActionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [done, setDone] = useState(false);
  const startX = useRef(0);
  const dragging = useRef(false);
  const THUMB_W = 60;

  useEffect(() => {
    if (!loading) { setOffset(0); setDone(false); }
  }, [loading]);

  const trackWidth = () => (trackRef.current?.offsetWidth ?? 300) - THUMB_W - 8;
  const isLeft = direction === "left";

  const onStart = (clientX: number) => {
    if (done || loading) return;
    dragging.current = true;
    startX.current = clientX;
  };

  const onMove = (clientX: number) => {
    if (!dragging.current || done) return;
    const max = trackWidth();
    let delta = isLeft ? startX.current - clientX : clientX - startX.current;
    delta = Math.max(0, Math.min(delta, max));
    setOffset(delta);
    if (delta >= max - 2) {
      dragging.current = false;
      setDone(true);
      setOffset(max);
      onConfirm();
    }
  };

  const onEnd = () => {
    if (dragging.current) {
      dragging.current = false;
      setOffset(0);
    }
  };

  const max = typeof window !== "undefined" ? trackWidth() : 240;
  const progress = offset / max;
  const theme = TRACK_THEMES[color];

  return (
    <div
      ref={trackRef}
      className={`relative h-[64px] rounded-2xl overflow-hidden select-none touch-none border border-black/5 shadow-inner ${theme.track}`}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onEnd}
    >
      {/* Background Progress Fill */}
      <div
        className={`absolute top-0 bottom-0 ${theme.fill} transition-none`}
        style={isLeft ? { right: 0, width: offset + THUMB_W } : { left: 0, width: offset + THUMB_W }}
      />

      {/* Centered Label */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-3 text-[16px] font-extrabold pointer-events-none tracking-tight ${theme.label}`}
        style={{ opacity: 1 - progress * 1.5 }}
      >
        <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          {isLeft ? <ArrowRight className="rotate-180 opacity-50 w-5 h-5" /> : <ArrowRight className="opacity-50 w-5 h-5" />}
        </motion.div>
        {label}
      </div>

      {/* Draggable Thumb */}
      <motion.div
        className={`absolute top-[6px] bottom-[6px] rounded-xl ${theme.thumb} flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing z-10`}
        style={{ width: THUMB_W, ...(isLeft ? { right: 6 + offset } : { left: 6 + offset }) }}
        onMouseDown={(e) => { e.preventDefault(); onStart(e.clientX); }}
        onTouchStart={(e) => { onStart(e.touches[0].clientX); }}
      >
        {loading ? (
          <div className="w-6 h-6 rounded-full border-3 border-white/30 border-t-white animate-spin" />
        ) : done ? (
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        ) : (
          <ArrowRight className={`w-6 h-6 ${color === 'yellow' ? 'text-foreground' : 'text-white'} ${isLeft ? 'rotate-180' : ''}`} strokeWidth={3} />
        )}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single Order Card - Elevated Design
───────────────────────────────────────────── */
interface IncomingOrder {
  storeOrderPath: string;
  storeOrderId: string;
  orderId: string;
  customerName: string;
  deliveryAddress: any;
  storeTotal: number;
  storeName: string;
  deliveryStatus: string;
  storeStatus: string;
}

function OrderCard({
  order,
  actionLoading,
  onAction,
}: {
  order: IncomingOrder;
  actionLoading: string | null;
  onAction: (path: string, status: "accepted" | "declined" | "picked_up" | "delivered") => void;
}) {
  const isNew = order.deliveryStatus === "pending_acceptance";
  const isAccepted = order.deliveryStatus === "accepted";
  const isPickedUp = order.deliveryStatus === "picked_up";
  const isDelivered = order.deliveryStatus === "delivered";

  const dropLabel =
    typeof order.deliveryAddress === "object"
      ? order.deliveryAddress?.area || order.deliveryAddress?.city || order.deliveryAddress?.street || "See details"
      : order.deliveryAddress || "—";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-[24px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-5 flex flex-col pt-5"
    >
      {/* Card Body */}
      <div className="px-5 pb-5">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</span>
            <p className="text-[15px] font-black text-foreground">#{order.orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-black text-foreground tracking-tighter">₹{order.storeTotal}</p>
            <div className={`mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
               ${isNew ? "bg-secondary text-accent" : "bg-[#E8F5E9] text-[#2E7D32]"}
             `}>
              <span className={`w-1.5 h-1.5 rounded-full ${isNew ? 'bg-accent animate-pulse' : 'bg-[#2E7D32]'}`} />
              {isNew ? "New Request" : order.deliveryStatus.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-5" />

        <div className="relative pl-7 space-y-6">
          {/* Vertical Path Line */}
          <div className="absolute left-[11px] top-[10px] bottom-[10px] w-0.5 bg-dashed border-l-2 border-dashed border-border" />

          <div className="relative">
            <div className="absolute -left-7 w-[22px] h-[22px] bg-secondary rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Store className="w-3 h-3 text-accent" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Pickup From</p>
            <p className="text-[14px] font-extrabold text-foreground">{order.storeName}</p>
          </div>

          <div className="relative">
            <div className="absolute -left-7 w-[22px] h-[22px] bg-[#E8F5E9] rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <MapPin className="w-3 h-3 text-[#4CAF50]" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Deliver To</p>
            <p className="text-[14px] font-extrabold text-foreground truncate">{dropLabel}</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-muted/30 px-4 py-2 border-t border-border">
        <StepProgress status={order.deliveryStatus} />
      </div>

      {/* Action Footer */}
      <div className="p-5 bg-background border-t border-border">
        {isNew && (
          <div className="flex gap-4">
            <button
              onClick={() => onAction(order.storeOrderPath, "declined")}
              disabled={actionLoading === order.storeOrderPath + "declined"}
              className="flex-1 bg-white hover:bg-muted text-foreground font-black py-4 rounded-2xl transition-all border-2 border-border shadow-sm disabled:opacity-50"
            >
              Decline
            </button>
            <button
              onClick={() => onAction(order.storeOrderPath, "accepted")}
              disabled={actionLoading === order.storeOrderPath + "accepted"}
              className="flex-1 btn-yellow py-4 shadow-lg shadow-primary/20 active:translate-y-0.5"
            >
              Accept Order
            </button>
          </div>
        )}

        {isAccepted && (
          order.storeStatus === "Out for Delivery" || order.storeStatus === "Ready" ? (
            <SlideAction
              label="Slide — Picked Up"
              color="yellow"
              loading={actionLoading === order.storeOrderPath + "picked_up"}
              onConfirm={() => onAction(order.storeOrderPath, "picked_up")}
            />
          ) : (
            <div className="bg-secondary rounded-[20px] p-5 flex items-center justify-between border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Package className="w-6 h-6 text-accent" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-primary/30 rounded-full -z-10"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-black text-foreground">Waiting for Store</p>
                  <p className="text-[11px] font-bold text-accent italic">Packing in progress...</p>
                </div>
              </div>
              <div className="flex gap-1.5 items-end h-6">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-1 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          )
        )}

        {isPickedUp && (
          <SlideAction
            label="Slide — Delivered"
            color="success"
            loading={actionLoading === order.storeOrderPath + "delivered"}
            onConfirm={() => onAction(order.storeOrderPath, "delivered")}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   HOME SCREEN - Redefined Header & Hero
═══════════════════════════════════════════ */
export default function Home() {
  const { isOnline, setOnline } = useAppStore();
  const [userData, setUserData] = useState<any>(null);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (!partnerId) return;
      try {
        const docRef = doc(db, "delivery", partnerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) return;

    const q = query(collection(db, "orders"), where("partnerId", "==", partnerId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      let ordersCount = 0;
      let earnings = 0;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as Order;
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);

        if (createdAt >= startOfToday && createdAt <= endOfToday && (data.status === "completed" || data.status === "delivered")) {
          ordersCount++;
          earnings += Number(data.totalAmount) || 0;
        }
      });
      setTodayOrders(ordersCount);
      setTodayEarnings(earnings);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setIncomingOrders([]);
      return;
    }

    const deliveryPartnerId = userData?.deliveryPartnerId || localStorage.getItem("partnerId");
    if (!deliveryPartnerId) return;

    const q = query(
      collectionGroup(db, "storeOrders"),
      where("delivery.partnerId", "==", deliveryPartnerId),
      where("delivery.status", "in", ["pending_acceptance", "accepted", "picked_up"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders: IncomingOrder[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          storeOrderPath: docSnap.ref.path,
          storeOrderId: docSnap.id,
          orderId: docSnap.ref.parent?.parent?.id || "—",
          customerName: data.customerName || data.userName || "Customer",
          deliveryAddress: data.deliveryAddress || data.address || "—",
          storeTotal: data.storeTotal || 0,
          storeName: data.storeName || "Store",
          deliveryStatus: data.delivery?.status || "pending_acceptance",
          storeStatus: data.storeStatus || "",
        };
      });
      setIncomingOrders(orders);
    });
    return () => unsubscribe();
  }, [isOnline, userData]);

  const handleDeliveryAction = async (storeOrderPath: string, newStatus: "accepted" | "declined" | "picked_up" | "delivered") => {
    setActionLoading(storeOrderPath + newStatus);
    try {
      const ref = doc(db, storeOrderPath);
      await updateDoc(ref, { "delivery.status": newStatus });
    } catch (err) {
      console.error("Error updates:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const name = userData?.basicInfo?.name?.split(" ")[0] || "Partner";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-32 relative">
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-secondary to-transparent pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 px-5 pt-8 pb-4 transition-all bg-secondary/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-primary shadow-sm overflow-hidden p-0.5">
                {userData?.basicInfo?.profilePhoto ? (
                  <img src={userData.basicInfo.profilePhoto} className="w-full h-full object-cover rounded-xl" alt="Avatar" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center rounded-xl">
                    <span className="text-[16px] font-black text-accent">{name[0]?.toUpperCase() || "P"}</span>
                  </div>
                )}
              </div>
              {isOnline && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4CAF50] rounded-full border-4 border-secondary" />}
            </div>
            <div>
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Hello,</p>
              <h1 className="text-[18px] font-black text-foreground leading-tight">{name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/50 border border-border px-4 py-2 rounded-2xl shadow-sm">
            <div className="flex flex-col items-end">
              <span className={`text-[12px] font-black tracking-tighter ${isOnline ? "text-[#2E7D32]" : "text-muted-foreground"}`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <Switch checked={isOnline} onCheckedChange={setOnline} className="scale-90 data-[state=checked]:bg-[#4CAF50]" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 mt-6 space-y-6 max-w-md mx-auto w-full">

        {/* EARNINGS HERO CARD - Premium Redesign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-card rounded-[32px] shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden flex flex-col"
        >
          {/* Top Section */}
          <div className="p-7 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Today's Earnings</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">₹</span>
              <p className="text-[44px] font-black text-foreground leading-none tracking-tighter">{todayEarnings}</p>
            </div>
          </div>

          {/* Bottom Metrics Bar */}
          <div className="bg-muted/30 border-t border-border flex divide-x divide-border">
            <div className="flex-1 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[16px] font-black text-foreground leading-none mb-1">{todayOrders}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase">Orders</p>
              </div>
            </div>
            <div className="flex-1 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[16px] font-black text-foreground leading-none mb-1">0h 42m</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OFFLINE STATE */}
        {!isOnline && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center pt-16">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-muted/30 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-muted/40 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <ShieldCheck className="w-12 h-12 text-muted-foreground/40" />
              </div>
            </div>
            <h2 className="text-[22px] font-black text-foreground mb-2">You're currently offline</h2>
            <p className="text-[15px] font-bold text-muted-foreground max-w-[240px] leading-relaxed">
              Switch to online mode to start receiving delivery requests near you.
            </p>
            <button
              onClick={() => setOnline(true)}
              className="mt-10 btn-yellow px-10 py-4 shadow-xl shadow-primary/20"
            >
              Go Online Now
            </button>
          </motion.div>
        )}

        {/* ONLINE — Looking for orders */}
        {isOnline && incomingOrders.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 flex flex-col items-center">
            {/* Radar Animation - Enhanced */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-10">
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeOut" }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 2, ease: "easeOut" }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />

              <div className="relative z-10 w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-secondary rotate-45">
                <Navigation className="w-10 h-10 text-primary fill-primary -rotate-45" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-[20px] font-black text-foreground">Seeking Requests</h2>
              <p className="text-[14px] font-bold text-muted-foreground px-8 leading-relaxed">
                Stay close to popular restaurant zones for faster order assignment.
              </p>
            </div>

            {/* Smart Tip Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-10 p-5 bg-white border border-border rounded-[28px] shadow-sm flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-accent fill-accent" />
              </div>
              <div>
                <p className="text-[14px] font-black text-foreground mb-0.5">High Demand Area</p>
                <p className="text-[12px] font-bold text-muted-foreground leading-snug italic">
                  Earnings are boosted by 1.2x in your current location!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ACTIVE DELIVERIES */}
        <AnimatePresence mode="popLayout">
          {isOnline && incomingOrders.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-[18px] font-black text-foreground tracking-tight">Active Deliveries</h2>
                <span className="text-[11px] bg-foreground text-white font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em]">
                  {incomingOrders.length} TASKS
                </span>
              </div>
              {incomingOrders.map((order) => (
                <OrderCard key={order.storeOrderPath} order={order} actionLoading={actionLoading} onAction={handleDeliveryAction} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
