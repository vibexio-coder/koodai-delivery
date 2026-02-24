import { useAppStore } from "../store/useAppStore";

type Language = 'en' | 'ta' | 'hi';

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Shared
        appSettings: "App Settings",
        profile: "Profile",
        helpSupport: "Help & Support",
        logout: "Logout",
        appVersion: "App Version",
        loading: "Loading...",

        // Bottom Nav
        navHome: "Home",
        navOrders: "Orders",
        navEarnings: "Earnings",
        navProfile: "Profile",

        // Home
        online: "ONLINE",
        offline: "OFFLINE",
        youAreOffline: "You are Offline",
        goOnlineMsg: "Go online to start receiving orders",
        lookingForOrders: "Looking for orders…",
        highDemandMsg: "Stay in high demand areas",
        earnings: "Earnings",
        orders: "Orders",
        newRequest: "New Request",
        expected: "Expected",
        reject: "Reject",
        accept: "Accept",
        markDelivered: "Mark Delivered",
        orderAccepted: "Order Accepted!",
        orderRejected: "Order Rejected",
        deliveryCompleted: "Delivery Completed!",

        // Orders
        pastOrders: "Past Orders",
        delivered: "Delivered",
        cancelled: "Cancelled",

        // Earnings
        totalEarnings: "Total Earnings",
        withdraw: "Withdraw",
        history: "History",
        weeklyBreakdown: "Weekly Breakdown",
        recentPayouts: "Recent Payouts",
        weeklyPayout: "Weekly Payout",

        // Profile
        rating: "Rating",
        trips: "Trips",
        years: "Years",
        logoutSuccess: "Logged out successfully",

        // Settings
        customizeExperience: "Customize your app experience",
        darkMode: "Dark Mode",
        darkModeDesc: "Switch between light & dark theme",
        soundAlerts: "Sound Alerts",
        soundAlertsDesc: "Play sound for new orders",
        autoOnline: "Auto Go Online",
        autoOnlineDesc: "Automatically go online when app opens",
        language: "Language",
        selectLanguage: "Select your preferred language",
        clearAppData: "Clear App Data",
        dataCleared: "App data cleared",
    },
    ta: {
        // Shared
        appSettings: "பயலியின் அமைப்புகள்",
        profile: "சுயவிவரம்",
        helpSupport: "உதவி & ஆதரவு",
        logout: "வெளியேறு",
        appVersion: "செயலி பதிப்பு",
        loading: "ஏற்றுகிறது...",

        // Bottom Nav
        navHome: "முகப்பு",
        navOrders: "ஆர்டர்கள்",
        navEarnings: "வருவாய்",
        navProfile: "சுயவிவரம்",

        // Home
        online: "ஆன்லைன்",
        offline: "ஆஃப்லைன்",
        youAreOffline: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்",
        goOnlineMsg: "ஆர்டர்களைப் பெற ஆன்லைனுக்குச் செல்லவும்",
        lookingForOrders: "ஆர்டர்களைத் தேடுகிறது…",
        highDemandMsg: "அதிக தேவை உள்ள பகுதிகளில் இருக்கவும்",
        earnings: "வருவாய்",
        orders: "ஆர்டர்கள்",
        newRequest: "புதிய கோரிக்கை",
        expected: "எதிர்பார்க்கப்படுவது",
        reject: "நிராகரி",
        accept: "ஏற்றுக்கொள்",
        markDelivered: "வழங்கப்பட்டது",
        orderAccepted: "ஆர்டர் ஏற்றுக்கொள்ளப்பட்டது!",
        orderRejected: "ஆர்டர் நிராகரிக்கப்பட்டது",
        deliveryCompleted: "டெலிவரி முடிந்தது!",

        // Orders
        pastOrders: "கடந்தகால ஆர்டர்கள்",
        delivered: "வழங்கப்பட்டது",
        cancelled: "ரத்து செய்யப்பட்டது",

        // Earnings
        totalEarnings: "மொத்த வருவாய்",
        withdraw: "திரும்பப் பெறு",
        history: "வரலாறு",
        weeklyBreakdown: "வாராந்திர விவரம்",
        recentPayouts: "சமீபத்திய கொடுப்பனவுகள்",
        weeklyPayout: "வாராந்திர கொடுப்பனவு",

        // Profile
        rating: "மதிப்பீடு",
        trips: "பயணங்கள்",
        years: "ஆண்டுகள்",
        logoutSuccess: "வெற்றிகரமாக வெளியேற்றப்பட்டது",

        // Settings
        customizeExperience: "உங்கள் அனுபவத்தை மாற்றியமைக்கவும்",
        darkMode: "டார்க் மோட்",
        darkModeDesc: "கருப்பு மற்றும் வெள்ளை தீம்களுக்கு மாறவும்",
        soundAlerts: "ஒலி அறிவிப்புகள்",
        soundAlertsDesc: "புதிய ஆர்டர்களுக்கு ஒலி எழுப்புக",
        autoOnline: "தானியங்கி ஆன்லைன்",
        autoOnlineDesc: "செயலி திறக்கும்போது தானாக ஆன்லைனுக்குச் செல்லவும்",
        language: "மொழி",
        selectLanguage: "உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்",
        clearAppData: "தரவை அழி",
        dataCleared: "தரவு அழிக்கப்பட்டது",
    },
    hi: {
        // Shared
        appSettings: "ऐप सेटिंग्स",
        profile: "प्रोफ़ाइल",
        helpSupport: "सहायता और समर्थन",
        logout: "लॉग आउट",
        appVersion: "ऐप संस्करण",
        loading: "लोड हो रहा है...",

        // Bottom Nav
        navHome: "होम",
        navOrders: "ऑर्डर",
        navEarnings: "कमाई",
        navProfile: "प्रोफ़ाइल",

        // Home
        online: "ऑनलाइन",
        offline: "ऑफ़लाइन",
        youAreOffline: "आप ऑफ़लाइन हैं",
        goOnlineMsg: "ऑर्डर प्राप्त करने के लिए ऑनलाइन जाएं",
        lookingForOrders: "ऑर्डर खोज रहा है…",
        highDemandMsg: "उच्च मांग वाले क्षेत्रों में रहें",
        earnings: "कमाई",
        orders: "ऑर्डर",
        newRequest: "नया अनुरोध",
        expected: "अपेक्षित",
        reject: "अस्वीकार करें",
        accept: "स्वीकार करें",
        markDelivered: "वितरित चिह्नित करें",
        orderAccepted: "ऑर्डर स्वीकार कर लिया गया!",
        orderRejected: "ऑर्डर अस्वीकार कर दिया गया",
        deliveryCompleted: "डिलीवरी पूरी हुई!",

        // Orders
        pastOrders: "पिछले ऑर्डर",
        delivered: "वितरित",
        cancelled: "रद्द किया गया",

        // Earnings
        totalEarnings: "कुल कमाई",
        withdraw: "निकालना",
        history: "इतिहास",
        weeklyBreakdown: "साप्ताहिक विवरण",
        recentPayouts: "हाल ही में भुगतान",
        weeklyPayout: "साप्ताहिक भुगतान",

        // Profile
        rating: "रेटिंग",
        trips: "ट्रिप्स",
        years: "साल",
        logoutSuccess: "सफलतापूर्वक लॉग आउट किया गया",

        // Settings
        customizeExperience: "अपना अनुभव अनुकूलित करें",
        darkMode: "डार्क मोड",
        darkModeDesc: "लाइट और डार्क थीम के बीच स्विच करें",
        soundAlerts: "ध्वनि अलार्म",
        soundAlertsDesc: "नए ऑर्डर के लिए ध्वनि बजाएं",
        autoOnline: "ऑटो ऑनलाइन",
        autoOnlineDesc: "ऐप खुलने पर अपने आप ऑनलाइन हो जाएं",
        language: "भाषा",
        selectLanguage: "अपनी पसंद की भाषा चुनें",
        clearAppData: "ऐप डेटा साफ़ करें",
        dataCleared: "ऐप डेटा साफ़ किया गया",
    }
};

export const t = (key: string): string => {
    // 1. Get current language from store (hook-less access if possible, or we pass it)
    // Since hooks can't be used outside components, we'll assume the component passes the lang
    // OR we can access the store directly via getState() for non-reactive usage, 
    // but for reactive UI, components should trigger re-renders.

    // Let's make this a hook or just a function that takes the lang.
    // Better yet, direct store access valid for simple utils:
    const lang = useAppStore.getState().language || 'en';

    // 2. Fetch dictionary
    const dict = translations[lang] || translations['en'];

    // 3. Fetch key, fallback to En if missing
    return dict[key] || translations['en'][key] || key;
};
