'use client';

import { useState } from 'react';
import { FaUsers, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { leadsApi } from '@/lib/api';
import CollapsibleSection from './CollapsibleSection';
import { StatusFilter, SortSelect, ExportButton, ActiveFilters } from './FilterComponents';

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

const getSourceBadge = (source?: string) => {
    const src = (source || 'welcome_popup').toLowerCase();
    if (src === 'finance_page' || src === 'finance') {
        return (
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Finance Page
            </span>
        );
    }
    if (src === 'welcome_popup' || src === 'popup') {
        return (
            <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Popup
            </span>
        );
    }
    return (
        <span className="px-2.5 py-1 text-xs font-bold bg-[#D4A63F]/10 text-[#D4A63F] border border-[#D4A63F]/20 rounded-full capitalize inline-flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A63F]"></span>
            {src.replace('_', ' ')}
        </span>
    );
};

const renderNotesContent = (notesStr: string) => {
    if (!notesStr) return <span className="text-gray-400 italic text-xs">No notes provided</span>;

    if (notesStr.includes('|')) {
        const parts = notesStr.split('|').map(p => p.trim());
        return (
            <div className="space-y-1.5 font-sans">
                {parts.map((part, idx) => {
                    const colonIdx = part.indexOf(':');
                    if (colonIdx !== -1) {
                        const key = part.slice(0, colonIdx).trim();
                        const val = part.slice(colonIdx + 1).trim();
                        return (
                            <div key={idx} className="flex items-start gap-1.5 text-xs">
                                <span className="font-bold text-[#D4A63F] min-w-[70px] whitespace-nowrap">{key}:</span>
                                <span className="text-neutral-100 font-medium">{val}</span>
                            </div>
                        );
                    }
                    return (
                        <div key={idx} className="text-xs text-neutral-200 font-medium">
                            • {part}
                        </div>
                    );
                })}
            </div>
        );
    }

    return <p className="text-xs text-neutral-100 whitespace-pre-wrap leading-relaxed font-sans">{notesStr}</p>;
};

export default function LeadsSection({ leads, onRefresh }: LeadsSectionProps) {
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNotes, setEditNotes] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Compute dynamic source options from leads
    const defaultSourceOptions = [
        { value: 'welcome_popup', label: 'Popup' },
        { value: 'finance_page', label: 'Finance Page' },
    ];

    const sourceOptions = Array.from(
        new Set([
            ...defaultSourceOptions.map(o => o.value),
            ...leads.map(l => l.source || 'welcome_popup')
        ])
    ).map(src => {
        const defaultOpt = defaultSourceOptions.find(o => o.value === src);
        if (defaultOpt) return defaultOpt;
        const label = src.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
        return { value: src, label };
    });

    // Filter and sort leads
    let filteredLeads = [...leads];

    if (statusFilter) {
        filteredLeads = filteredLeads.filter(l => l.status === statusFilter);
    }

    if (sourceFilter) {
        filteredLeads = filteredLeads.filter(l => (l.source || 'welcome_popup') === sourceFilter);
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
                        label="Status"
                    />
                    <StatusFilter
                        value={sourceFilter}
                        onChange={setSourceFilter}
                        options={sourceOptions}
                        label="Source"
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

                {/* Active Filters Bar */}
                {(statusFilter || sourceFilter) && (
                    <div className="mb-4">
                        <ActiveFilters
                            filters={[
                                { key: 'status', label: 'Status', value: statusOptions.find(o => o.value === statusFilter)?.label || '' },
                                { key: 'source', label: 'Source', value: sourceOptions.find(o => o.value === sourceFilter)?.label || '' },
                            ]}
                            onRemove={(key) => {
                                if (key === 'status') setStatusFilter('');
                                if (key === 'source') setSourceFilter('');
                            }}
                            onClearAll={() => {
                                setStatusFilter('');
                                setSourceFilter('');
                            }}
                        />
                    </div>
                )}

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
                                            {getSourceBadge(lead.source)}
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
                                        <td className="px-4 py-4 max-w-[260px]">
                                            {editingId === lead._id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editNotes}
                                                        onChange={(e) => setEditNotes(e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 outline-none focus:border-[#D4A63F]"
                                                        placeholder="Add notes..."
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
                                                <div className="relative group inline-flex items-center justify-between gap-2 bg-gray-50/80 hover:bg-amber-50/60 px-2.5 py-1.5 rounded-lg border border-gray-200/80 hover:border-amber-200 transition-all cursor-pointer w-full">
                                                    <span className="text-xs text-gray-700 font-medium truncate max-w-[180px]" title={lead.notes}>
                                                        {lead.notes || <span className="text-gray-400 italic">No notes</span>}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingId(lead._id); setEditNotes(lead.notes || ''); }}
                                                        className="text-gray-400 hover:text-[#D4A63F] transition-colors p-0.5 flex-shrink-0"
                                                        title="Edit notes"
                                                    >
                                                        <FaEdit className="text-[11px]" />
                                                    </button>

                                                    {/* Floating Hover Popover */}
                                                    {lead.notes && (
                                                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-72 bg-[#111111] text-white p-3.5 rounded-xl shadow-2xl border border-neutral-800 pointer-events-none transition-all duration-200">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4A63F] mb-1.5 pb-1 border-b border-neutral-800 flex items-center justify-between">
                                                                <span>Lead Details &amp; Notes</span>
                                                            </div>
                                                            {renderNotesContent(lead.notes)}
                                                            {/* Tooltip arrow */}
                                                            <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-[#111111]" />
                                                        </div>
                                                    )}
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
                                        {statusFilter || sourceFilter ? 'No leads match your filter' : 'No leads yet'}
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
                                    <div className="text-right flex flex-col items-end">
                                        {getSourceBadge(lead.source)}
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
                                                <div className="relative group mt-1">
                                                    <div className="flex items-center justify-between gap-1 bg-gray-50/80 hover:bg-amber-50/60 px-2.5 py-1.5 rounded-lg border border-gray-200/80 cursor-pointer">
                                                        <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]" title={lead.notes}>
                                                            {lead.notes || <span className="text-gray-400 italic">-</span>}
                                                        </span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditingId(lead._id); setEditNotes(lead.notes || ''); }}
                                                            className="text-gray-400 hover:text-[#D4A63F] p-0.5 flex-shrink-0"
                                                        >
                                                            <FaEdit className="text-[11px]" />
                                                        </button>
                                                    </div>
                                                    {lead.notes && (
                                                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-64 bg-[#111111] text-white p-3 rounded-xl shadow-2xl border border-neutral-800 pointer-events-none">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4A63F] mb-1 pb-1 border-b border-neutral-800">
                                                                Lead Details &amp; Notes
                                                            </div>
                                                            {renderNotesContent(lead.notes)}
                                                            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-[#111111]" />
                                                        </div>
                                                    )}
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
                            {statusFilter || sourceFilter ? 'No leads match your filter' : 'No leads yet'}
                        </div>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
}
