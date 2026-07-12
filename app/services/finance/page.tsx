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
                        <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">Services</span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 font-display tracking-tight">
                            Vehicle <span className="text-[#D4A63F]">Finance</span>
                        </h1>
                        <p className="text-base text-gray-500 max-w-2xl mx-auto font-medium font-sans">
                            Get your dream vehicle with our simplified financing options. Competitive rates, minimal paperwork, and quick approvals.
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
                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-display">Why Finance with Us?</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm">
                                            <FaPercentage className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">Low Interest Rates</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Starting from just 10.5% p.a. for eligible customers.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm">
                                            <FaClock className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">Quick Approval</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Get combined approval within 48 hours with minimal documentation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm">
                                            <FaCheckCircle className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">High LTV</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Up to 90% funding on on-road price for select models.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 text-neutral-900 shadow-sm">
                                <h2 className="text-2xl font-bold mb-5 font-display">Documents Required</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center space-x-3 text-sm text-gray-550 font-bold font-sans">
                                        <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full" />
                                        <span>Aadhar Card &amp; PAN Card</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-gray-550 font-bold font-sans">
                                        <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full" />
                                        <span>Address Proof (Electricity Bill/Rent Agreement)</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-gray-550 font-bold font-sans">
                                        <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full" />
                                        <span>Bank Statement (Last 6 months)</span>
                                    </li>
                                    <li className="flex items-center space-x-3 text-sm text-gray-550 font-bold font-sans">
                                        <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full" />
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
