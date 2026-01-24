'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { sellerInquiriesApi } from '@/lib/api';

interface VehicleDetails {
    regNo: string;
    make: string;
    model: string;
    variant: string;
    variantDisplayName: string;
    year: string;
    fuelType: string;
    transmissionType: string;
    bodyType: string;
    color: string;
    registeredPlace: string;
    registeredAt: string;
    rcStatus: string;
    rcOwnerCount: string;
    rcOwnerNameMasked: string;
    insuranceCompany: string;
    insuranceUpTo: string;
    fitnessUpTo: string;
    taxUpTo: string;
    manufacturingMonthYr: string;
    regnYear: string;
    seatCap: string;
    vehicleCategory: string;
    hypothecation: boolean;
    financier: string;
}

export default function VehicleLookup() {
    const [regNo, setRegNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VehicleDetails | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!regNo) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await sellerInquiriesApi.lookupByRegNo(regNo);
            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError(response.data.message || 'Vehicle not found');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch vehicle details.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setResult(null);
        setRegNo('');
        setError('');
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-4 border border-blue-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
                    <FaSearch className="text-blue-600" />
                    Vehicle Lookup
                </h2>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Enter Reg No. (e.g. MP09CD5645)"
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                            onKeyDown={(e) => e.key === 'Enter' && regNo && handleSearch()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm font-mono"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !regNo}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                        {loading ? <span className="animate-spin">⟳</span> : <FaSearch />}
                        <span className="hidden sm:inline">Search</span>
                    </button>
                    {result && (
                        <button onClick={handleClear} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-b">
                        <div className="font-bold text-lg text-gray-900">
                            {result.make} {result.model} {result.variant && `- ${result.variant}`}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-bold">{result.regNo}</span>
                            {result.year && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{result.year}</span>}
                            {result.fuelType && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{result.fuelType}</span>}
                            {result.transmissionType && <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">{result.transmissionType}</span>}
                            {result.bodyType && <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">{result.bodyType}</span>}
                            {result.color && <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">{result.color}</span>}
                        </div>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Registration</div>
                            {result.registeredPlace && <div className="text-gray-900 font-medium">{result.registeredPlace}</div>}
                            {result.registeredAt && <div className="text-gray-600">Reg: {result.registeredAt}</div>}
                            {result.rcStatus && <div className={result.rcStatus === 'Active' ? 'text-green-600' : 'text-red-600'}>{result.rcStatus}</div>}
                            {result.rcOwnerCount && <div className="text-gray-600">{result.rcOwnerCount} Owner(s)</div>}
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Insurance & Fitness</div>
                            {result.insuranceCompany && <div className="text-gray-700 text-xs truncate" title={result.insuranceCompany}>{result.insuranceCompany}</div>}
                            {result.insuranceUpTo && <div><span className="text-gray-500">Ins:</span> <span className={new Date(result.insuranceUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{result.insuranceUpTo}</span></div>}
                            {result.fitnessUpTo && <div><span className="text-gray-500">Fitness:</span> <span className={new Date(result.fitnessUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{result.fitnessUpTo}</span></div>}
                            {result.taxUpTo && <div><span className="text-gray-500">Tax:</span> {result.taxUpTo}</div>}
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Manufacturing</div>
                            {result.manufacturingMonthYr && <div><span className="text-gray-500">Mfg:</span> {result.manufacturingMonthYr}</div>}
                            {result.regnYear && <div><span className="text-gray-500">Regn Year:</span> {result.regnYear}</div>}
                            {result.seatCap && <div><span className="text-gray-500">Seats:</span> {result.seatCap}</div>}
                            {result.vehicleCategory && <div><span className="text-gray-500">Category:</span> {result.vehicleCategory}</div>}
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                            <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Other Info</div>
                            {result.rcOwnerNameMasked && <div><span className="text-gray-500">Owner:</span> {result.rcOwnerNameMasked}</div>}
                            {result.hypothecation && <div className="text-orange-600 mt-1">⚠️ Under Finance{result.financier && `: ${result.financier}`}</div>}
                            {result.variantDisplayName && <div className="text-gray-600 text-[10px] mt-1 truncate" title={result.variantDisplayName}>{result.variantDisplayName}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
