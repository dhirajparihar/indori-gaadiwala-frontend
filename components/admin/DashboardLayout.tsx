'use client';

import { useState } from 'react';
import {
    FaSignOutAlt,
    FaPlus,
    FaCar,
    FaClipboardList,
    FaUsers,
    FaTag,
    FaTimes,
    FaBars,
    FaTachometerAlt,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

interface DashboardLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
    onAddVehicle?: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
    stats?: {
        totalVehicles: number;
        totalBookings: number;
        pendingBookings: number;
        availableVehicles: number;
        totalLeads: number;
        totalInquiries: number;
        totalTestimonials: number;
    };
}

export default function DashboardLayout({
    children,
    onLogout,
    onAddVehicle,
    activeTab,
    onTabChange,
    stats,
}: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { id: 'overview', name: 'Overview', icon: <FaTachometerAlt /> },
        { id: 'vehicles', name: 'Vehicles', icon: <FaCar />, count: stats?.availableVehicles, countColor: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/25', countTitle: 'Available' },
        { id: 'bookings', name: 'Bookings', icon: <FaClipboardList />, count: stats?.pendingBookings, countColor: 'bg-red-600 text-white animate-pulse', countTitle: 'Pending' },
        { id: 'leads', name: 'Leads', icon: <FaUsers />, count: stats?.totalLeads, countColor: 'bg-[#D4A63F]/20 text-[#D4A63F] border border-[#D4A63F]/25' },
        { id: 'seller-inquiries', name: 'Inquiries', icon: <FaTag />, count: stats?.totalInquiries, countColor: 'bg-[#D4A63F]/20 text-[#D4A63F] border border-[#D4A63F]/25' },
        { id: 'happy-customers', name: 'Testimonials', icon: <FaUsers className="text-yellow-500" />, count: stats?.totalTestimonials, countColor: 'bg-gray-700 text-gray-300 border border-gray-600' },
    ];

    const handleTabClick = (tabId: string) => {
        onTabChange(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            
            {/* Sidebar for Desktop */}
            <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-[#111827] text-gray-300 z-30 shadow-xl border-r border-gray-800 transition-all duration-300 overflow-visible ${isCollapsed ? 'md:w-[70px]' : 'md:w-64'}`}>
                {/* Brand Header */}
                <div className="flex items-center h-20 px-4 bg-[#0B0F19] border-b border-gray-800 gap-3">
                    <div className="w-9 h-9 flex-shrink-0 bg-[#D4A63F] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4A63F]/20">
                        <span className="text-[#111111] font-black text-lg">G</span>
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-black text-white leading-tight font-display truncate">Gaadiwala</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-sans">Admin Console</p>
                        </div>
                    )}
                </div>

                {/* Floating Collapse Tab — sticks out from the right edge */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-8 h-14 bg-[#111827] border border-gray-700 rounded-r-xl flex items-center justify-center text-gray-400 hover:text-[#D4A63F] hover:border-[#D4A63F]/40 shadow-lg transition-all duration-200 cursor-pointer"
                >
                    {isCollapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
                </button>

                {/* Main Navigation Links */}
                <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4'}`}>
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                title={isCollapsed ? item.name : undefined}
                                className={`relative w-full flex items-center py-3 rounded-xl transition-all duration-200 text-sm font-semibold font-sans text-left ${
                                    isCollapsed ? 'justify-center px-2' : 'gap-3'
                                } ${
                                    isActive
                                        ? 'bg-gray-800 text-[#D4A63F] border-l-4 border-[#D4A63F] font-extrabold shadow-sm pl-3.5'
                                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200 pl-4'
                                }`}
                            >
                                <span className={`flex-shrink-0 text-base ${isActive ? 'text-[#D4A63F]' : 'text-gray-500'}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1">{item.name}</span>
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.countColor}`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </>
                                )}
                                {isCollapsed && item.count !== undefined && item.count > 0 && (
                                    <span className={`absolute -top-1 -right-1 w-4 h-4 text-[8px] font-extrabold rounded-full flex items-center justify-center ${item.countColor}`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Add Vehicle Quick Action inside Sidebar */}
                {onAddVehicle && (
                    <div className={`border-t border-gray-800 bg-[#0B0F19]/40 ${isCollapsed ? 'p-2' : 'px-4 py-4'}`}>
                        <button
                            onClick={onAddVehicle}
                            className={`w-full flex items-center justify-center py-3 bg-[#D4A63F] text-[#111111] rounded-xl hover:bg-[#C6942C] transition-colors font-extrabold shadow-md shadow-[#D4A63F]/10 cursor-pointer ${isCollapsed ? 'px-2' : 'space-x-2 text-sm px-2'}`}
                            title="Add Vehicle"
                        >
                            <FaPlus size={12} />
                            {!isCollapsed && <span>Add New Vehicle</span>}
                        </button>
                    </div>
                )}

                {/* Admin Profile Details / Log Out */}
                <div className={`border-t border-gray-800 bg-[#0B0F19] flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between p-4'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center text-white font-black text-sm">
                                A
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-xs font-bold text-white">Admin</p>
                                <p className="text-[10px] text-gray-500 font-sans">admin@gaadiwala.com</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800/80 transition-colors"
                        title="Logout"
                    >
                        <FaSignOutAlt size={16} />
                    </button>
                </div>
            </aside>

            {/* Top Bar for Mobile */}
            <header className="md:hidden flex items-center justify-between h-16 bg-[#111827] text-white px-4 sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none"
                    >
                        <FaBars size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#D4A63F] rounded-lg flex items-center justify-center">
                            <span className="text-[#111111] font-bold text-sm">G</span>
                        </div>
                        <span className="font-black text-sm font-display tracking-tight">Gaadiwala Admin</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onAddVehicle && (
                        <button
                            onClick={onAddVehicle}
                            className="p-2 bg-[#D4A63F] hover:bg-[#C6942C] text-black rounded-lg transition-colors shadow cursor-pointer"
                            title="Add Vehicle"
                        >
                            <FaPlus size={12} />
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <FaSignOutAlt size={14} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Drawer (Slide-out Sheet) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#111827] text-gray-300 z-50 shadow-2xl animate-slideRight">
                        {/* Close button inside Drawer */}
                        <div className="absolute top-0 right-0 -mr-12 pt-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-black/40 text-white"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Drawer Brand */}
                        <div className="flex items-center h-20 px-6 bg-[#0B0F19] gap-3">
                            <div className="w-9 h-9 bg-[#D4A63F] rounded-xl flex items-center justify-center">
                                <span className="text-[#111111] font-black text-base">G</span>
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white leading-tight font-display">Gaadiwala</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-sans">Admin Console</p>
                            </div>
                        </div>

                        {/* Navigation Links inside Drawer */}
                        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabClick(item.id)}
                                        className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 text-sm font-semibold font-sans gap-3 text-left ${
                                            isActive
                                                ? 'bg-gray-850 text-[#D4A63F] border-l-4 border-[#D4A63F] font-extrabold shadow-sm pl-3.5'
                                                : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200 pl-4'
                                        }`}
                                    >
                                        <span className={isActive ? 'text-[#D4A63F]' : 'text-gray-500'}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-1">{item.name}</span>
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${item.countColor}`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Admin info in Drawer footer */}
                        <div className="p-4 border-t border-gray-800 bg-[#0B0F19] flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white font-black text-xs">
                                A
                            </div>
                            <div className="text-left leading-none">
                                <p className="text-xs font-bold text-white">Admin</p>
                                <p className="text-[10px] text-gray-500 font-sans">admin@gaadiwala.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'md:pl-[70px]' : 'md:pl-64'}`}>
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
