'use client';

import { FaMoneyBillWave, FaPercentage, FaClock, FaCheckCircle } from 'react-icons/fa';
import EMICalculator from '@/components/ui/EMICalculator';

export default function FinancePage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-4 font-display tracking-tight">
                            Vehicle <span className="text-black">Finance</span>
                        </h1>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium">
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
                            <div className="bg-[#F8FAFC] border border-[#E4E4E7] rounded-3xl p-8 shadow-none">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Why Finance with Us?</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E4E4E7] p-3 rounded-full text-black">
                                            <FaPercentage className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Low Interest Rates</h3>
                                            <p className="text-neutral-500 text-sm font-medium">Starting from just 10.5% p.a. for eligible customers.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E4E4E7] p-3 rounded-full text-black">
                                            <FaClock className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Quick Approval</h3>
                                            <p className="text-neutral-500 text-sm font-medium">Get combined approval within 48 hours with minimal documentation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E4E4E7] p-3 rounded-full text-black">
                                            <FaCheckCircle className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">High LTV</h3>
                                            <p className="text-neutral-500 text-sm font-medium">Up to 90% funding on on-road price for select models.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#F8FAFC] border border-[#E4E4E7] rounded-3xl p-8 text-black">
                                <h2 className="text-2xl font-bold mb-5 font-display">Documents Required</h2>
                                <ul className="space-y-3.5">
                                    <li className="flex items-center space-x-3 text-sm text-[#71717A] font-semibold">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span>Aadhar Card & PAN Card</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-[#71717A] font-semibold">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span>Address Proof (Electricity Bill/Rent Agreement)</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-[#71717A] font-semibold">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span>Bank Statement (Last 6 months)</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-[#71717A] font-semibold">
                                        <div className="w-2 h-2 bg-black rounded-full" />
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
