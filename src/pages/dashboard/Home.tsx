import { useState, useEffect } from "react";
import { User, Navigation, Package } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { doc, getDoc, collection, query, where, onSnapshot, collectionGroup, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Order } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { t } from "../../i18n/translations";

export default function Home() {
  const { isOnline, setOnline } = useAppStore();
  const [userData, setUserData] = useState<any>(null);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    const fetchProfile = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (!partnerId) return;
      try {
        const docRef = doc(db, "delivery", partnerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  /* ---------- TODAY'S STATS ---------- */
  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) return;

    const q = query(
      collection(db, "orders"),
      where("partnerId", "==", partnerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      let ordersCount = 0;
      let earnings = 0;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as Order;
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt);

        if (
          createdAt >= startOfToday &&
          createdAt <= endOfToday &&
          (data.status === "completed" || data.status === "delivered")
        ) {
          ordersCount++;
          earnings += Number(data.totalAmount) || 0;
        }
      });

      setTodayOrders(ordersCount);
      setTodayEarnings(earnings);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- INCOMING ORDER LISTENER ---------- */
  // Uses deliveryPartnerId (e.g. 'CHE-DP-0002') — matches what vendor writes to delivery.partnerId
  useEffect(() => {
    const deliveryPartnerId = userData?.deliveryPartnerId;
    if (!deliveryPartnerId || !isOnline) {
      setIncomingOrders([]);
      return;
    }

    const q = query(
      collectionGroup(db, "storeOrders"),
      where("delivery.partnerId", "==", deliveryPartnerId),
      where("delivery.status", "in", ["pending_acceptance", "accepted", "picked_up"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((docSnap) => {
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
    }, (err) => {
      console.error("Incoming order listener error:", err);
    });

    return () => unsubscribe();
  }, [isOnline, userData]);



  /* ---------- ACCEPT / DECLINE ---------- */
  const handleDeliveryAction = async (storeOrderPath: string, newStatus: "accepted" | "declined" | "picked_up" | "delivered") => {
    setActionLoading(storeOrderPath + newStatus);
    try {
      const ref = doc(db, storeOrderPath);
      // Delivery partner only writes delivery.status — vendor panel handles storeStatus
      await updateDoc(ref, { "delivery.status": newStatus });
    } catch (err) {
      console.error("Error updating delivery status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border p-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userData?.basicInfo?.profilePhoto || "https://github.com/shadcn.png"} />
            <AvatarFallback>{userData?.basicInfo?.name?.[0] || "D"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-sm font-bold text-foreground">
              {userData?.basicInfo?.name || t("loading")}
            </h1>
            <p className="text-xs text-muted-foreground">
              ID: {userData?.deliveryPartnerId ?? "..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? t("online") : t("offline")}
          </span>
          <Switch checked={isOnline} onCheckedChange={setOnline} />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-yellow-400 border-none rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-yellow-900">{t("earnings")}</p>
              <p className="text-xl font-bold text-black">
                ₹{todayEarnings.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{t("orders")}</p>
              <p className="text-xl font-bold text-foreground">
                {todayOrders}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Offline state */}
        {!isOnline && (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("youAreOffline")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("goOnlineMsg")}
            </p>
          </div>
        )}

        {/* Online — Incoming order cards */}
        {isOnline && incomingOrders.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">🔔 New Order Requests</h2>
            {incomingOrders.map((order) => (
              <Card
                key={order.storeOrderPath}
                className={`rounded-2xl border-2 ${order.deliveryStatus === 'pending_acceptance' ? 'border-yellow-400' : order.deliveryStatus === 'picked_up' ? 'border-purple-400' : 'border-green-400'}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        #{order.orderId.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.storeName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-foreground">₹{order.storeTotal}</span>
                      <p className="text-xs mt-1">
                        {order.deliveryStatus === 'pending_acceptance' && <span className="text-yellow-600 font-medium">New Request</span>}
                        {order.deliveryStatus === 'accepted' && <span className="text-green-600 font-medium">✔ Accepted</span>}
                        {order.deliveryStatus === 'picked_up' && <span className="text-purple-600 font-medium">🚚 Picked Up</span>}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Package className="w-3 h-3" />
                      <span>Pickup: {order.storeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>📍</span>
                      <span>Drop: {
                        typeof order.deliveryAddress === "object"
                          ? (order.deliveryAddress?.area || order.deliveryAddress?.city || order.deliveryAddress?.street || "See details")
                          : order.deliveryAddress
                      }</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>👤</span>
                      <span>{order.customerName}</span>
                    </div>
                  </div>

                  {/* Action buttons vary by status */}
                  {order.deliveryStatus === 'pending_acceptance' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleDeliveryAction(order.storeOrderPath, "declined")}
                        disabled={!!actionLoading}
                        className="flex-1 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200 active:scale-95 transition-transform disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleDeliveryAction(order.storeOrderPath, "accepted")}
                        disabled={!!actionLoading}
                        className="flex-1 py-2 text-sm font-semibold text-black bg-yellow-400 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
                      >
                        {actionLoading === order.storeOrderPath + "accepted" ? "..." : "Accept"}
                      </button>
                    </div>
                  )}

                  {order.deliveryStatus === 'accepted' && (
                    <div className="pt-1">
                      {order.storeStatus === 'Out for Delivery' ? (
                        <button
                          onClick={() => handleDeliveryAction(order.storeOrderPath, "picked_up")}
                          disabled={!!actionLoading}
                          className="w-full py-2 text-sm font-semibold text-white bg-purple-500 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
                        >
                          {actionLoading === order.storeOrderPath + "picked_up" ? "..." : "📦 Mark Picked Up"}
                        </button>
                      ) : (
                        <div className="text-center py-2 text-sm text-muted-foreground bg-muted rounded-xl">
                          ⏳ Waiting for store to pack order...
                        </div>
                      )}
                    </div>
                  )}

                  {order.deliveryStatus === 'picked_up' && (
                    <div className="pt-1">
                      <button
                        onClick={() => handleDeliveryAction(order.storeOrderPath, "delivered")}
                        disabled={!!actionLoading}
                        className="w-full py-2 text-sm font-semibold text-white bg-green-500 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
                      >
                        {actionLoading === order.storeOrderPath + "delivered" ? "..." : "✅ Mark Delivered"}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}


        {/* Online — Looking for orders */}
        {isOnline && incomingOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="relative w-20 h-20 mb-6">
              <span className="absolute w-full h-full rounded-full bg-yellow-400/30 animate-ping" />
              <div className="relative w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <Navigation className="w-8 h-8 text-black" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("lookingForOrders")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("highDemandMsg")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
