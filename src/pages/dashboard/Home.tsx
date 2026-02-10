import { useState, useEffect } from "react";
import { User, MapPin, Clock, Navigation } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";
import { doc, getDoc, collection, query, where, onSnapshot, Timestamp, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Order } from "../../types";

type OrderState = "idle" | "offered" | "active" | "completed";

export default function Home() {
  const [isOnline, setIsOnline] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>("idle");
  const [countdown, setCountdown] = useState(30);
  const [userData, setUserData] = useState<any>(null);

  // New state for daily stats
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (partnerId) {
        try {
          const docRef = doc(db, "delivery", partnerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, []);

  // Fetch and filter orders for ONLY today
  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) return;

    // Listen to all orders for this partner
    // We filter strictly for "Today" on the client side to avoid complex index requirements right now
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

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Order;
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);

        // Filter: Created Today AND Status is Completed/Delivered
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

  useEffect(() => {
    let timer: any;
    if (isOnline && orderState === "idle") {
      timer = setTimeout(() => {
        setOrderState("offered");
        setCountdown(30);
        toast.info("New Order Request!", {
          description: "Pickup from Anna Nagar",
        });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isOnline, orderState]);

  useEffect(() => {
    let interval: any;
    if (orderState === "offered" && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((p) => p - 1);
      }, 1000);
    } else if (orderState === "offered" && countdown === 0) {
      setOrderState("idle");
      toast.error("Order Missed");
    }
    return () => clearInterval(interval);
  }, [orderState, countdown]);

  const handleAccept = () => {
    setOrderState("active");
    toast.success("Order Accepted!");
  };

  const handleReject = () => {
    setOrderState("idle");
    toast.info("Order Rejected");
  };

  const handleComplete = () => {
    setOrderState("completed");
    toast.success("Delivery Completed!");
    setTimeout(() => {
      setOrderState("idle");
      setIsOnline(true);
    }, 1500);
  };

  // Temporary function to seed test data
  const seedTestData = async () => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) {
      toast.error("No partner ID found");
      return;
    }

    try {
      // Order 1: Today (Should count)
      await addDoc(collection(db, "orders"), {
        partnerId,
        totalAmount: 100,
        status: "completed",
        createdAt: Timestamp.now(),
        userId: "test-user",
        restaurantId: "test-rest-1",
        restaurantName: "Test Restaurant",
        items: []
      });

      // Order 2: Yesterday (Should NOT count)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await addDoc(collection(db, "orders"), {
        partnerId,
        totalAmount: 50,
        status: "completed", // Even if completed, date is wrong
        createdAt: Timestamp.fromDate(yesterday),
        userId: "test-user",
        restaurantId: "test-rest-2",
        restaurantName: "Yesterday Foods",
        items: []
      });

      toast.success("Test data seeded! Check Dashboard.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to seed data");
    }
  };

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
              {userData?.basicInfo?.name || "Loading..."}
            </h1>
            <p className="text-xs text-muted-foreground">
              ID: {userData ? `KD-${localStorage.getItem("partnerId")?.slice(0, 4).toUpperCase()}` : "..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${isOnline ? "text-green-500" : "text-gray-400"
              }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <Switch checked={isOnline} onCheckedChange={setIsOnline} />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-yellow-400 border-none rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-yellow-900">Earnings</p>
              <p className="text-xl font-bold text-black">
                ₹{todayEarnings.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-xl font-bold text-foreground">
                {todayOrders}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debug Tool - REMOVE IN PROD */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={seedTestData} className="text-xs h-7">
            Seed Test Data
          </Button>
        </div>

        {/* Offline */}
        {!isOnline && (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              You are Offline
            </h2>
            <p className="text-sm text-muted-foreground">
              Go online to start receiving orders
            </p>
          </div>
        )}

        {/* Searching */}
        {isOnline && orderState === "idle" && (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="relative w-20 h-20 mb-6">
              <span className="absolute w-full h-full rounded-full bg-yellow-400/30 animate-ping"></span>
              <div className="relative w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <Navigation className="w-8 h-8 text-black" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Looking for orders…
            </h2>
            <p className="text-sm text-muted-foreground">
              Stay in high demand areas
            </p>
          </div>
        )}

        {/* Offer */}
        {isOnline && orderState === "offered" && (
          <Card className="border-2 border-yellow-400 rounded-2xl bg-card">
            <CardHeader>
              <div className="flex justify-between">
                <Badge className="bg-yellow-100 text-yellow-800">
                  New Request
                </Badge>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">₹85</p>
                  <p className="text-xs text-muted-foreground">Expected</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoDot color="green" title="Hotel Saravana Bhavan" desc="Anna Nagar" />
              <InfoDot color="red" title="Drop Location" desc="Green Park Apts" />

              <div className="flex gap-4 text-sm text-muted-foreground bg-accent p-3 rounded-lg">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 25 mins
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 4.2 km
                </span>
              </div>
            </CardContent>

            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1" onClick={handleReject}>
                Reject
              </Button>
              <Button
                className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
                onClick={handleAccept}
              >
                Accept ({countdown}s)
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Active */}
        {orderState === "active" && (
          <Card className="bg-card rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="h-60 bg-muted rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleComplete}
              >
                Mark Delivered
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function InfoDot({
  color,
  title,
  desc,
}: {
  color: "green" | "red";
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`w-2 h-2 mt-2 rounded-full ${color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
