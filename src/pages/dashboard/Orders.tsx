import { useState, useEffect } from "react";
import { Calendar, Package } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { t } from "../../i18n/translations";

interface DeliveryOrder {
  id: string;
  orderId?: number;
  status: string;
  totalAmount: number;
  createdAt: any;
  // Vendor / store info
  storeName?: string;
  restaurantName?: string;
  // Drop-off
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
    if (!partnerId) {
      setLoading(false);
      return;
    }

    // Fetch all orders assigned to this partner
    const q = query(
      collection(db, "orders"),
      where("partnerId", "==", partnerId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: DeliveryOrder[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DeliveryOrder, "id">),
        }));
        setOrders(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400";
      case "out_for_delivery":
      case "out for delivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400";
    }
  };

  const statusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return t("delivered");
      case "cancelled":
        return t("cancelled");
      case "out_for_delivery":
      case "out for delivery":
        return "Out for Delivery";
      default:
        return status ?? "—";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-4 sticky top-0 z-10 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">{t("pastOrders")}</h1>
      </div>

      <div className="p-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-20 text-muted-foreground">
            <Package className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <p className="text-base font-medium">No orders yet</p>
            <p className="text-sm mt-1">Orders you accept will appear here</p>
          </div>
        )}

        {orders.map((order) => {
          const from = order.storeName ?? order.restaurantName ?? "Store";
          const to =
            order.deliveryAddress?.area ??
            order.deliveryAddress?.city ??
            order.deliveryAddress?.street ??
            order.customerName ??
            order.userName ??
            "Customer";

          const displayId = order.orderId
            ? `ORD-${order.orderId}`
            : `#${order.id.slice(0, 6).toUpperCase()}`;

          return (
            <Card key={order.id} className="border-none rounded-2xl bg-card shadow-sm">
              <CardContent className="p-4 space-y-3">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-foreground">{displayId}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{order.totalAmount ?? "—"}</p>
                    <Badge className={statusColor(order.status)}>
                      {statusLabel(order.status)}
                    </Badge>
                  </div>
                </div>

                {/* Route */}
                <div className="relative pl-4 space-y-3 border-l-2 border-dashed border-border">
                  <RoutePoint color="green" label={from} />
                  <RoutePoint color="red" label={to} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RoutePoint({ color, label }: { color: "green" | "red"; label: string }) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[9px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card ${color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
      />
      <p className="text-xs font-medium text-foreground">{label}</p>
    </div>
  );
}