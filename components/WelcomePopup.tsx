'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone } from 'react-icons/fa';
import { leadsApi } from '@/lib/api';

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
        } catch (error) {
            console.error('Error submitting form:', error);
            // Still close popup even if API fails
            localStorage.setItem('gaadiwala_popup_seen', 'true');
            setIsOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-80 shadow-2xl border border-gray-200 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                    aria-label="Close popup"
                >
                    <FaTimes />
                </button>

                {/* Header */}
                <div className="bg-blue-600 text-white p-3 text-center">
                    <h2 className="text-lg font-bold">Welcome!</h2>
                    <p className="text-blue-100 text-xs">Get personalized offers</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 text-sm rounded-lg transition-colors"
                    >
                        {submitting ? 'Submitting...' : 'Get Started'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full text-gray-500 hover:text-gray-700 text-xs py-1"
                    >
                        No thanks
                    </button>
                </form>
            </div>
        </div>
    );
}

