'use client';

import { useState } from 'react';
import {
    FaUserCircle,
    FaSignOutAlt,
    FaPlus,
    FaCar,
    FaClipboardList,
    FaUsers,
    FaTag,
    FaTimes,
} from 'react-icons/fa';

interface DashboardLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
    onAddVehicle?: () => void;
    stats?: {
        totalVehicles: number;
        totalBookings: number;
        pendingBookings: number;
        availableVehicles: number;
    };
}

export default function DashboardLayout({ children, onLogout, onAddVehicle, stats }: DashboardLayoutProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Header */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">G</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Gaadiwala Admin</h1>
                                    <p className="text-xs text-gray-500 hidden sm:block">Dashboard Management</p>
                                </div>
                            </div>
                        </div>

                        {/* Add Vehicle Action */}
                        <div className="flex items-center mr-2">
                            {onAddVehicle && (
                                <button
                                    onClick={onAddVehicle}
                                    className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <FaPlus />
                                    <span className="hidden md:inline">Add Vehicle</span>
                                </button>
                            )}
                        </div>

                        {/* Quick Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={() => scrollToSection('vehicles')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <FaCar className="text-sm" />
                                <span className="hidden lg:inline">Vehicles</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('bookings')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <FaClipboardList className="text-sm" />
                                <span className="hidden lg:inline">Bookings</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('leads')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <FaUsers className="text-sm" />
                                <span className="hidden lg:inline">Leads</span>
                            </button>
                            <button
                                onClick={() => scrollToSection('seller-inquiries')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <FaTag className="text-sm" />
                                <span className="hidden lg:inline">Inquiries</span>
                            </button>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                                        A
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Admin</p>
                                                    <p className="text-xs text-gray-500">admin@gaadiwala.com</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <FaTimes className="text-sm" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={onLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                            >
                                                <FaSignOutAlt className="text-red-500" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
