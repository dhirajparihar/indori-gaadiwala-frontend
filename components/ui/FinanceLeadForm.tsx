'use client';

import { useState } from 'react';
import { FaUser, FaPhoneAlt, FaCar, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { leadsApi } from '@/lib/api';

export default function FinanceLeadForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        loanAmount: '₹3L - ₹5L',
        vehicleChoice: 'Car',
        vehicleDetails: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const loanOptions = ['Below ₹3L', '₹3L - ₹5L', '₹5L - ₹10L', 'Above ₹10L'];
    const vehicleOptions = ['Car', 'Commercial', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        const cleanPhone = formData.phone.trim();
        if (!formData.name.trim()) {
            setErrorMsg('Please enter your full name.');
            return;
        }

        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            setErrorMsg('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        setLoading(true);

        try {
            const notes = `Loan: ${formData.loanAmount} | Vehicle: ${formData.vehicleChoice}${formData.vehicleDetails ? ` (${formData.vehicleDetails})` : ''}`;
            
            await leadsApi.create({
                name: formData.name.trim(),
                phone: cleanPhone,
                source: 'finance_page',
                notes: notes,
            });

            setSubmitted(true);
            toast.success('Finance application submitted! We will contact you soon.');
        } catch (error: any) {
            console.error('Finance lead submission error:', error);
            const msg = error.response?.data?.message || 'Failed to submit application. Please try again.';
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            phone: '',
            loanAmount: '₹3L - ₹5L',
            vehicleChoice: 'Car',
            vehicleDetails: '',
        });
        setSubmitted(false);
        setErrorMsg('');
    };

    if (submitted) {
        return (
            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 text-center shadow-sm space-y-6">
                <div className="w-16 h-16 bg-[#D4A63F]/10 text-[#D4A63F] border border-[#D4A63F]/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                    <FaCheckCircle />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-neutral-900 font-display">Application Received!</h3>
                    <p className="text-gray-600 text-sm font-medium mt-2 max-w-md mx-auto">
                        Thank you, <span className="font-bold text-neutral-900">{formData.name}</span>. Our dedicated finance team will get back to you at <span className="font-bold text-neutral-900">{formData.phone}</span> within 2 hours with customized loan offers.
                    </p>
                </div>
                <div className="pt-2">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2.5 text-sm font-bold text-neutral-900 bg-[#D4A63F] hover:bg-[#b88e32] rounded-xl transition-colors shadow-sm font-sans"
                    >
                        Submit Another Inquiry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
                <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-1">Instant Approval</span>
                <h3 className="text-2xl font-black text-neutral-900 font-display">Apply For Finance</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">
                    Fill out the quick form below to get instant loan quotes and personalized EMI plans.
                </p>
            </div>

            {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FaUser className="text-sm" />
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-neutral-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-[#D4A63F] focus:ring-1 focus:ring-[#D4A63F] transition-all"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FaPhoneAlt className="text-sm" />
                        </div>
                        <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-neutral-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-[#D4A63F] focus:ring-1 focus:ring-[#D4A63F] transition-all"
                        />
                    </div>
                </div>

                {/* Desired Loan Amount */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Desired Loan Amount
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {loanOptions.map((amount) => (
                            <button
                                type="button"
                                key={amount}
                                onClick={() => setFormData({ ...formData, loanAmount: amount })}
                                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                                    formData.loanAmount === amount
                                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                                        : 'bg-white text-gray-700 border-[#E5E7EB] hover:border-[#D4A63F]'
                                }`}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vehicle Choice */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Vehicle Choice
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {vehicleOptions.map((choice) => (
                            <button
                                type="button"
                                key={choice}
                                onClick={() => setFormData({ ...formData, vehicleChoice: choice })}
                                className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all text-center truncate ${
                                    formData.vehicleChoice === choice
                                        ? 'bg-[#D4A63F] text-neutral-900 border-[#D4A63F] shadow-sm'
                                        : 'bg-white text-gray-700 border-[#E5E7EB] hover:border-[#D4A63F]'
                                }`}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Additional Details */}
                <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                        Additional Details or Model <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FaCar className="text-sm" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Maruti Swift 2021 or Commercial Van"
                            value={formData.vehicleDetails}
                            onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-neutral-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-[#D4A63F] focus:ring-1 focus:ring-[#D4A63F] transition-all"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#D4A63F] hover:bg-[#b88e32] disabled:opacity-70 text-neutral-900 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin text-base" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Request Loan Call Back</span>
                            <FaPaperPlane className="text-xs" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
