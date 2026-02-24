import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    isOnline: boolean;
    language: 'en' | 'ta' | 'hi';
    setOnline: (status: boolean) => void;
    toggleOnline: () => void;
    setLanguage: (lang: 'en' | 'ta' | 'hi') => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isOnline: false,
            language: 'en', // Default fallback
            setOnline: (status) => set({ isOnline: status }),
            toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: "app-storage", // unique name
        }
    )
);
