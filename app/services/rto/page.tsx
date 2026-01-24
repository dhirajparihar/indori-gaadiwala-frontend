'use client';

import { useState } from 'react';
import { FaSearch, FaCar, FaIdCard, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { sellerInquiriesApi } from '@/lib/api';

export default function RTOPage() {
    const [regNo, setRegNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicleDetails, setVehicleDetails] = useState<any>(null);
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
        } catch (err: any) {
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
                    <div className="card p-8 mb-8 shadow-lg border-blue-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <FaSearch className="mr-2 text-blue-600" />
                            Vehicle Registration Search
                        </h2>
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                                    placeholder="Enter Vehicle Number (e.g. MP09AB0000)"
                                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all uppercase font-bold tracking-wider"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !regNo}
                                className="btn-primary py-4 px-8 text-lg flex items-center justify-center space-x-2 min-w-[160px]"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Checking...</span>
                                    </>
                                ) : (
                                    <span>Get Details</span>
                                )}
                            </button>
                        </form>
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
                        <div className="animate-fade-in space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">{vehicleDetails.regNo}</h3>
                                        <p className="opacity-90">{vehicleDetails.make} {vehicleDetails.model}</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                        <FaCar />
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Owner Name</label>
                                        <p className="text-gray-900 font-medium">{vehicleDetails.rcOwnerNameMasked || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Registration Date</label>
                                        <p className="text-gray-900 font-medium">{vehicleDetails.registeredAt || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Fuel Type</label>
                                        <p className="text-gray-900 font-medium">{vehicleDetails.fuelType || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Class</label>
                                        <p className="text-gray-900 font-medium break-words">{vehicleDetails.vehicleClassDesc || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">RC Status</label>
                                        <div className="flex items-center space-x-2">
                                            {vehicleDetails.rcStatus === 'ACTIVE' ? (
                                                <FaCheckCircle className="text-green-500" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                            )}
                                            <p className="text-gray-900 font-medium">{vehicleDetails.rcStatus || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <label className="text-xs font-bold text-gray-500 uppercase">RTO Location</label>
                                        <p className="text-gray-900 font-medium">{vehicleDetails.registeredPlace || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card p-6">
                                    <h4 className="flex items-center font-bold text-gray-900 mb-4 border-b pb-2">
                                        <FaIdCard className="mr-2 text-blue-600" />
                                        Insurance Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Insurer</span>
                                            <span className="font-medium">{vehicleDetails.insuranceCompany || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Valid Upto</span>
                                            <span className="font-medium text-green-600">{vehicleDetails.insuranceUpTo || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6">
                                    <h4 className="flex items-center font-bold text-gray-900 mb-4 border-b pb-2">
                                        <FaCar className="mr-2 text-blue-600" />
                                        Vehicle Specs
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Color</span>
                                            <span className="font-medium">{vehicleDetails.color || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Engine No</span>
                                            <span className="font-medium font-mono text-sm">Masked</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Chassis No</span>
                                            <span className="font-medium font-mono text-sm">Masked</span>
                                        </div>
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
