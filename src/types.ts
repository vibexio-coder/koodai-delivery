export interface Order {
    id: string;
    partnerId: string;
    totalAmount: number;
    status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled" | "completed";
    createdAt: any; // Firestore Timestamp
    userId: string;
    restaurantId: string;
    restaurantName: string;
    items: any[];
}
