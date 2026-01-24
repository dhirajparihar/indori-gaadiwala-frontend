'use client';

import { useState } from 'react';
import { FaTag, FaImage, FaChevronDown, FaTrash, FaEdit, FaSave, FaTimes, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';
import { sellerInquiriesApi } from '@/lib/api';
import { toast } from 'react-toastify';
import CollapsibleSection from './CollapsibleSection';
import { StatusFilter, SortSelect, ExportButton } from './FilterComponents';

import { SellerInquiry } from '@/lib/types';

interface SellerInquiriesSectionProps {
    inquiries: SellerInquiry[];
    onRefresh: () => void;
}

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_high', label: 'Price High-Low' },
    { value: 'price_low', label: 'Price Low-High' },
];

const exportColumns = [
    { key: 'name', label: 'Seller Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'regNo', label: 'Reg No' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'kmDriven', label: 'KM Driven' },
    { key: 'demand', label: 'Demand (₹)' },
    { key: 'fuelType', label: 'Fuel' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Date' },
];

export default function SellerInquiriesSection({ inquiries, onRefresh }: SellerInquiriesSectionProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
    const [editNotes, setEditNotes] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Filter and sort
    let filteredInquiries = [...inquiries];

    if (statusFilter) {
        filteredInquiries = filteredInquiries.filter(i => i.status === statusFilter);
    }

    filteredInquiries.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'price_high') return (b.demand || 0) - (a.demand || 0);
        if (sortBy === 'price_low') return (a.demand || 0) - (b.demand || 0);
        return 0;
    });

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedIds(newSet);
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await sellerInquiriesApi.update(id, { status });
            onRefresh();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSaveNotes = async (id: string) => {
        try {
            await sellerInquiriesApi.update(id, { notes: editNotes });
            setEditingNotesId(null);
            onRefresh();
            toast.success('Notes saved');
        } catch (error) {
            toast.error('Failed to save notes');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await sellerInquiriesApi.delete(id);
            setDeleteConfirmId(null);
            onRefresh();
            toast.success('Inquiry deleted');
        } catch (error) {
            toast.error('Failed to delete inquiry');
        }
    };

    return (
        <div id="seller-inquiries">
            <CollapsibleSection
                title="Seller Inquiries"
                count={filteredInquiries.length}
                icon={<FaTag />}
                iconColor="text-red-600"
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
                        data={filteredInquiries}
                        filename="seller_inquiries"
                        columns={exportColumns}
                    />
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inquiry) => (
                            <div key={inquiry._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-white p-4 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">
                                                {inquiry.make} {inquiry.model} {inquiry.variant && `- ${inquiry.variant}`}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium flex items-center gap-1">
                                                    {inquiry.type === 'car' ? <FaCar /> : inquiry.type === 'bike' ? <FaMotorcycle /> : <FaTruck />}
                                                    {inquiry.type}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">{inquiry.regNo}</span>
                                                {inquiry.year && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{inquiry.year}</span>}
                                                {inquiry.fuelType && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">{inquiry.fuelType}</span>}
                                                {inquiry.transmissionType && <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">{inquiry.transmissionType}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">{inquiry.kmDriven?.toLocaleString()} KM</div>
                                            <div className="font-bold text-xl text-green-600">₹{inquiry.demand?.toLocaleString()}</div>
                                        </div>
                                        <select
                                            value={inquiry.status}
                                            onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                                            className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${inquiry.status === 'new' ? 'border-green-300 bg-green-50 text-green-700' :
                                                inquiry.status === 'contacted' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                                    inquiry.status === 'completed' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                                                        'border-red-300 bg-red-50 text-red-700'
                                                }`}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {deleteConfirmId === inquiry._id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(inquiry._id)}
                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                >
                                                    Delete
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
                                                onClick={() => setDeleteConfirmId(inquiry._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleExpand(inquiry._id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${expandedIds.has(inquiry._id) ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                {expandedIds.has(inquiry._id) && (
                                    <div className="p-4 bg-gray-50/50">
                                        {/* Notes Row */}
                                        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500 uppercase font-medium">Notes</span>
                                                {editingNotesId !== inquiry._id && (
                                                    <button
                                                        onClick={() => { setEditingNotesId(inquiry._id); setEditNotes(inquiry.notes || ''); }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                )}
                                            </div>
                                            {editingNotesId === inquiry._id ? (
                                                <div className="flex items-center gap-2">
                                                    <textarea
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 resize-none"
                                                        rows={2}
                                                        placeholder="Add notes..."
                                                        autoFocus
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <button onClick={() => handleSaveNotes(inquiry._id)} className="p-2 text-green-600 hover:bg-green-50 rounded">
                                                            <FaSave />
                                                        </button>
                                                        <button onClick={() => setEditingNotesId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded">
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-700">{inquiry.notes || 'No notes added'}</p>
                                            )}
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                <div className="text-xs text-gray-500 uppercase font-medium mb-2">Seller</div>
                                                <div className="font-semibold text-gray-900">{inquiry.name}</div>
                                                <div className="text-gray-600">{inquiry.phone}</div>
                                                <div className="text-xs text-gray-400 mt-1">{new Date(inquiry.createdAt).toLocaleString()}</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                <div className="text-xs text-gray-500 uppercase font-medium mb-2">Registration</div>
                                                {inquiry.registeredPlace && <div className="text-gray-700">{inquiry.registeredPlace}</div>}
                                                {inquiry.rcStatus && <div className={`text-xs mt-1 ${inquiry.rcStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{inquiry.rcStatus}</div>}
                                                {inquiry.rcOwnerCount && <div className="text-gray-600 text-xs">{inquiry.rcOwnerCount} Owner(s)</div>}
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                <div className="text-xs text-gray-500 uppercase font-medium mb-2">Insurance & Fitness</div>
                                                {inquiry.insuranceUpTo && <div className="text-xs"><span className="text-gray-500">Ins:</span> <span className={new Date(inquiry.insuranceUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{inquiry.insuranceUpTo}</span></div>}
                                                {inquiry.fitnessUpTo && <div className="text-xs"><span className="text-gray-500">Fitness:</span> <span className={new Date(inquiry.fitnessUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{inquiry.fitnessUpTo}</span></div>}
                                                {inquiry.pucUpTo && <div className="text-xs"><span className="text-gray-500">PUC:</span> {inquiry.pucUpTo}</div>}
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                <div className="text-xs text-gray-500 uppercase font-medium mb-2">Other</div>
                                                {inquiry.color && <div className="text-xs"><span className="text-gray-500">Color:</span> {inquiry.color}</div>}
                                                {inquiry.seatCap && <div className="text-xs"><span className="text-gray-500">Seats:</span> {inquiry.seatCap}</div>}
                                                {inquiry.hypothecation && <div className="text-xs text-orange-600">Under Finance: {inquiry.financier || 'Yes'}</div>}
                                                <div className="flex gap-2 mt-2">
                                                    {inquiry.photo && (
                                                        <a href={inquiry.photo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100">
                                                            <FaImage className="mr-1" /> Photo
                                                        </a>
                                                    )}
                                                    {inquiry.rcCard && (
                                                        <a href={inquiry.rcCard} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100">
                                                            <FaImage className="mr-1" /> RC
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            {statusFilter ? 'No inquiries match your filter' : 'No seller inquiries yet'}
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
}
