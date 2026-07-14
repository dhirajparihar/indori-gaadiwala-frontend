'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone } from 'react-icons/fa';
import { leadsApi } from '@/lib/api';
import { toast } from 'react-toastify';

interface WelcomePopupProps {
    onSubmit?: (data: { name: string; phone: string }) => void;
}

export default function WelcomePopup({ onSubmit }: WelcomePopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('gaadiwala_popup_seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('gaadiwala_popup_seen', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (!formData.phone.trim()) {
            toast.error('Please enter your phone number');
            return;
        }

        // Validate phone number (10 digits)
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phonePattern.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9');
            return;
        }

        setSubmitting(true);

        try {
            // Save to database
            await leadsApi.create(formData);
            console.log('✅ Lead saved to database');

            if (onSubmit) {
                onSubmit(formData);
            }
            localStorage.setItem('gaadiwala_popup_seen', 'true');
            localStorage.setItem('gaadiwala_user', JSON.stringify(formData));
            setIsOpen(false);
            toast.success('Welcome! We\'ll be in touch soon.');
        } catch (error: unknown) {
            console.error('Error submitting form:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to submit. Please try again.';
            toast.error(errorMessage);
            // Still close popup even if API fails
            localStorage.setItem('gaadiwala_popup_seen', 'true');
            setIsOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-80 border border-[#E4E4E7] overflow-hidden relative shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
                    aria-label="Close popup"
                >
                    <FaTimes />
                </button>

                {/* Header */}
                <div className="bg-black text-white p-6 text-center">
                    <h2 className="text-xl font-bold tracking-tight font-display">Welcome</h2>
                    <p className="text-neutral-400 text-xs mt-1">Get personalized offers</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E4E4E7] rounded-full focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            required
                            value={formData.phone}
                            onChange={(e) => {
                                const numbers = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: numbers });
                            }}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E4E4E7] rounded-full focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full btn-primary py-2.5 text-sm"
                    >
                        {submitting ? 'Submitting...' : 'Get Started'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full text-gray-500 hover:text-black text-xs py-1 transition-colors"
                    >
                        No thanks
                    </button>
                </form>
            </div>
        </div>
    );
}

