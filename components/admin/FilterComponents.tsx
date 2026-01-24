'use client';

import { FaFilter, FaSortAmountDown, FaDownload, FaTimes } from 'react-icons/fa';

interface StatusFilterProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label?: string;
}

export function StatusFilter({ value, onChange, options, label = 'Status' }: StatusFilterProps) {
    return (
        <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 text-sm" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
                <option value="">All {label}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export function SortSelect({ value, onChange, options }: SortSelectProps) {
    return (
        <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-gray-400 text-sm" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

interface ExportButtonProps {
    data: any[];
    filename: string;
    columns: { key: string; label: string }[];
}

export function ExportButton({ data, filename, columns }: ExportButtonProps) {
    const handleExport = () => {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        // Create CSV content
        const headers = columns.map(c => c.label).join(',');
        const rows = data.map(item =>
            columns.map(c => {
                const value = item[c.key];
                // Handle values with commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            }).join(',')
        ).join('\n');

        const csvContent = `${headers}\n${rows}`;

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <FaDownload className="text-gray-500" />
            <span className="hidden sm:inline">Export CSV</span>
        </button>
    );
}

interface ActiveFiltersProps {
    filters: { key: string; label: string; value: string }[];
    onRemove: (key: string) => void;
    onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
    const activeFilters = filters.filter(f => f.value);

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>
            {activeFilters.map((filter) => (
                <span
                    key={filter.key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs"
                >
                    {filter.label}: {filter.value}
                    <button onClick={() => onRemove(filter.key)} className="hover:text-primary-900">
                        <FaTimes className="text-xs" />
                    </button>
                </span>
            ))}
            <button
                onClick={onClearAll}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
                Clear all
            </button>
        </div>
    );
}
