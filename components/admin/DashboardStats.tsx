import { FaCar, FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';

interface DashboardStatsProps {
    stats: {
        totalVehicles: number;
        totalBookings: number;
        availableVehicles: number;
        pendingBookings: number;
    };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const statCards = [
        {
            title: 'Total Vehicles',
            value: stats.totalVehicles,
            icon: <FaCar />,
            bgColor: 'bg-[#D4A63F]/10 border-[#D4A63F]/20',
            iconColor: 'bg-[#D4A63F] text-[#111111]'
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: <FaClipboardList />,
            bgColor: 'bg-gray-50 border-gray-200',
            iconColor: 'bg-gray-800 text-white'
        },
        {
            title: 'Available Vehicles',
            value: stats.availableVehicles,
            icon: <FaCheckCircle />,
            bgColor: 'bg-emerald-50/50 border-emerald-100',
            iconColor: 'bg-emerald-600 text-white'
        },
        {
            title: 'Pending Bookings',
            value: stats.pendingBookings,
            icon: <FaClock />,
            bgColor: 'bg-rose-50/50 border-rose-100',
            iconColor: 'bg-rose-600 text-white'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} rounded-xl p-5 border shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                        </div>
                        <div className={`${stat.iconColor} p-2.5 rounded-lg text-white`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
