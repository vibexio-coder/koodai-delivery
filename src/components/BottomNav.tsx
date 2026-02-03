import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, DollarSign, User } from 'lucide-react';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            path: '/dashboard',
            icon: Home,
            label: 'Home',
        },
        {
            path: '/dashboard/orders',
            icon: Package,
            label: 'Orders',
        },
        {
            path: '/dashboard/earnings',
            icon: DollarSign,
            label: 'Earnings',
        },
        {
            path: '/dashboard/profile',
            icon: User,
            label: 'Profile',
        },
    ];

    const getButtonClass = (path: string) => {
        const isActive = location.pathname === path;
        return isActive
            ? "w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center transition-all"
            : "w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center transition-all";
    };

    const getIconClass = (path: string) => {
        const isActive = location.pathname === path;
        return isActive ? "w-5 h-5 text-black" : "w-5 h-5 text-gray-600";
    };

    const getTextClass = (path: string) => {
        const isActive = location.pathname === path;
        return isActive ? "text-xs text-black font-medium" : "text-xs text-gray-600";
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-50">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center gap-1 relative"
                    >
                        <div className={getButtonClass(item.path)}>
                            <item.icon className={getIconClass(item.path)} />
                        </div>

                        <span className={getTextClass(item.path)}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
