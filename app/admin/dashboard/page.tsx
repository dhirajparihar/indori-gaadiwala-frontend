'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vehiclesApi, bookingsApi, leadsApi, sellerInquiriesApi } from '@/lib/api';
import { Vehicle, Booking } from '@/lib/types';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Components
import DashboardLayout from '@/components/admin/DashboardLayout';
import AddVehicleModal from '@/components/admin/AddVehicleModal';
import DashboardStats from '@/components/admin/DashboardStats';
import VehicleLookup from '@/components/admin/VehicleLookup';
import BookingsSection from '@/components/admin/BookingsSection';
import LeadsSection from '@/components/admin/LeadsSection';
import SellerInquiriesSection from '@/components/admin/SellerInquiriesSection';
import VehiclesSection from '@/components/admin/VehiclesSection';
import EditVehicleModal from '@/components/admin/EditVehicleModal';

export default function AdminDashboardPage() {
    const router = useRouter();

    // State
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalBookings: 0,
        availableVehicles: 0,
        pendingBookings: 0
    });
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [sellerInquiries, setSellerInquiries] = useState<any[]>([]);

    // Modals
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        loadDashboardData();
    }, []);

    // Load all data
    const loadDashboardData = async () => {
        try {
            const [vehiclesRes, bookingsRes, leadsRes, inquiriesRes] = await Promise.all([
                vehiclesApi.getAll(),
                bookingsApi.getAll(),
                leadsApi.getAll(),
                sellerInquiriesApi.getAll()
            ]);

            const vehiclesData = vehiclesRes.data.data || [];
            const bookingsData = bookingsRes.data.data || [];
            const leadsData = leadsRes.data.data || [];
            const inquiriesData = inquiriesRes.data.data || [];

            setVehicles(vehiclesData);
            setBookings(bookingsData);
            setLeads(leadsData);
            setSellerInquiries(inquiriesData);

            setStats({
                totalVehicles: vehiclesData.length,
                totalBookings: bookingsData.length,
                availableVehicles: vehiclesData.filter((v: Vehicle) => v.status === 'available').length,
                pendingBookings: bookingsData.filter((b: Booking) => b.status === 'pending').length
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const handleDeleteVehicle = async (id: string) => {
        try {
            await vehiclesApi.delete(id);
            loadDashboardData();
            toast.success('Vehicle deleted successfully');
        } catch (error) {
            toast.error('Failed to delete vehicle');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout onLogout={handleLogout} stats={stats} onAddVehicle={() => setShowAddVehicleModal(true)}>
            {/* Stats */}
            <div id="stats">
                <DashboardStats stats={stats} />
            </div>



            {/* Vehicle Lookup */}
            <VehicleLookup />

            {/* Bookings */}
            <BookingsSection
                bookings={bookings}
                onRefresh={loadDashboardData}
            />

            {/* Leads */}
            <LeadsSection
                leads={leads}
                onRefresh={loadDashboardData}
            />

            {/* Seller Inquiries */}
            <SellerInquiriesSection
                inquiries={sellerInquiries}
                onRefresh={loadDashboardData}
            />

            {/* Vehicles */}
            <VehiclesSection
                vehicles={vehicles}
                onEdit={setEditingVehicle}
                onDelete={handleDeleteVehicle}
            />

            {/* Modals */}
            <AddVehicleModal
                isOpen={showAddVehicleModal}
                onClose={() => setShowAddVehicleModal(false)}
                onSuccess={loadDashboardData}
            />

            <EditVehicleModal
                vehicle={editingVehicle}
                onClose={() => setEditingVehicle(null)}
                onSuccess={loadDashboardData}
            />
        </DashboardLayout>
    );
}
