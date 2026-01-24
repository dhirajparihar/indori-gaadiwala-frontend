'use client';

import { FaMoneyBillWave, FaPercentage, FaClock, FaCheckCircle } from 'react-icons/fa';
import EMICalculator from '@/components/ui/EMICalculator';

export default function FinancePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Vehicle <span className="text-blue-600">Finance</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get your dream car with our simplified financing options. Competitive rates, minimal paperwork, and quick approvals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Calculator Section */}
                        <div>
                            <div className="sticky top-24">
                                <EMICalculator initialPrice={500000} />
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Finance with Us?</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                            <FaPercentage className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Low Interest Rates</h3>
                                            <p className="text-gray-600 text-sm">Starting from just 10.5% p.a. for eligible customers.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                            <FaClock className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Quick Approval</h3>
                                            <p className="text-gray-600 text-sm">Get combined approval within 48 hours with minimal documentation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                            <FaCheckCircle className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">High LTV</h3>
                                            <p className="text-gray-600 text-sm">Up to 90% funding on on-road price for select models.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-4">Documents Required</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span>Aadhar Card & PAN Card</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span>Address Proof (Electricity Bill/Rent Agreement)</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span>Bank Statement (Last 6 months)</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span>Income Proof (Salary Slip/ITR)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
