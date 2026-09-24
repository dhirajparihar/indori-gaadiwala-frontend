import { useState } from 'react';
import { FaCar, FaMotorcycle, FaEdit, FaTrash, FaSearch, FaChevronDown, FaTruck, FaArrowUp, FaArrowDown, FaGripVertical } from 'react-icons/fa';
import { Vehicle } from '@/lib/types';
import { StatusFilter, SortSelect, ExportButton } from './FilterComponents';
import { getOptimizedImageUrl, vehiclesApi } from '@/lib/api';
import { toast } from 'react-toastify';

interface VehiclesSectionProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
    onReorder?: (updatedVehicles: Vehicle[]) => void;
    onRefresh?: () => void;
}

const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'booked', label: 'Booked' },
];

const typeOptions = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike' },
    { value: 'commercial', label: 'Commercial' },
];

const sortOptions = [
    { value: 'custom', label: 'Custom Order' },
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

export default function VehiclesSection({ vehicles, onEdit, onDelete, onReorder, onRefresh }: VehiclesSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('custom');
    const [savingOrder, setSavingOrder] = useState(false);

    const handleStatusUpdate = async (id: string, newStatus: 'available' | 'sold' | 'booked') => {
        try {
            setUpdatingStatusId(id);
            await vehiclesApi.update(id, { status: newStatus });
            toast.success(`Vehicle status updated to ${newStatus}`);
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update vehicle status');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // Drag and Drop state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
        if (sortBy === 'custom') {
            const orderA = a.displayOrder ?? 999999;
            const orderB = b.displayOrder ?? 999999;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= filteredVehicles.length) return;

        // Swap positions in filtered array
        const reorderedFiltered = [...filteredVehicles];
        const temp = reorderedFiltered[index];
        reorderedFiltered[index] = reorderedFiltered[targetIndex];
        reorderedFiltered[targetIndex] = temp;

        // Assign displayOrder 0, 1, 2, ...
        const updatedItemsMap = new Map<string, number>();
        reorderedFiltered.forEach((v, idx) => {
            updatedItemsMap.set(v._id, idx);
        });

        const updatedVehicles = vehicles.map(v => {
            if (updatedItemsMap.has(v._id)) {
                return { ...v, displayOrder: updatedItemsMap.get(v._id) };
            }
            return v;
        });

        if (onReorder) {
            onReorder(updatedVehicles);
        }

        try {
            setSavingOrder(true);
            const payload = reorderedFiltered.map((v, idx) => ({
                id: v._id,
                displayOrder: idx
            }));
            await vehiclesApi.reorder(payload);
            toast.success('Vehicle order updated successfully!');
        } catch (error) {
            console.error('Failed to update vehicle order:', error);
            toast.error('Failed to save vehicle order');
        } finally {
            setSavingOrder(false);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement | HTMLDivElement>, index: number) => {
        if (sortBy !== 'custom' || savingOrder) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement | HTMLDivElement>, index: number) => {
        if (sortBy !== 'custom' || savingOrder) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }

        // Auto-scroll window when dragging near top or bottom edges of viewport
        const viewportHeight = window.innerHeight;
        const clientY = e.clientY;
        const topEdgeThreshold = 140;
        const bottomEdgeThreshold = viewportHeight - 140;

        if (clientY < topEdgeThreshold) {
            const intensity = Math.min(1, (topEdgeThreshold - clientY) / topEdgeThreshold);
            window.scrollBy(0, -Math.max(10, Math.round(intensity * 35)));
        } else if (clientY > bottomEdgeThreshold) {
            const intensity = Math.min(1, (clientY - bottomEdgeThreshold) / topEdgeThreshold);
            window.scrollBy(0, Math.max(10, Math.round(intensity * 35)));
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLTableRowElement | HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (sortBy !== 'custom' || savingOrder || draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const startIndex = draggedIndex;
        setDraggedIndex(null);
        setDragOverIndex(null);

        // Reorder array by placing dragged item at dropIndex
        const reorderedFiltered = [...filteredVehicles];
        const [movedItem] = reorderedFiltered.splice(startIndex, 1);
        reorderedFiltered.splice(dropIndex, 0, movedItem);

        // Map displayOrder 0, 1, 2...
        const updatedItemsMap = new Map<string, number>();
        reorderedFiltered.forEach((v, idx) => {
            updatedItemsMap.set(v._id, idx);
        });

        const updatedVehicles = vehicles.map(v => {
            if (updatedItemsMap.has(v._id)) {
                return { ...v, displayOrder: updatedItemsMap.get(v._id) };
            }
            return v;
        });

        if (onReorder) {
            onReorder(updatedVehicles);
        }

        try {
            setSavingOrder(true);
            const payload = reorderedFiltered.map((v, idx) => ({
                id: v._id,
                displayOrder: idx
            }));
            await vehiclesApi.reorder(payload);
            toast.success('Vehicle order updated successfully!');
        } catch (error) {
            console.error('Failed to update vehicle order:', error);
            toast.error('Failed to save vehicle order');
        } finally {
            setSavingOrder(false);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

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
                            <FaCar className="inline mr-2 text-[#D4A63F]" />
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
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 text-sm"
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

                    {/* Table for larger screens */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Order</th>
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
                                    filteredVehicles.map((vehicle, index) => (
                                        <tr
                                            key={vehicle._id}
                                            draggable={sortBy === 'custom' && !savingOrder}
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`hover:bg-gray-50 transition-colors ${
                                                draggedIndex === index ? 'opacity-30 bg-amber-50' : ''
                                            } ${
                                                dragOverIndex === index && draggedIndex !== index ? 'border-t-2 border-[#D4A63F] bg-amber-50/50' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center space-x-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                                                    <span
                                                        className={`p-1 text-gray-400 hover:text-gray-700 ${
                                                            sortBy === 'custom' && !savingOrder ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40'
                                                        }`}
                                                        title="Drag row to reorder"
                                                    >
                                                        <FaGripVertical className="text-xs" />
                                                    </span>
                                                    <button
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0 || savingOrder || sortBy !== 'custom'}
                                                        className="p-1 text-gray-600 hover:text-primary-600 hover:bg-gray-200 rounded disabled:opacity-25 disabled:hover:bg-transparent transition-all"
                                                        title={sortBy !== 'custom' ? 'Switch sort to Custom Order to reorder' : 'Move Up'}
                                                    >
                                                        <FaArrowUp className="text-xs" />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-700 w-5 text-center">
                                                        {index + 1}
                                                    </span>
                                                    <button
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === filteredVehicles.length - 1 || savingOrder || sortBy !== 'custom'}
                                                        className="p-1 text-gray-600 hover:text-primary-600 hover:bg-gray-200 rounded disabled:opacity-25 disabled:hover:bg-transparent transition-all"
                                                        title={sortBy !== 'custom' ? 'Switch sort to Custom Order to reorder' : 'Move Down'}
                                                    >
                                                        <FaArrowDown className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="relative mr-4 flex-shrink-0">
                                                        <img
                                                            src={getOptimizedImageUrl(vehicle.images?.[0], 100, 100)}
                                                            alt={vehicle.title}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                        />
                                                        {vehicle.status === 'sold' && (
                                                            <div className="absolute inset-0 flex items-center justify-center p-1 pointer-events-none">
                                                                <img src="/Sold_out.png" alt="Sold Out" className="w-full h-auto object-contain max-h-12 select-none drop-shadow" />
                                                            </div>
                                                        )}
                                                        {vehicle.status === 'booked' && (
                                                            <div className="absolute bottom-0 right-0 p-0.5 pointer-events-none">
                                                                <img src="/Booked_icon.png" alt="Booked" className="w-8 h-auto object-contain select-none drop-shadow-sm" />
                                                            </div>
                                                        )}
                                                    </div>
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
                                                <select
                                                    value={vehicle.status || 'available'}
                                                    onChange={(e) => handleStatusUpdate(vehicle._id, e.target.value as 'available' | 'sold' | 'booked')}
                                                    disabled={updatingStatusId === vehicle._id}
                                                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold cursor-pointer outline-none transition-colors capitalize ${
                                                        vehicle.status === 'available' ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100' :
                                                        vehicle.status === 'booked' ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' :
                                                        'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                                                    } ${updatingStatusId === vehicle._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value} className="bg-white text-gray-800 font-medium">
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
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
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery || statusFilter || typeFilter ? 'No vehicles match your filters' : 'No vehicles yet'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Card Stack for mobile screens */}
                    <div className="block md:hidden space-y-4 p-4">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle, index) => (
                                <div
                                    key={vehicle._id}
                                    draggable={sortBy === 'custom' && !savingOrder}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`bg-white border rounded-xl p-4 shadow-sm space-y-3 transition-colors ${
                                        draggedIndex === index ? 'opacity-30 bg-amber-50 border-amber-300' : 'border-gray-200'
                                    } ${
                                        dragOverIndex === index && draggedIndex !== index ? 'border-2 border-[#D4A63F] bg-amber-50/50' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={getOptimizedImageUrl(vehicle.images?.[0], 100, 100)}
                                                alt={vehicle.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            {vehicle.status === 'sold' && (
                                                <div className="absolute inset-0 flex items-center justify-center p-1 pointer-events-none">
                                                    <img src="/Sold_out.png" alt="Sold Out" className="w-full h-auto object-contain max-h-12 select-none drop-shadow" />
                                                </div>
                                            )}
                                            {vehicle.status === 'booked' && (
                                                <div className="absolute bottom-0 right-0 p-0.5 pointer-events-none">
                                                    <img src="/Booked_icon.png" alt="Booked" className="w-8 h-auto object-contain select-none drop-shadow-sm" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900 truncate text-sm">{vehicle.title}</h4>
                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-xs ml-2">
                                                    <span
                                                        className={`text-gray-400 hover:text-gray-700 ${
                                                            sortBy === 'custom' && !savingOrder ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40'
                                                        }`}
                                                        title="Drag card to reorder"
                                                    >
                                                        <FaGripVertical className="text-[10px]" />
                                                    </span>
                                                    <span className="font-bold text-gray-600 text-[10px]">#{index + 1}</span>
                                                    <button
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0 || savingOrder || sortBy !== 'custom'}
                                                        className="p-0.5 text-gray-600 hover:text-primary-600 disabled:opacity-25"
                                                        title="Move Up"
                                                    >
                                                        <FaArrowUp className="text-[10px]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === filteredVehicles.length - 1 || savingOrder || sortBy !== 'custom'}
                                                        className="p-0.5 text-gray-600 hover:text-primary-600 disabled:opacity-25"
                                                        title="Move Down"
                                                    >
                                                        <FaArrowDown className="text-[10px]" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{vehicle.brand} {vehicle.model}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                                                    {vehicle.type === 'car' ? <FaCar /> : vehicle.type === 'bike' ? <FaMotorcycle /> : <FaTruck />}
                                                    <span className="capitalize">{vehicle.type}</span>
                                                </span>
                                                <select
                                                    value={vehicle.status || 'available'}
                                                    onChange={(e) => handleStatusUpdate(vehicle._id, e.target.value as 'available' | 'sold' | 'booked')}
                                                    disabled={updatingStatusId === vehicle._id}
                                                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border cursor-pointer outline-none transition-colors capitalize ${
                                                        vehicle.status === 'available' ? 'border-green-300 bg-green-50 text-green-700' :
                                                        vehicle.status === 'booked' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                                                        'border-red-300 bg-red-50 text-red-700'
                                                    } ${updatingStatusId === vehicle._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value} className="bg-white text-gray-800 font-medium">
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-100 pt-2 flex justify-between items-end gap-2">
                                        <div>
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Specs</span>
                                            <span className="text-xs text-gray-800">
                                                {vehicle.year} • {vehicle.kmDriven?.toLocaleString()} km • {vehicle.fuelType}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-green-600">₹{vehicle.price.toLocaleString()}</div>
                                            {vehicle.originalPrice && (
                                                <div className="text-xs text-gray-400 line-through">₹{vehicle.originalPrice.toLocaleString()}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center gap-2">
                                        <button
                                            onClick={() => onEdit(vehicle)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 rounded-lg text-xs font-semibold"
                                            title="Edit"
                                        >
                                            <FaEdit /> Edit
                                        </button>

                                        {deleteConfirmId === vehicle._id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-red-500 font-medium">Delete?</span>
                                                <button
                                                    onClick={() => handleDeleteClick(vehicle._id)}
                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmId(vehicle._id)}
                                                className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg border border-red-200 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-xl">
                                {searchQuery || statusFilter || typeFilter ? 'No vehicles match your filters' : 'No vehicles yet'}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
