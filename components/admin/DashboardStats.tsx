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
            bgColor: 'bg-blue-50',
            iconColor: 'bg-blue-500'
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: <FaClipboardList />,
            bgColor: 'bg-green-50',
            iconColor: 'bg-green-500'
        },
        {
            title: 'Available',
            value: stats.availableVehicles,
            icon: <FaCheckCircle />,
            bgColor: 'bg-purple-50',
            iconColor: 'bg-purple-500'
        },
        {
            title: 'Pending',
            value: stats.pendingBookings,
            icon: <FaClock />,
            bgColor: 'bg-yellow-50',
            iconColor: 'bg-yellow-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div key={index} className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}>
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
