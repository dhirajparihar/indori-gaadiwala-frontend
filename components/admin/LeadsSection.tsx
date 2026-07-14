'use client';

import { useState } from 'react';
import { FaUsers, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { leadsApi } from '@/lib/api';
import CollapsibleSection from './CollapsibleSection';
import { StatusFilter, SortSelect, ExportButton } from './FilterComponents';

interface Lead {
    _id: string;
    name: string;
    phone: string;
    source?: string;
    status?: string;
    notes?: string;
    createdAt: string;
}

interface LeadsSectionProps {
    leads: Lead[];
    onRefresh: () => void;
}

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'converted', label: 'Converted' },
    { value: 'closed', label: 'Closed' },
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
];

const exportColumns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Date' },
];

export default function LeadsSection({ leads, onRefresh }: LeadsSectionProps) {
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNotes, setEditNotes] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Filter and sort leads
    let filteredLeads = [...leads];

    if (statusFilter) {
        filteredLeads = filteredLeads.filter(l => l.status === statusFilter);
    }

    filteredLeads.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await leadsApi.update(id, { status });
            onRefresh();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleSaveNotes = async (id: string) => {
        try {
            await leadsApi.update(id, { notes: editNotes });
            setEditingId(null);
            onRefresh();
            toast.success('Notes saved');
        } catch (error) {
            toast.error('Failed to save notes');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await leadsApi.delete(id);
            setDeleteConfirmId(null);
            onRefresh();
            toast.success('Lead deleted');
        } catch (error) {
            toast.error('Failed to delete lead');
        }
    };

    return (
        <div id="leads">
            <CollapsibleSection
                title="Leads"
                count={filteredLeads.length}
                icon={<FaUsers />}
                iconColor="text-[#D4A63F]"
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
                        data={filteredLeads}
                        filename="leads"
                        columns={exportColumns}
                    />
                </div>

                {/* Table for larger screens */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 font-medium text-gray-900">{lead.name}</td>
                                        <td className="px-4 py-4 text-gray-600">{lead.phone}</td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 text-xs font-semibold bg-[#D4A63F]/10 text-[#D4A63F] rounded-full">
                                                {lead.source || 'popup'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600 text-sm">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <select
                                                value={lead.status || 'new'}
                                                onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-lg border font-medium ${lead.status === 'new' ? 'border-green-300 bg-green-50 text-green-700' :
                                                        lead.status === 'contacted' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                                            lead.status === 'interested' ? 'border-[#D4A63F]/30 bg-[#D4A63F]/10 text-[#D4A63F]' :
                                                                lead.status === 'converted' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                                                                    'border-gray-300 bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 max-w-xs">
                                            {editingId === lead._id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                                                        placeholder="Add notes..."
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveNotes(lead._id)} className="text-green-600 hover:text-green-700">
                                                        <FaSave />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600 truncate">{lead.notes || '-'}</span>
                                                    <button
                                                        onClick={() => { setEditingId(lead._id); setEditNotes(lead.notes || ''); }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {deleteConfirmId === lead._id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
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
                                                    onClick={() => setDeleteConfirmId(lead._id)}
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
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {statusFilter ? 'No leads match your filter' : 'No leads yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Card Stack for mobile screens */}
                <div className="block md:hidden space-y-4">
                    {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                            <div key={lead._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{lead.name}</h4>
                                        <a href={`tel:${lead.phone}`} className="text-sm text-[#D4A63F] hover:underline font-semibold">{lead.phone}</a>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-[#D4A63F]/10 text-[#D4A63F] rounded-full">
                                            {lead.source || 'popup'}
                                        </span>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-2 space-y-2">
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Status</span>
                                            <select
                                                value={lead.status || 'new'}
                                                onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-lg border font-medium w-full mt-1 ${lead.status === 'new' ? 'border-green-300 bg-green-50 text-green-700' :
                                                        lead.status === 'contacted' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                                                            lead.status === 'interested' ? 'border-[#D4A63F]/30 bg-[#D4A63F]/10 text-[#D4A63F]' :
                                                                lead.status === 'converted' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                                                                    'border-gray-300 bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Notes</span>
                                            {editingId === lead._id ? (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="text"
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-1.5 py-1 flex-1 w-full"
                                                        placeholder="Notes..."
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveNotes(lead._id)} className="text-green-600 hover:text-green-700 p-1">
                                                        <FaSave />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-1 mt-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                    <span className="text-xs text-gray-600 truncate max-w-[100px]">{lead.notes || '-'}</span>
                                                    <button
                                                        onClick={() => { setEditingId(lead._id); setEditNotes(lead.notes || ''); }}
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
                                    {deleteConfirmId === lead._id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-red-500 font-medium">Delete?</span>
                                            <button
                                                onClick={() => handleDelete(lead._id)}
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
                                            onClick={() => handleDelete(lead._id)}
                                            className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50"
                                        >
                                            <FaTrash /> Remove Lead
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-xl">
                            {statusFilter ? 'No leads match your filter' : 'No leads yet'}
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
}
