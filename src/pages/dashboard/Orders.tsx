import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { t } from "../../i18n/translations";

interface DeliveryOrder {
  id: string;
  orderId?: number;
  status: string;
  totalAmount: number;
  createdAt: any;
  storeName?: string;
  restaurantName?: string;
  deliveryAddress?: { city?: string; area?: string; street?: string };
  customerName?: string;
  userName?: string;
}

function formatDate(timestamp: any): string {
  if (!timestamp) return "—";
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) {
    return "Today, " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } else if (date >= startOfYesterday) {
    return "Yesterday, " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) { setLoading(false); return; }

    const q = query(collection(db, "orders"), where("partnerId", "==", partnerId), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: DeliveryOrder[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DeliveryOrder, "id">),
      }));
      setOrders(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": case "completed":
        return "bg-[#E8F5E9] text-[#4CAF50]";
      case "cancelled": case "rejected":
        return "bg-[#FFF0F0] text-[#ef4444]";
      case "out_for_delivery": case "out for delivery":
        return "bg-[#F3E8FF] text-[#A855F7]";
      default:
        return "bg-[#FFF8E1] text-[#FFB300]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": case "completed": return t("stepDelivered") || "Delivered";
      case "cancelled": return t("cancelled") || "Cancelled";
      case "out_for_delivery": case "out for delivery": return t("inTransit") || "In Transit";
      default: return status ?? "—";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24 relative">
      {/* Header */}
      <div className="bg-secondary p-5 pt-10 sticky top-0 z-10 border-b border-primary/20 shadow-sm">
        <h1 className="text-[18px] font-extrabold text-foreground">{t("orderHistory") || "Order History"}</h1>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 rounded-full border-4 border border-border border-t-primary animate-spin" />
          </div>
        )}

        {!loading && orders.filter(o => ['delivered', 'completed'].includes(o.status?.toLowerCase())).length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl filter drop-shadow-sm">📦</span>
            </div>
            <h2 className="text-[18px] font-extrabold text-foreground mb-2">{t("noOrdersYet") || "No orders yet"}</h2>
            <p className="text-[14px] font-medium text-muted-foreground mb-4 max-w-xs">
              {t("startAcceptingDeliveries") || "Start accepting deliveries to see your completed orders here."}
            </p>
          </div>
        )}

        {orders.filter(o => ['delivered', 'completed'].includes(o.status?.toLowerCase())).map((order) => {
          const from = order.storeName ?? order.restaurantName ?? "Store";
          const to = order.deliveryAddress?.area ?? order.deliveryAddress?.city ?? order.deliveryAddress?.street ?? order.customerName ?? order.userName ?? "Customer";
          const displayId = order.orderId ? `ORD-${order.orderId}` : `#${order.id.slice(0, 6).toUpperCase()}`;

          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[14px] font-bold text-foreground">{displayId}</p>
                  <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-extrabold text-foreground">₹{order.totalAmount ?? "—"}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="relative pl-3 border-l-2 border-dashed border-border space-y-4 ml-1">
                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-card border-[3px] border-foreground" />
                  <p className="text-[13px] font-bold text-muted-foreground leading-tight">{from}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-card border-[3px] border-[#4CAF50]" />
                  <p className="text-[13px] font-bold text-foreground leading-tight">{to}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}