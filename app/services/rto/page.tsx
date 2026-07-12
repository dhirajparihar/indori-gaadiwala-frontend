'use client';

import { useState } from 'react';
import { FaSearch, FaCar, FaIdCard, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { sellerInquiriesApi } from '@/lib/api';

export default function RTOPage() {
    const [regNo, setRegNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicleDetails, setVehicleDetails] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regNo.trim()) return;

        setLoading(true);
        setError('');
        setVehicleDetails(null);

        try {
            const formattedRegNo = regNo.toUpperCase().replace(/\s+/g, '');
            const response = await sellerInquiriesApi.publicLookupByRegNo(formattedRegNo);

            if (response.data.success) {
                setVehicleDetails(response.data.data);
            } else {
                setError(response.data.message || 'Details not found');
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Lookup error:', err);
            setError(err.response?.data?.message || 'Failed to fetch vehicle details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-8 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-4 font-display tracking-tight">
                            RTO <span className="text-black">Services</span>
                        </h1>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium">
                            Check vehicle registration details, owner info, and Challan status instantly.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-[#F8FAFC] border border-[#E4E4E7] rounded-3xl p-8 mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center mb-6">
                                <div className="bg-black p-3.5 rounded-full text-white mr-4">
                                    <FaSearch className="text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 font-display">Vehicle Details Search</h2>
                                    <p className="text-sm text-neutral-500 font-medium">Enter vehicle number to get instant details</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full p-4 pl-12 border border-[#E4E4E7] rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-800 placeholder-gray-450 text-base font-bold transition-all duration-300 bg-white"
                                        placeholder="ENTER VEHICLE NUMBER (E.G. MP09AB0000)"
                                        value={regNo}
                                        onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                                        required
                                    />
                                    </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary py-4 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base shadow-none"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <FaSpinner className="animate-spin" />
                                                <span>Searching...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <FaSearch />
                                                <span>Get Vehicle Details</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 text-xs text-neutral-700">
                                    <span className="flex items-center bg-white border border-[#E4E4E7] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                        <FaCheckCircle className="mr-1.5 text-black" />
                                        Owner Details
                                    </span>
                                    <span className="flex items-center bg-white border border-[#E4E4E7] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                        <FaCheckCircle className="mr-1.5 text-black" />
                                        Instant Check
                                    </span>
                                    <span className="flex items-center bg-white border border-[#E4E4E7] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                        <FaCheckCircle className="mr-1.5 text-black" />
                                        Complete Details
                                    </span>
                                    <span className="flex items-center bg-white border border-[#E4E4E7] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                        <FaCheckCircle className="mr-1.5 text-black" />
                                        RC Information
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-[#F8FAFC] border border-[#E4E4E7] border-l-4 border-black p-4 mb-8 rounded-r-2xl flex items-start">
                            <FaExclamationTriangle className="text-black mt-1 mr-3 flex-shrink-0" />
                            <p className="text-neutral-900 font-semibold text-sm">{error}</p>
                        </div>
                    )}

                    {/* Results */}
                    {vehicleDetails && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-3xl border border-[#E4E4E7] overflow-hidden">
                                <div className="bg-[#F8FAFC] p-6 border-b border-[#E4E4E7]">
                                    <div className="font-bold text-xl text-gray-900 mb-3 font-display">
                                        {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.variant && `- ${vehicleDetails.variant}`}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3.5 py-1 text-xs bg-black text-white rounded-full font-bold uppercase tracking-wider">{vehicleDetails.regNo}</span>
                                        {vehicleDetails.year && <span className="px-3.5 py-1 text-xs bg-white text-black border border-[#E4E4E7] rounded-full font-semibold">{vehicleDetails.year}</span>}
                                        {vehicleDetails.fuelType && <span className="px-3.5 py-1 text-xs bg-white text-black border border-[#E4E4E7] rounded-full font-semibold">{vehicleDetails.fuelType}</span>}
                                        {vehicleDetails.transmissionType && <span className="px-3.5 py-1 text-xs bg-white text-black border border-[#E4E4E7] rounded-full font-semibold">{vehicleDetails.transmissionType}</span>}
                                        {vehicleDetails.bodyType && <span className="px-3.5 py-1 text-xs bg-white text-black border border-[#E4E4E7] rounded-full font-semibold">{vehicleDetails.bodyType}</span>}
                                        {vehicleDetails.color && <span className="px-3.5 py-1 text-xs bg-white text-black border border-[#E4E4E7] rounded-full font-semibold">{vehicleDetails.color}</span>}
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                    <div className="bg-[#F8FAFC] border border-[#E4E4E7] p-4 rounded-2xl">
                                        <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-2">Registration</div>
                                        {vehicleDetails.registeredPlace && <div className="text-gray-900 font-bold">{vehicleDetails.registeredPlace}</div>}
                                        {vehicleDetails.registeredAt && <div className="text-[#71717A] text-xs mt-1">Reg: {vehicleDetails.registeredAt}</div>}
                                        {vehicleDetails.rcStatus && <div className="text-black font-semibold text-xs mt-1">{vehicleDetails.rcStatus}</div>}
                                        {vehicleDetails.rcOwnerCount && <div className="text-[#71717A] text-xs mt-0.5">{vehicleDetails.rcOwnerCount} Owner(s)</div>}
                                    </div>
                                    <div className="bg-[#F8FAFC] border border-[#E4E4E7] p-4 rounded-2xl">
                                        <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-2">Insurance & Fitness</div>
                                        {vehicleDetails.insuranceCompany && <div className="text-gray-700 text-xs truncate font-semibold" title={vehicleDetails.insuranceCompany}>{vehicleDetails.insuranceCompany}</div>}
                                        {vehicleDetails.insuranceUpTo && <div className="text-xs mt-1"><span className="text-gray-500 font-medium">Ins:</span> <span className="text-black font-semibold">{vehicleDetails.insuranceUpTo}</span></div>}
                                        {vehicleDetails.fitnessUpTo && <div className="text-xs mt-0.5"><span className="text-gray-500 font-medium">Fitness:</span> <span className="text-black font-semibold">{vehicleDetails.fitnessUpTo}</span></div>}
                                        {vehicleDetails.taxUpTo && <div className="text-xs mt-0.5"><span className="text-gray-500 font-medium">Tax:</span> <span className="text-black font-semibold">{vehicleDetails.taxUpTo}</span></div>}
                                    </div>
                                    <div className="bg-[#F8FAFC] border border-[#E4E4E7] p-4 rounded-2xl">
                                        <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-2">Manufacturing</div>
                                        {vehicleDetails.manufacturingMonthYr && <div className="text-xs"><span className="text-gray-500 font-medium">Mfg:</span> <span className="text-black font-semibold">{vehicleDetails.manufacturingMonthYr}</span></div>}
                                        {vehicleDetails.regnYear && <div className="text-xs mt-0.5"><span className="text-gray-500 font-medium">Regn Year:</span> <span className="text-black font-semibold">{vehicleDetails.regnYear}</span></div>}
                                        {vehicleDetails.seatCap && <div className="text-xs mt-0.5"><span className="text-gray-500 font-medium">Seats:</span> <span className="text-black font-semibold">{vehicleDetails.seatCap}</span></div>}
                                        {vehicleDetails.vehicleCategory && <div className="text-xs mt-0.5 text-gray-700 truncate" title={vehicleDetails.vehicleCategory}><span className="text-gray-500 font-medium">Category:</span> {vehicleDetails.vehicleCategory}</div>}
                                    </div>
                                    <div className="bg-[#F8FAFC] border border-[#E4E4E7] p-4 rounded-2xl">
                                        <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-2">Other Info</div>
                                        {vehicleDetails.rcOwnerNameMasked && <div className="text-xs"><span className="text-gray-500 font-medium">Owner:</span> <span className="text-black font-semibold">{vehicleDetails.rcOwnerNameMasked}</span></div>}
                                        {vehicleDetails.hypothecation && <div className="text-black font-bold text-xs mt-1">⚠️ Under Finance{vehicleDetails.financier && `: ${vehicleDetails.financier}`}</div>}
                                        {vehicleDetails.variantDisplayName && <div className="text-gray-500 text-[10px] mt-1.5 truncate" title={vehicleDetails.variantDisplayName}>{vehicleDetails.variantDisplayName}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
