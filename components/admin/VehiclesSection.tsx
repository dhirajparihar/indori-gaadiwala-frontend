'use client';

import { useState } from 'react';
import { FaCar, FaMotorcycle, FaEdit, FaTrash, FaSearch, FaChevronDown, FaTruck } from 'react-icons/fa';
import { Vehicle } from '@/lib/types';
import { StatusFilter, SortSelect, ExportButton } from './FilterComponents';

interface VehiclesSectionProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
}

const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
];

const typeOptions = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike' },
    { value: 'commercial', label: 'Commercial' },
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_high', label: 'Price High-Low' },
    { value: 'price_low', label: 'Price Low-High' },
    { value: 'title', label: 'Title A-Z' },
];

const exportColumns = [
    { key: 'title', label: 'Title' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'type', label: 'Type' },
    { key: 'price', label: 'Price (₹)' },
    { key: 'originalPrice', label: 'Original Price (₹)' },
    { key: 'kmDriven', label: 'KM Driven' },
    { key: 'fuelType', label: 'Fuel' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'status', label: 'Status' },
];

export default function VehiclesSection({ vehicles, onEdit, onDelete }: VehiclesSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort
    let filteredVehicles = vehicles.filter(vehicle =>
        vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter) {
        filteredVehicles = filteredVehicles.filter(v => v.status === statusFilter);
    }

    if (typeFilter) {
        filteredVehicles = filteredVehicles.filter(v => v.type === typeFilter);
    }

    filteredVehicles.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const handleDeleteClick = (id: string) => {
        if (deleteConfirmId === id) {
            onDelete(id);
            setDeleteConfirmId(null);
        } else {
            setDeleteConfirmId(id);
        }
    };

    return (
        <div id="vehicles" className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            <FaCar className="inline mr-2 text-purple-600" />
                            All Vehicles
                        </h2>
                        <span className="text-gray-500">({filteredVehicles.length})</span>
                    </div>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <StatusFilter
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                        />
                        <StatusFilter
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeOptions}
                            label="Type"
                        />
                        <SortSelect
                            value={sortBy}
                            onChange={setSortBy}
                            options={sortOptions}
                        />
                        <div className="flex-1" />
                        <ExportButton
                            data={filteredVehicles}
                            filename="vehicles"
                            columns={exportColumns}
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredVehicles.length > 0 ? (
                                    filteredVehicles.map((vehicle) => (
                                        <tr key={vehicle._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={vehicle.images?.[0] || '/placeholder-car.jpg'}
                                                        alt={vehicle.title}
                                                        className="w-16 h-16 rounded-lg object-cover mr-4"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{vehicle.title}</div>
                                                        <div className="text-xs text-gray-500">{vehicle.brand} {vehicle.model}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                                                    {vehicle.type === 'car' ? <FaCar /> : vehicle.type === 'bike' ? <FaMotorcycle /> : <FaTruck />}
                                                    <span className="capitalize">{vehicle.type}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{vehicle.year}</div>
                                                <div className="text-xs text-gray-500">{vehicle.kmDriven?.toLocaleString()} km • {vehicle.fuelType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-green-600">₹{vehicle.price.toLocaleString()}</div>
                                                {vehicle.originalPrice && (
                                                    <div className="text-xs text-gray-500 line-through">₹{vehicle.originalPrice.toLocaleString()}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => onEdit(vehicle)}
                                                        className="text-primary-600 hover:text-primary-800 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="text-xl" />
                                                    </button>
                                                    {deleteConfirmId === vehicle._id ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleDeleteClick(vehicle._id)}
                                                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(null)}
                                                                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirmId(vehicle._id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="text-xl" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery || statusFilter || typeFilter ? 'No vehicles match your filters' : 'No vehicles yet'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
