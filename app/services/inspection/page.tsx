'use client';

import { useState } from 'react';
import { FaWrench, FaFileAlt, FaClock, FaCheckCircle, FaCar, FaPaperPlane } from 'react-icons/fa';
import { bookingsApi } from '@/lib/api';
import { toast } from 'react-toastify';

export default function InspectionPage() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        regNo: '',
        make: '',
        model: '',
        preferredDate: '',
        preferredTimeSlot: '',
        message: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'regNo') {
            const formatted = value.toUpperCase().replace(/\s+/g, '');
            setFormData(prev => ({ ...prev, [name]: formatted }));
        } else if (name === 'customerPhone') {
            const numbers = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numbers }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.customerPhone.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        // Validate registration number format
        const regNoPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
        if (formData.regNo && !regNoPattern.test(formData.regNo)) {
            toast.error('Please enter a valid registration number (e.g., MP09CD1234)');
            return;
        }

        setSubmitting(true);
        try {
            await bookingsApi.create({
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                bookingType: 'third_party_inspection',
                preferredDate: formData.preferredDate,
                preferredTimeSlot: formData.preferredTimeSlot,
                message: formData.message,
                externalVehicleDetails: {
                    regNo: formData.regNo,
                    make: formData.make,
                    model: formData.model,
                }
            });
            toast.success('Inspection booking submitted successfully!');
            setSuccess(true);
        } catch (error) {
            console.error('Error booking inspection:', error);
            toast.error('Failed to book inspection. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white py-16 flex items-center justify-center">
                <div className="max-w-md w-full px-6 text-center">
                    <div className="w-20 h-20 bg-[#D4A63F]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#D4A63F]">
                        <FaCheckCircle className="text-4xl" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 font-display">Booking Confirmed!</h1>
                    <p className="text-gray-500 mb-8 font-medium font-sans">
                        Your pre-purchase inspection request has been registered. Our expert inspector will contact you shortly to confirm the scheduled slot.
                    </p>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setFormData({
                                customerName: '',
                                customerPhone: '',
                                regNo: '',
                                make: '',
                                model: '',
                                preferredDate: '',
                                preferredTimeSlot: '',
                                message: '',
                            });
                        }}
                        className="btn-primary w-full py-3.5 rounded-full font-sans font-bold"
                    >
                        Book Another Inspection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">Services</span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 font-display tracking-tight">
                            Pre-Purchase <span className="text-[#D4A63F]">Vehicle Inspection</span>
                        </h1>
                        <p className="text-base text-gray-500 max-w-2xl mx-auto font-medium font-sans">
                            Avoid costly surprises. Get a certified 140+ point physical evaluation, digital diagnostics check, and RTO status verification for any used vehicle in Indore.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Booking Form Section */}
                        <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm h-fit">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-display">Schedule Your Inspection</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Your Name *</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            placeholder="Full name"
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            placeholder="10-digit number"
                                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-[#E5E7EB] pt-4 mt-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 font-sans">Vehicle Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Reg Number *</label>
                                            <input
                                                type="text"
                                                name="regNo"
                                                value={formData.regNo}
                                                onChange={handleInputChange}
                                                placeholder="e.g. MP09CD1234"
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm uppercase font-sans"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Brand (Make) *</label>
                                            <input
                                                type="text"
                                                name="make"
                                                value={formData.make}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Maruti, Honda"
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Model Name *</label>
                                            <input
                                                type="text"
                                                name="model"
                                                value={formData.model}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Swift, City"
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#E5E7EB] pt-4 mt-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 font-sans">Appointment Slot</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Preferred Date *</label>
                                            <input
                                                type="date"
                                                name="preferredDate"
                                                value={formData.preferredDate}
                                                onChange={handleInputChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Time Slot *</label>
                                            <select
                                                name="preferredTimeSlot"
                                                value={formData.preferredTimeSlot}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans cursor-pointer"
                                                required
                                            >
                                                <option value="">Select Time Slot</option>
                                                <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                                                <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                                                <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">Special Instructions (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Add vehicle location address or notes for the inspector..."
                                        className="w-full px-5 py-3 border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-sm font-sans min-h-[80px]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full btn-primary py-4 rounded-full flex items-center justify-center space-x-2 text-base font-sans font-bold shadow-none"
                                >
                                    <FaPaperPlane className="text-xs" />
                                    <span>{submitting ? 'Booking Appointment...' : 'Schedule Doorstep Inspection'}</span>
                                </button>
                            </form>
                        </div>

                        {/* Features & Details Section */}
                        <div className="space-y-8">
                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-display">What's Covered in Our Check?</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm flex-shrink-0">
                                            <FaCar className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">Engine &amp; Performance Check</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">OBD scan diagnostics, oil quality assessment, coolant check, exhaust verification, and engine mount inspection.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm flex-shrink-0">
                                            <FaWrench className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">Exterior Body &amp; Paint Depth</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Paint depth gauge test to detect repainted panels, frame alignment issues, accident repairs, and body rust check.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm flex-shrink-0">
                                            <FaFileAlt className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">RTO Documentation &amp; History</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Verify blacklists, RTO hypothecation status, active loan/insurance records, owner history, and chassis number validation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white border border-[#E5E7EB] p-3 rounded-full text-[#D4A63F] shadow-sm flex-shrink-0">
                                            <FaClock className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 mb-1 font-display">Suspension &amp; Test Drive</h3>
                                            <p className="text-gray-500 text-sm font-medium font-sans">Inspector road-test evaluating steering feedback, brake efficiency, suspension stiffness, and transmission smoothness.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 text-neutral-900 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4 font-display">Instant Digital Report</h2>
                                <p className="text-sm text-gray-500 leading-relaxed font-sans mb-4">
                                    Within 2 hours of the physical evaluation, get a comprehensive PDF inspection report containing:
                                </p>
                                <ul className="space-y-3 font-sans text-sm text-gray-700 font-semibold">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#D4A63F] rounded-full" />
                                        <span>Full HPI &amp; RTO history report</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#D4A63F] rounded-full" />
                                        <span>Diagnostics code readout log</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#D4A63F] rounded-full" />
                                        <span>High-resolution photos of defect areas</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#D4A63F] rounded-full" />
                                        <span>Fair-value pricing recommendation</span>
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
