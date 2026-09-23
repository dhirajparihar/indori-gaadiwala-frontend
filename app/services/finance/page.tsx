'use client';

import { useState } from 'react';
import {
    FaPercentage,
    FaClock,
    FaCheckCircle,
    FaFileAlt,
    FaShieldAlt,
    FaBolt,
    FaChevronDown,
    FaChevronUp,
    FaUserCheck,
    FaCarSide,
    FaHandshake,
} from 'react-icons/fa';
import EMICalculator from '@/components/ui/EMICalculator';
import FinanceLeadForm from '@/components/ui/FinanceLeadForm';

export default function FinancePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: 'What interest rates and loan tenures do you offer for vehicle financing?',
            answer: 'We offer competitive interest rates starting from 7% p.a. with flexible repayment tenures ranging from 12 months (1 year) up to 84 months (7 years), customized according to your credit profile and vehicle valuation.',
        },
        {
            question: 'How much of the vehicle price can be financed?',
            answer: 'Eligible customers can secure up to 90% funding on the vehicle\'s on-road valuation, minimizing your upfront down payment requirement.',
        },
        {
            question: 'What documents are required to process my loan application?',
            answer: 'You will need: Identity Proof (Aadhaar Card, PAN Card), Address Proof (Utility Bill / Rent Agreement), Bank Proof (Last 6 months bank statement), and Income Proof (Last 3 months salary slips or last 2 years ITR).',
        },
        {
            question: 'How long does the loan approval and disbursal process take?',
            answer: 'Our streamlined digital processing enables pre-approval within 3 to 6 hours once documentation is submitted and verified.',
        },
        {
            question: 'Can self-employed individuals and business owners apply for financing?',
            answer: 'Yes! We provide tailored finance options for both salaried employees and self-employed professionals or business owners with at least 1-2 years of work continuity.',
        },
        {
            question: 'Are there any foreclosure or pre-payment charges?',
            answer: 'Pre-payment and foreclosure terms depend on the financing bank or NBFC. Most of our partner institutions allow pre-payment after completing 6 EMIs with nominal or zero charges.',
        },
        {
            question: 'Does Indori Gaadiwala help with RTO transfer and loan hypothecation?',
            answer: 'Yes! We offer complete end-to-end assistance, managing vehicle RC transfer, bank hypothecation endorsement, and all necessary RTO documentation.',
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-8 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
                            Vehicle Finance Services
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] mb-4 font-display tracking-tight leading-tight">
                            Get Easy &amp; Fast <span className="text-[#D4A63F]">Vehicle Financing</span>
                        </h1>
                        <p className="text-base text-gray-600 font-medium font-sans leading-relaxed">
                            Drive away your dream vehicle with competitive interest rates starting at 10.5% p.a., up to 90% funding, and quick 48-hour approvals.
                        </p>

                        {/* Feature Badges Bar */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            <div className="flex items-center space-x-2 bg-[#FAFAF8] border border-[#E5E7EB] px-3.5 py-2 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                                <FaBolt className="text-[#D4A63F]" />
                                <span>6-Hour Approval</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-[#FAFAF8] border border-[#E5E7EB] px-3.5 py-2 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                                <FaPercentage className="text-[#D4A63F]" />
                                <span>Rates from 7% p.a.</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-[#FAFAF8] border border-[#E5E7EB] px-3.5 py-2 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                                <FaShieldAlt className="text-[#D4A63F]" />
                                <span>Up to 90% Funding</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-[#FAFAF8] border border-[#E5E7EB] px-3.5 py-2 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                                <FaCheckCircle className="text-[#D4A63F]" />
                                <span>No Extra Fees</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Interactive Grid: Lead Application Form + EMI Calculator */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Finance Lead Form */}
                        <div className="w-full">
                            <FinanceLeadForm />
                        </div>

                        {/* EMI Calculator */}
                        <div className="w-full">
                            <EMICalculator initialPrice={500000} />
                        </div>
                    </div>

                    {/* Why Finance With Us Grid */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
                                Why Finance with <span className="text-[#D4A63F]">Indori Gaadiwala</span>?
                            </h2>
                            <p className="text-gray-500 text-sm font-medium mt-1 font-sans">
                                We partner with leading nationalized &amp; private banks to get you the lowest interest rate and maximum loan amount.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:border-[#D4A63F] transition-all">
                                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#D4A63F] text-xl mb-4 shadow-sm">
                                    <FaPercentage />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 font-display mb-2">Low Interest Rates</h3>
                                <p className="text-gray-500 text-sm font-medium font-sans leading-relaxed">
                                    Competitive interest rates starting from just 10.5% p.a. customized according to your credit profile.
                                </p>
                            </div>

                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:border-[#D4A63F] transition-all">
                                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#D4A63F] text-xl mb-4 shadow-sm">
                                    <FaClock />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 font-display mb-2">Quick 48-Hour Approval</h3>
                                <p className="text-gray-500 text-sm font-medium font-sans leading-relaxed">
                                    Hassle-free digital application and doorstep documentation pickup with fast approvals.
                                </p>
                            </div>

                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:border-[#D4A63F] transition-all">
                                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#D4A63F] text-xl mb-4 shadow-sm">
                                    <FaCheckCircle />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 font-display mb-2">High LTV Ratio</h3>
                                <p className="text-gray-500 text-sm font-medium font-sans leading-relaxed">
                                    Get up to 90% funding on the vehicle on-road valuation with flexible down payment options.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How It Works - 4 Step Process */}
                    <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[28px] p-8 sm:p-10 shadow-sm space-y-8">
                        <div className="text-center max-w-xl mx-auto">
                            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-1">Simple Process</span>
                            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
                                How Loan Approval Works
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3 relative">
                                <div className="w-8 h-8 rounded-full bg-[#111111] text-white text-xs font-black flex items-center justify-center font-display">
                                    01
                                </div>
                                <h4 className="font-bold text-neutral-900 font-display text-base">Submit Inquiry</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed font-sans">
                                    Fill out the quick finance form with your phone number and desired loan amount.
                                </p>
                            </div>

                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3 relative">
                                <div className="w-8 h-8 rounded-full bg-[#D4A63F] text-neutral-900 text-xs font-black flex items-center justify-center font-display">
                                    02
                                </div>
                                <h4 className="font-bold text-neutral-900 font-display text-base">Expert Consultation</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed font-sans">
                                    Our loan specialist calls you to evaluate profiles and suggest top bank offers.
                                </p>
                            </div>

                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3 relative">
                                <div className="w-8 h-8 rounded-full bg-[#111111] text-white text-xs font-black flex items-center justify-center font-display">
                                    03
                                </div>
                                <h4 className="font-bold text-neutral-900 font-display text-base">Document Pickup</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed font-sans">
                                    Doorstep collection &amp; digital verification of basic KYC and income documents.
                                </p>
                            </div>

                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm space-y-3 relative">
                                <div className="w-8 h-8 rounded-full bg-[#D4A63F] text-neutral-900 text-xs font-black flex items-center justify-center font-display">
                                    04
                                </div>
                                <h4 className="font-bold text-neutral-900 font-display text-base">Disbursal &amp; Delivery</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed font-sans">
                                    Fast loan sanction &amp; disbursal so you can drive home your vehicle hassle-free!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Documents & Eligibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Documents Required */}
                        <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 shadow-sm space-y-6">
                            <div className="flex items-center space-x-3 text-[#111111] font-display">
                                <div className="p-3 bg-white border border-[#E5E7EB] rounded-full text-[#D4A63F]">
                                    <FaFileAlt className="text-lg" />
                                </div>
                                <h3 className="text-2xl font-bold">Documents Required</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full flex-shrink-0" />
                                    <span>Identity Proof: Aadhar Card &amp; PAN Card</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full flex-shrink-0" />
                                    <span>Address Proof: Electricity Bill / Rent Agreement</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full flex-shrink-0" />
                                    <span>Bank Proof: Last 6 Months Bank Statement</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#D4A63F] rounded-full flex-shrink-0" />
                                    <span>Income Proof: Salary Slips (Last 3 mos) or ITR (Last 2 yrs)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Eligibility Criteria */}
                        <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 shadow-sm space-y-6">
                            <div className="flex items-center space-x-3 text-[#111111] font-display">
                                <div className="p-3 bg-white border border-[#E5E7EB] rounded-full text-[#D4A63F]">
                                    <FaUserCheck className="text-lg" />
                                </div>
                                <h3 className="text-2xl font-bold">Eligibility Criteria</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#111111] rounded-full flex-shrink-0" />
                                    <span>Age: 21 to 65 years at loan maturity</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#111111] rounded-full flex-shrink-0" />
                                    <span>Employment: Salaried or Self-Employed / Business</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#111111] rounded-full flex-shrink-0" />
                                    <span>Minimum Net Income: ₹15,000 / month</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-gray-700 font-semibold font-sans">
                                    <div className="w-2.5 h-2.5 bg-[#111111] rounded-full flex-shrink-0" />
                                    <span>Work Continuity: Min. 1 yr current employment or 2 yrs business</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Frequently Asked Questions (FAQs) */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-1 font-sans">Got Questions?</span>
                            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-[#E5E7EB] rounded-2xl bg-[#FAFAF8] overflow-hidden transition-all shadow-sm"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full py-4 px-6 text-left font-bold text-neutral-900 flex justify-between items-center focus:outline-none font-display text-sm sm:text-base"
                                    >
                                        <span>{faq.question}</span>
                                        <div className="text-[#D4A63F] ml-4 flex-shrink-0">
                                            {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </button>

                                    {openFaq === index && (
                                        <div className="px-6 pb-4 pt-1 text-gray-600 text-sm font-medium font-sans border-t border-[#E5E7EB]/60">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
