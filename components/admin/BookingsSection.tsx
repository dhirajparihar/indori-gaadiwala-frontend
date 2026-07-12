'use client';

import { useState } from 'react';
import { FaClipboardList, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookingsApi } from '@/lib/api';
import { Booking } from '@/lib/types';
import CollapsibleSection from './CollapsibleSection';
import { StatusFilter, SortSelect, ExportButton } from './FilterComponents';

interface BookingsSectionProps {
    bookings: Booking[];
    onRefresh: () => void;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'customer', label: 'Customer A-Z' },
];

const exportColumns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'customerPhone', label: 'Phone' },
    { key: 'offeredPrice', label: 'Offer' },
    { key: 'vehicleTitle', label: 'Vehicle' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Date' },
];

export default function BookingsSection({ bookings, onRefresh }: BookingsSectionProps) {
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNotes, setEditNotes] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Prepare export data with vehicle title
    const preparedBookings = bookings.map(b => ({
        ...b,
        vehicleTitle: typeof b.vehicle === 'object' ? b.vehicle?.title : 'N/A'
    }));

    // Filter and sort
    let filteredBookings = [...preparedBookings];

    if (statusFilter) {
        filteredBookings = filteredBookings.filter(b => b.status === statusFilter);
    }

    filteredBookings.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'customer') return a.customerName.localeCompare(b.customerName);
        return 0;
    });

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await bookingsApi.update(id, { status });
            onRefresh();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSaveNotes = async (id: string) => {
        try {
            await bookingsApi.update(id, { notes: editNotes });
            setEditingId(null);
            onRefresh();
            toast.success('Notes saved');
        } catch (error) {
            toast.error('Failed to save notes');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await bookingsApi.delete(id);
            setDeleteConfirmId(null);
            onRefresh();
            toast.success('Booking deleted');
        } catch (error) {
            toast.error('Failed to delete booking');
        }
    };

    return (
        <div id="bookings">
            <CollapsibleSection
                title="Bookings"
                count={filteredBookings.length}
                icon={<FaClipboardList />}
                iconColor="text-green-600"
            >
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <StatusFilter
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                    />
                    <SortSelect
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                    />
                    <div className="flex-1" />
                    <ExportButton
                        data={filteredBookings}
                        filename="bookings"
                        columns={exportColumns}
                    />
                </div>

                {/* Table for larger screens */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 font-medium text-gray-900">
                                            {booking.customerName}
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{booking.customerPhone}</td>
                                        <td className="px-4 py-4 font-semibold text-primary-600">
                                            {booking.offeredPrice ? `₹${booking.offeredPrice.toLocaleString('en-IN')}` : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-gray-900">{booking.vehicleTitle}</td>
                                        <td className="px-4 py-4 text-gray-600 text-sm">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-lg border font-medium ${booking.status === 'pending' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                                    booking.status === 'contacted' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                                                        booking.status === 'completed' ? 'border-green-300 bg-green-50 text-green-700' :
                                                            'border-red-300 bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 max-w-xs">
                                            {editingId === booking._id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                                                        placeholder="Add notes..."
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveNotes(booking._id)} className="text-green-600 hover:text-green-700">
                                                        <FaSave />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600 truncate">{booking.notes || '-'}</span>
                                                    <button
                                                        onClick={() => { setEditingId(booking._id); setEditNotes(booking.notes || ''); }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {deleteConfirmId === booking._id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(booking._id)}
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
                                                    onClick={() => setDeleteConfirmId(booking._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        {statusFilter ? 'No bookings match your filter' : 'No bookings yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Card Stack for mobile screens */}
                <div className="block md:hidden space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{booking.customerName}</h4>
                                        <a href={`tel:${booking.customerPhone}`} className="text-sm text-blue-600 hover:underline">{booking.customerPhone}</a>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-base text-primary-600">
                                            {booking.offeredPrice ? `₹${booking.offeredPrice.toLocaleString('en-IN')}` : '-'}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-2 space-y-2">
                                    <div>
                                        <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Vehicle</span>
                                        <span className="text-sm text-gray-900 font-medium">{booking.vehicleTitle}</span>
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Status</span>
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-lg border font-medium w-full mt-1 ${booking.status === 'pending' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                                    booking.status === 'contacted' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                                                        booking.status === 'completed' ? 'border-green-300 bg-green-50 text-green-700' :
                                                            'border-red-300 bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Notes</span>
                                            {editingId === booking._id ? (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="text"
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-1.5 py-1 flex-1 w-full"
                                                        placeholder="Notes..."
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveNotes(booking._id)} className="text-green-600 hover:text-green-700 p-1">
                                                        <FaSave />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-1 mt-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                    <span className="text-xs text-gray-600 truncate max-w-[100px]">{booking.notes || '-'}</span>
                                                    <button
                                                        onClick={() => { setEditingId(booking._id); setEditNotes(booking.notes || ''); }}
                                                        className="text-gray-400 hover:text-gray-650"
                                                    >
                                                        <FaEdit className="text-[10px]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-2 flex justify-end">
                                    {deleteConfirmId === booking._id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-red-500 font-medium">Delete?</span>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="px-2.5 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(null)}
                                                className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirmId(booking._id)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50"
                                        >
                                            <FaTrash /> Remove Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-xl">
                            {statusFilter ? 'No bookings match your filter' : 'No bookings yet'}
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
}
