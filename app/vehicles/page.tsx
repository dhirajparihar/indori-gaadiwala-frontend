'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { vehiclesApi } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/ui/VehicleCard';
import { FaFilter, FaTimes } from 'react-icons/fa';

import { Suspense } from 'react';

function VehiclesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Initial state from URL
    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        fuelType: searchParams.get('fuelType') || '',
        transmission: searchParams.get('transmission') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });

    // Sync with URL changes (Source of Truth)
    useEffect(() => {
        const currentFilters = {
            type: searchParams.get('type') || '',
            fuelType: searchParams.get('fuelType') || '',
            transmission: searchParams.get('transmission') || '',
            maxPrice: searchParams.get('maxPrice') || '',
        };
        setFilters(currentFilters);
        loadVehicles(currentFilters);
    }, [searchParams]);

    const loadVehicles = async (currentFilters: { type: string; fuelType: string; transmission: string; maxPrice: string }) => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (currentFilters.type) params.type = currentFilters.type;
            if (currentFilters.fuelType) params.fuelType = currentFilters.fuelType;
            if (currentFilters.transmission) params.transmission = currentFilters.transmission;
            if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;

            const response = await vehiclesApi.getAll(params);
            setVehicles(response.data.data || []);
        } catch (error) {
            console.error('Error loading vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.type) params.set('type', filters.type);
        if (filters.fuelType) params.set('fuelType', filters.fuelType);
        if (filters.transmission) params.set('transmission', filters.transmission);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

        router.push(`/vehicles?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({ type: '', fuelType: '', transmission: '', maxPrice: '' });
        router.push('/vehicles');
    };

    const pageTitle = filters.type === 'car' ? 'Cars' : filters.type === 'bike' ? 'Bikes' : filters.type === 'commercial' ? 'Commercial Vehicles' : 'All Vehicles';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Browse <span className="text-primary-600">{pageTitle}</span>
                    </h1>
                    <p className="text-gray-600">Find your perfect ride from our extensive collection</p>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="car">Cars</option>
                                    <option value="bike">Bikes</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fuel</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={filters.fuelType}
                                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                                >
                                    <option value="">All Fuel</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="CNG">CNG</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transmission</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={filters.transmission}
                                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Semi-Automatic">Semi-Automatic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                >
                                    <option value="">Any Price</option>
                                    <option value="200000">Under ₹2 Lakh</option>
                                    <option value="500000">Under ₹5 Lakh</option>
                                    <option value="1000000">Under ₹10 Lakh</option>
                                    <option value="2000000">Under ₹20 Lakh</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto">
                            <button onClick={applyFilters} className="flex-1 lg:flex-none btn-primary py-2 px-4 text-sm h-[38px] flex items-center justify-center gap-2">
                                <FaFilter className="text-xs" />
                                <span>Apply</span>
                            </button>
                            <button onClick={clearFilters} className="flex-1 lg:flex-none py-2 px-4 text-sm h-[38px] flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 rounded-lg transition-all">
                                <FaTimes className="text-xs" />
                                <span>Clear</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        {loading ? 'Loading...' : `Found ${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                {/* Vehicles Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle._id} vehicle={vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Vehicles Found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                        <button onClick={clearFilters} className="btn-primary">
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VehiclesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        }>
            <VehiclesContent />
        </Suspense>
    );
}
