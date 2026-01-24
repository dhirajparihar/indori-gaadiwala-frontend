'use client';

import { useState, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface CollapsibleSectionProps {
    title: string;
    count?: number;
    icon?: ReactNode;
    iconColor?: string;
    defaultCollapsed?: boolean;
    children: ReactNode;
    className?: string;
}

export default function CollapsibleSection({
    title,
    count,
    icon,
    iconColor = 'text-gray-600',
    defaultCollapsed = false,
    children,
    className = ''
}: CollapsibleSectionProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 mb-8 ${className}`}>
            <div
                className={`p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${!isCollapsed ? 'border-b border-gray-200' : ''}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center space-x-2">
                    {icon && <span className={iconColor}>{icon}</span>}
                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                        {count !== undefined && <span className="text-gray-500 font-normal ml-2">({count})</span>}
                    </h2>
                </div>
                <FaChevronDown
                    className={`text-gray-500 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
                />
            </div>
            {!isCollapsed && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
}
