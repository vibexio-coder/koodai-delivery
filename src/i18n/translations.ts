import { useAppStore } from "../store/useAppStore";

type Language = 'en' | 'ta' | 'hi';

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Shared
        appSettings: "App Settings",
        profile: "Profile",
        logout: "Logout",
        appVersion: "App Version",
        loading: "Loading...",

        // Help & Support
        helpSupport: "Help & Support",
        howCanWeHelp: "How can we help you today?",
        contactOptions: "Contact Options",
        inAppChat: "In-App Chat Support",
        chatWithSupport: "Chat with our support team directly",
        reportOrderIssue: "Report Order Issue",
        reportProblemLive: "Report a problem with a live order",
        callSupport: "Call Support",
        faqsLabel: "FAQ's",
        faqsDesc: "Frequently asked questions",

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

        // Profile Extra
        accountTitle: "Account",
        profileDetails: "Profile Details",
        vehicleDetails: "Vehicle Details",
        documents: "Documents",
        paymentDetails: "Payment Details",
        settingsSupportTitle: "Settings & Support",
        notifications: "Notifications",
        faq: "FAQ",
        ratingStat: "Rating",
        deliveriesStat: "Deliveries",
        experienceStat: "Experience",

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

        // Settings Additional
        settingsTitle: "Settings",
        appPreferences: "App Preferences",
        localization: "Localization",
        selectAppLanguage: "Select app language",

        // Orders
        orderHistory: "Order History",
        noOrdersYet: "No orders yet",
        startAcceptingDeliveries: "Start accepting deliveries to see your completed orders here.",
        storeEntity: "Store",
        customerEntity: "Customer",

        // Earnings
        today: "Today",
        week: "Week",
        month: "Month",
        weeklyPerformance: "Weekly Performance",
        seeAll: "See All",

        // Home
        received: "Received",
        stepAccepted: "Accepted",
        inTransit: "In Transit",
        stepDelivered: "Delivered",
        orderIdLabel: "Order ID",
        pickupFrom: "Pickup From",
        deliverTo: "Deliver To",
        decline: "Decline",
        acceptOrder: "Accept Order",
        slidePickedUp: "Slide — Picked Up",
        waitingForStore: "Waiting for Store",
        packingInProgress: "Packing in progress...",
        slideDelivered: "Slide — Delivered",
        hello: "Hello,",
        todaysEarnings: "Today's Earnings",
        ordersCount: "Orders",
        activeTime: "Active",
        switchOnlineMsg: "Switch to online mode to start receiving delivery requests near you.",
        goOnlineNow: "Go Online Now",
        seekingRequests: "Seeking Requests",
        stayCloseTip: "Stay close to popular restaurant zones for faster order assignment.",
        highDemandArea: "High Demand Area",
        earningsBoosted: "Earnings are boosted by 1.2x in your current location!",
        activeDeliveries: "Active Deliveries",
        tasks: "TASKS",
    },
    ta: {
        // Shared
        appSettings: "பயலியின் அமைப்புகள்",
        profile: "சுயவிவரம்",
        logout: "வெளியேறு",
        appVersion: "செயலி பதிப்பு",
        loading: "ஏற்றுகிறது...",

        // Help & Support
        helpSupport: "உதவி மற்றும் ஆதரவு",
        howCanWeHelp: "நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        contactOptions: "தொடர்பு விருப்பங்கள்",
        inAppChat: "உள்-பயன்பாட்டு அரட்டை ஆதரவு",
        chatWithSupport: "எங்கள் ஆதரவுக் குழுவுடன் நேரடியாக அரட்டை அடிக்கவும்",
        reportOrderIssue: "ஆர்டர் சிக்கலைப் புகாரளி",
        reportProblemLive: "நேரடி ஆர்டரில் உள்ள சிக்கலைப் புகாரளி",
        callSupport: "ஆதரவை அழைக்கவும்",
        faqsLabel: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
        faqsDesc: "அடிக்கடி கேட்கப்படும் கேள்விகள்",

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

        // Profile Extra
        accountTitle: "கணக்கு",
        profileDetails: "சுயவிவர விவரங்கள்",
        vehicleDetails: "வாகன விவரங்கள்",
        documents: "ஆவணங்கள்",
        paymentDetails: "கட்டண விவரங்கள்",
        settingsSupportTitle: "அமைப்புகள் மற்றும் ஆதரவு",
        notifications: "அறிவிப்புகள்",
        faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
        ratingStat: "மதிப்பீடு",
        deliveriesStat: "டெலிவரிகள்",
        experienceStat: "அனுபவம்",

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

        // Settings Additional
        settingsTitle: "அமைப்புகள்",
        appPreferences: "பயன்பாட்டு முன்னுரிமைகள்",
        localization: "உள்ளூர்மயமாக்கல்",
        selectAppLanguage: "பயன்பாட்டு மொழியைத் தேர்ந்தெடுக்கவும்",

        // Orders
        orderHistory: "ஆர்டர் வரலாறு",
        noOrdersYet: "இன்னும் ஆர்டர்கள் இல்லை",
        startAcceptingDeliveries: "உங்கள் முடிக்கப்பட்ட ஆர்டர்களை இங்கே காண டெலிவரிகளை ஏற்கத் தொடங்குங்கள்.",
        storeEntity: "கடை",
        customerEntity: "வாடிக்கையாளர்",

        // Earnings
        today: "இன்று",
        week: "வாரம்",
        month: "மாதம்",
        weeklyPerformance: "வாராந்திர செயல்பாடு",
        seeAll: "அனைத்தையும் காண்க",

        // Home
        received: "பெறப்பட்டது",
        stepAccepted: "ஏற்றுக்கொள்ளப்பட்டது",
        inTransit: "பயணத்தில்",
        stepDelivered: "வழங்கப்பட்டது",
        orderIdLabel: "ஆர்டர் ஐடி",
        pickupFrom: "பிக்அப் இடம்",
        deliverTo: "வழங்கும் இடம்",
        decline: "நிராகரி",
        acceptOrder: "ஆர்டரை ஏற்றுக்கொள்",
        slidePickedUp: "ஸ்லைடு — பெறப்பட்டது",
        waitingForStore: "கடைக்காக காத்திருக்கிறது",
        packingInProgress: "பேக்கிங் நடக்கிறது...",
        slideDelivered: "ஸ்லைடு — வழங்கப்பட்டது",
        hello: "வணக்கம்,",
        todaysEarnings: "இன்றைய வருவாய்",
        ordersCount: "ஆர்டர்கள்",
        activeTime: "செயலில்",
        switchOnlineMsg: "உங்கள் அருகில் உள்ள டெலிவரி கோரிக்கைகளைப் பெற ஆன்லைன் முறைக்கு மாறவும்.",
        goOnlineNow: "இப்போது ஆன்லைனுக்குச் செல்",
        seekingRequests: "கோரிக்கைகளைத் தேடுகிறது",
        stayCloseTip: "விரைவான ஆர்டர் ஒதுக்கீட்டிற்கு பிரபலமான உணவகப் பகுதிகளுக்கு அருகில் இருங்கள்.",
        highDemandArea: "அதிக தேவை உள்ள பகுதி",
        earningsBoosted: "உங்கள் தற்போதைய இடத்தில் வருவாய் 1.2 மடங்கு அதிகரிக்கப்பட்டுள்ளது!",
        activeDeliveries: "செயலில் உள்ள டெலிவரிகள்",
        tasks: "பணிகள்",
    },
    hi: {
        // Shared
        appSettings: "ऐप सेटिंग्स",
        profile: "प्रोफ़ाइल",
        logout: "लॉग आउट",
        appVersion: "ऐप संस्करण",
        loading: "लोड हो रहा है...",

        // Help & Support
        helpSupport: "सहायता और समर्थन",
        howCanWeHelp: "आज हम आपकी कैसे मदद कर सकते हैं?",
        contactOptions: "संपर्क विकल्प",
        inAppChat: "इन-ऐप चैट सपोर्ट",
        chatWithSupport: "हमारी सपोर्ट टीम से सीधे चैट करें",
        reportOrderIssue: "ऑर्डर समस्या की रिपोर्ट करें",
        reportProblemLive: "लाइव ऑर्डर के साथ समस्या की रिपोर्ट करें",
        callSupport: "सपोर्ट को कॉल करें",
        faqsLabel: "सामान्य प्रश्न",
        faqsDesc: "अक्सर पूछे जाने वाले प्रश्न",

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

        // Profile Extra
        accountTitle: "खाता",
        profileDetails: "प्रोफ़ाइल विवरण",
        vehicleDetails: "वाहन विवरण",
        documents: "दस्तावेज़",
        paymentDetails: "भुगतान विवरण",
        settingsSupportTitle: "सेटिंग्स और सहायता",
        notifications: "सूचनाएं",
        faq: "अक्सर पूछे जाने वाले प्रश्न",
        ratingStat: "रेटिंग",
        deliveriesStat: "वितरण",
        experienceStat: "अनुभव",

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

        // Settings Additional
        settingsTitle: "सेटिंग्स",
        appPreferences: "ऐप प्राथमिकताएं",
        localization: "स्थानीयकरण",
        selectAppLanguage: "ऐप की भाषा चुनें",

        // Orders
        orderHistory: "ऑर्डर का इतिहास",
        noOrdersYet: "अभी तक कोई ऑर्डर नहीं",
        startAcceptingDeliveries: "अपने पूरे किए गए ऑर्डर यहां देखने के लिए डिलीवरी स्वीकार करना शुरू करें।",
        storeEntity: "स्टोर",
        customerEntity: "ग्राहक",

        // Earnings
        today: "आज",
        week: "सप्ताह",
        month: "महीना",
        weeklyPerformance: "साप्ताहिक प्रदर्शन",
        seeAll: "सभी देखें",

        // Home
        received: "प्राप्त किया",
        stepAccepted: "स्वीकार किया गया",
        inTransit: "रास्ते में",
        stepDelivered: "वितरित",
        orderIdLabel: "ऑर्डर आईडी",
        pickupFrom: "यहां से पिकअप",
        deliverTo: "यहां वितरित करें",
        decline: "अस्वीकार करें",
        acceptOrder: "ऑर्डर स्वीकार करें",
        slidePickedUp: "स्लाइड — पिकअप किया गया",
        waitingForStore: "स्टोर की प्रतीक्षा में",
        packingInProgress: "पैकिंग चल रही है...",
        slideDelivered: "स्लाइड — वितरित",
        hello: "नमस्ते,",
        todaysEarnings: "आज की कमाई",
        ordersCount: "ऑर्डर",
        activeTime: "सक्रिय",
        switchOnlineMsg: "अपने आस-पास डिलीवरी अनुरोध प्राप्त करना शुरू करने के लिए ऑनलाइन मोड पर स्विच करें।",
        goOnlineNow: "अभी ऑनलाइन जाएं",
        seekingRequests: "अनुरोध प्राप्त कर रहा है",
        stayCloseTip: "तेज ऑर्डर असाइनमेंट के लिए लोकप्रिय रेस्तरां क्षेत्रों के करीब रहें।",
        highDemandArea: "उच्च मांग वाला क्षेत्र",
        earningsBoosted: "आपके वर्तमान स्थान में कमाई में 1.2x की वृद्धि हुई है!",
        activeDeliveries: "सक्रिय डिलीवरी",
        tasks: "कार्य",
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
