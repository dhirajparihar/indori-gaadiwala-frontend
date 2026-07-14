'use client';

import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line,
} from 'recharts';
import { Vehicle, Booking, Lead, SellerInquiry } from '@/lib/types';

interface OverviewChartsProps {
    vehicles: Vehicle[];
    bookings: Booking[];
    leads: Lead[];
    sellerInquiries: SellerInquiry[];
}

const GOLD = '#D4A63F';
const EMERALD = '#22C55E';
const AMBER = '#F59E0B';
const RED = '#EF4444';
const GRAY = '#6B7280';
const TEAL = '#14B8A6';
const SLATE = '#64748B';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 shadow-xl text-sm">
            {label && <p className="text-gray-400 font-semibold mb-1 text-xs uppercase tracking-wide">{label}</p>}
            {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-300">{entry.name}:</span>
                    <span className="text-white font-bold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;
    return (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {payload.map((entry: { value: string; color: string }, index: number) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    {entry.value}
                </div>
            ))}
        </div>
    );
};

function groupCount<T>(arr: T[], key: keyof T): { name: string; value: number }[] {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
        const val = String(item[key] ?? 'unknown');
        counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function lastNMonths(n: number): string[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result: string[] = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push(`${months[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`);
    }
    return result;
}

function countByMonth<T extends { createdAt?: string }>(arr: T[], months: string[]): number[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(label => {
        const [mon, yr] = label.split(" '");
        const mIdx = monthNames.indexOf(mon);
        const fullYear = 2000 + parseInt(yr);
        return arr.filter(item => {
            if (!item.createdAt) return false;
            const d = new Date(item.createdAt);
            return d.getMonth() === mIdx && d.getFullYear() === fullYear;
        }).length;
    });
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4A63F] mt-1.5" />
            </div>
            {children}
        </div>
    );
}

export default function OverviewCharts({ vehicles, bookings, leads, sellerInquiries }: OverviewChartsProps) {
    // 1. Booking Status
    const bookingStatusData = [
        { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: RED },
        { name: 'Contacted', value: bookings.filter(b => b.status === 'contacted').length, color: GOLD },
        { name: 'Scheduled', value: bookings.filter(b => b.status === 'inspection_scheduled').length, color: AMBER },
        { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: EMERALD },
        { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: GRAY },
    ].filter(d => d.value > 0);

    // 2. Leads Funnel
    const leadsFunnelData = [
        { stage: 'New', count: leads.filter(l => l.status === 'new').length },
        { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
        { stage: 'Interested', count: leads.filter(l => (l.status as string) === 'interested').length },
        { stage: 'Converted', count: leads.filter(l => l.status === 'converted').length },
    ];

    // 3. Vehicle Inventory
    const vehicleStatusData = [
        { name: 'Available', value: vehicles.filter(v => v.status === 'available').length, color: EMERALD },
        { name: 'Sold', value: vehicles.filter(v => v.status === 'sold').length, color: RED },
        { name: 'Reserved', value: vehicles.filter(v => v.status === 'reserved').length, color: GOLD },
    ].filter(d => d.value > 0);

    const fuelTypeData = groupCount(vehicles, 'fuelType').sort((a, b) => b.value - a.value);
    const fuelColors: Record<string, string> = {
        Petrol: GOLD, Diesel: '#475569', Electric: EMERALD, Hybrid: TEAL, CNG: AMBER, unknown: GRAY
    };

    // 4. Activity Trend
    const months = lastNMonths(6);
    const trendData = months.map((month, i) => ({
        month,
        Bookings: countByMonth(bookings, months)[i],
        Leads: countByMonth(leads, months)[i],
        Inquiries: countByMonth(sellerInquiries, months)[i],
    }));
    const hasActivity = trendData.some(d => d.Bookings + d.Leads + d.Inquiries > 0);

    // 5. Seller Inquiries
    const inquiryStatusData = [
        { name: 'New', value: sellerInquiries.filter(s => s.status === 'new').length, color: SLATE },
        { name: 'Contacted', value: sellerInquiries.filter(s => s.status === 'contacted').length, color: GOLD },
        { name: 'Inspection', value: sellerInquiries.filter(s => s.status === 'inspection_scheduled').length, color: AMBER },
        { name: 'Purchased', value: sellerInquiries.filter(s => s.status === 'purchased').length, color: EMERALD },
        { name: 'Rejected', value: sellerInquiries.filter(s => s.status === 'rejected').length, color: RED },
        { name: 'Completed', value: sellerInquiries.filter(s => s.status === 'completed').length, color: TEAL },
    ].filter(d => d.value > 0);

    const LEAD_COLORS = [SLATE, GOLD, AMBER, EMERALD];

    return (
        <div className="space-y-6">
            {/* Row 1: Trend + Bookings Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Activity Trend" subtitle="Last 6 months — bookings, leads & inquiries">
                    {hasActivity ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={renderLegend} />
                                <Line type="monotone" dataKey="Bookings" stroke={RED} strokeWidth={2.5} dot={{ r: 3, fill: RED }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="Leads" stroke={GOLD} strokeWidth={2.5} dot={{ r: 3, fill: GOLD }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="Inquiries" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 3, fill: EMERALD }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[220px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <span className="text-3xl">📈</span>
                            <span className="text-sm">Activity will appear here as data grows</span>
                        </div>
                    )}
                </ChartCard>

                <ChartCard title="Bookings by Status" subtitle={`${bookings.length} total — breakdown by current status`}>
                    {bookings.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={bookingStatusData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {bookingStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={renderLegend} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[220px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <span className="text-3xl">📋</span>
                            <span className="text-sm">No bookings yet</span>
                        </div>
                    )}
                </ChartCard>
            </div>

            {/* Row 2: Leads Funnel + Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Leads Pipeline" subtitle="Conversion funnel across all stages">
                    {leads.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={leadsFunnelData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} width={70} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]}>
                                    {leadsFunnelData.map((_, index) => (
                                        <Cell key={index} fill={LEAD_COLORS[index] || GRAY} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <span className="text-3xl">👥</span>
                            <span className="text-sm">No leads yet</span>
                        </div>
                    )}
                </ChartCard>

                <ChartCard title="Vehicle Inventory" subtitle={`${vehicles.length} vehicles — by status & fuel type`}>
                    {vehicles.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-1">Status</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={4} dataKey="value">
                                            {vehicleStatusData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend content={renderLegend} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-px h-32 bg-gray-100 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center mb-1">Fuel Type</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={fuelTypeData} layout="vertical" margin={{ top: 0, right: 10, left: 5, bottom: 0 }}>
                                        <XAxis type="number" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} width={48} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" name="Vehicles" radius={[0, 4, 4, 0]}>
                                            {fuelTypeData.map((entry, index) => (
                                                <Cell key={index} fill={fuelColors[entry.name] || GRAY} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <span className="text-3xl">🚗</span>
                            <span className="text-sm">No vehicles yet</span>
                        </div>
                    )}
                </ChartCard>
            </div>

            {/* Row 3: Seller Inquiries Pipeline */}
            {sellerInquiries.length > 0 && (
                <ChartCard title="Seller Inquiries Pipeline" subtitle={`${sellerInquiries.length} total inquiries — buy-from-seller pipeline`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-full md:w-52 flex-shrink-0">
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={inquiryStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                                        {inquiryStatusData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                            {inquiryStatusData.map(item => (
                                <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{item.name}</p>
                                        <p className="text-xl font-extrabold text-gray-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>
            )}
        </div>
    );
}
