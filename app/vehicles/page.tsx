'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { vehiclesApi } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/ui/VehicleCard';
import { FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Suspense } from 'react';

function VehiclesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
            const params: Record<string, string> = {
                fields: 'title,price,originalPrice,discount,images,year,fuelType,transmission,mileage,type,status'
            };
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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10">
                    <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">Showroom</span>
                    <h1 className="text-3xl md:text-5xl font-black text-[#111111] mb-3 font-display tracking-tight">
                        Browse <span className="text-[#D4A63F]">{pageTitle}</span>
                    </h1>
                    <p className="text-gray-500 font-medium font-sans">Find your perfect pre-owned ride from our premium Indore collection</p>
                </div>

                {/* Filters */}
                <div className="bg-[#FAFAF8] rounded-[24px] border border-[#E5E7EB] p-4 sm:p-6 lg:p-8 mb-10 shadow-sm">
                    {/* Mobile Filter Toggle */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E5E7EB] rounded-full font-semibold text-sm"
                        >
                            <span className="flex items-center gap-2">
                                <FaFilter className="text-[#D4A63F]" />
                                Filters
                            </span>
                            <FaChevronDown className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className={`flex flex-col lg:flex-row gap-4 lg:gap-5 items-end ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest font-sans">Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white border border-[#E5E7EB] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-all font-sans appearance-none text-neutral-900"
                                        value={filters.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="car">Cars</option>
                                        <option value="bike">Bikes</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                    <FaChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest font-sans">Fuel</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white border border-[#E5E7EB] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-all font-sans appearance-none text-neutral-900"
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
                                    <FaChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest font-sans">Transmission</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white border border-[#E5E7EB] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-all font-sans appearance-none text-neutral-900"
                                        value={filters.transmission}
                                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Semi-Automatic">Semi-Automatic</option>
                                    </select>
                                    <FaChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest font-sans">Budget</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white border border-[#E5E7EB] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-all font-sans appearance-none text-neutral-900"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    >
                                        <option value="">Any Price</option>
                                        <option value="200000">Under ₹2 Lakh</option>
                                        <option value="500000">Under ₹5 Lakh</option>
                                        <option value="1000000">Under ₹10 Lakh</option>
                                        <option value="2000000">Under ₹20 Lakh</option>
                                    </select>
                                    <FaChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto">
                            <button 
                                onClick={() => {
                                    applyFilters();
                                    setMobileFiltersOpen(false);
                                }} 
                                className="flex-1 lg:flex-none btn-primary py-2.5 sm:py-3 px-4 sm:px-7 text-xs sm:text-sm"
                            >
                                <FaFilter className="text-xs text-[#D4A63F]" />
                                <span>Apply</span>
                            </button>
                            <button 
                                onClick={() => {
                                    clearFilters();
                                    setMobileFiltersOpen(false);
                                }} 
                                className="flex-1 lg:flex-none btn-secondary py-2.5 sm:py-3 px-4 sm:px-7 text-xs sm:text-sm"
                            >
                                <FaTimes className="text-xs" />
                                <span>Clear</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-500 font-medium text-sm font-sans">
                        {loading ? 'Searching vehicles...' : `Showing ${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} in Indore`}
                    </p>
                </div>

                {/* Vehicles Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A63F]"></div>
                    </div>
                ) : vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle._id} vehicle={vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#FAFAF8] rounded-[24px] border border-[#E5E7EB] shadow-sm max-w-2xl mx-auto">
                        <div className="text-5xl mb-6">🔍</div>
                        <h3 className="text-2xl font-bold text-[#111111] mb-2 font-display">No Vehicles Found</h3>
                        <p className="text-gray-500 mb-8 font-medium text-sm font-sans max-w-sm mx-auto">We couldn't find matches. Try broadening your filters to view other premium models.</p>
                        <button onClick={clearFilters} className="btn-primary py-3.5 px-8">
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
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A63F]"></div>
            </div>
        }>
            <VehiclesContent />
        </Suspense>
    );
}
