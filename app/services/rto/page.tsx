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
        <div className="min-h-screen bg-gray-50">

            <div className="pt-8 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            RTO <span className="text-blue-600">Services</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Check vehicle registration details, owner info, and Challan status instantly.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-100 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-600 p-3 rounded-xl text-white mr-4">
                                    <FaSearch className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Vehicle Details Search</h2>
                                    <p className="text-sm text-gray-500">Enter vehicle number to get instant details</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-lg font-medium transition-all duration-300"
                                        placeholder="ENTER VEHICLE NUMBER (E.G. MP09AB0000)"
                                        value={regNo}
                                        onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                                        required
                                    />
                                    </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                                
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    <span className="flex items-center bg-red-50 text-red-600 px-3 py-1 rounded-full">
                                        <FaCheckCircle className="mr-1" />
                                        Owner Details
                                    </span>
                                    <span className="flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                                        <FaCheckCircle className="mr-1" />
                                        Instant Check
                                    </span>
                                    <span className="flex items-center bg-green-50 text-green-600 px-3 py-1 rounded-full">
                                        <FaCheckCircle className="mr-1" />
                                        Complete Details
                                    </span>
                                    <span className="flex items-center bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                                        <FaCheckCircle className="mr-1" />
                                        RC Information
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start">
                            <FaExclamationTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Results */}
                    {vehicleDetails && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                                    <div className="font-bold text-xl text-gray-900 mb-2">
                                        {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.variant && `- ${vehicleDetails.variant}`}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-bold">{vehicleDetails.regNo}</span>
                                        {vehicleDetails.year && <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">{vehicleDetails.year}</span>}
                                        {vehicleDetails.fuelType && <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">{vehicleDetails.fuelType}</span>}
                                        {vehicleDetails.transmissionType && <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">{vehicleDetails.transmissionType}</span>}
                                        {vehicleDetails.bodyType && <span className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">{vehicleDetails.bodyType}</span>}
                                        {vehicleDetails.color && <span className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-full">{vehicleDetails.color}</span>}
                                    </div>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Registration</div>
                                        {vehicleDetails.registeredPlace && <div className="text-gray-900 font-medium">{vehicleDetails.registeredPlace}</div>}
                                        {vehicleDetails.registeredAt && <div className="text-gray-600">Reg: {vehicleDetails.registeredAt}</div>}
                                        {vehicleDetails.rcStatus && <div className={vehicleDetails.rcStatus === 'Active' ? 'text-green-600' : 'text-red-600'}>{vehicleDetails.rcStatus}</div>}
                                        {vehicleDetails.rcOwnerCount && <div className="text-gray-600">{vehicleDetails.rcOwnerCount} Owner(s)</div>}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Insurance & Fitness</div>
                                        {vehicleDetails.insuranceCompany && <div className="text-gray-700 text-sm truncate" title={vehicleDetails.insuranceCompany}>{vehicleDetails.insuranceCompany}</div>}
                                        {vehicleDetails.insuranceUpTo && <div><span className="text-gray-500">Ins:</span> <span className={new Date(vehicleDetails.insuranceUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{vehicleDetails.insuranceUpTo}</span></div>}
                                        {vehicleDetails.fitnessUpTo && <div><span className="text-gray-500">Fitness:</span> <span className={new Date(vehicleDetails.fitnessUpTo) > new Date() ? 'text-green-600' : 'text-red-600'}>{vehicleDetails.fitnessUpTo}</span></div>}
                                        {vehicleDetails.taxUpTo && <div><span className="text-gray-500">Tax:</span> {vehicleDetails.taxUpTo}</div>}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Manufacturing</div>
                                        {vehicleDetails.manufacturingMonthYr && <div><span className="text-gray-500">Mfg:</span> {vehicleDetails.manufacturingMonthYr}</div>}
                                        {vehicleDetails.regnYear && <div><span className="text-gray-500">Regn Year:</span> {vehicleDetails.regnYear}</div>}
                                        {vehicleDetails.seatCap && <div><span className="text-gray-500">Seats:</span> {vehicleDetails.seatCap}</div>}
                                        {vehicleDetails.vehicleCategory && <div><span className="text-gray-500">Category:</span> {vehicleDetails.vehicleCategory}</div>}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Other Info</div>
                                        {vehicleDetails.rcOwnerNameMasked && <div><span className="text-gray-500">Owner:</span> {vehicleDetails.rcOwnerNameMasked}</div>}
                                        {vehicleDetails.hypothecation && <div className="text-orange-600 mt-1">⚠️ Under Finance{vehicleDetails.financier && `: ${vehicleDetails.financier}`}</div>}
                                        {vehicleDetails.variantDisplayName && <div className="text-gray-600 text-xs mt-1 truncate" title={vehicleDetails.variantDisplayName}>{vehicleDetails.variantDisplayName}</div>}
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
