import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    isOnline: boolean;
    setOnline: (status: boolean) => void;
    toggleOnline: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isOnline: false,
            setOnline: (status) => set({ isOnline: status }),
            toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
        }),
        {
            name: "app-storage", // unique name
        }
    )
);
