/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { sellerInquiriesApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { FaCar, FaUpload, FaCheckCircle, FaSpinner, FaMotorcycle, FaTruck } from 'react-icons/fa';

export default function SellVehiclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [vehicleDetails, setVehicleDetails] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        regNo: '',
        kmDriven: '',
        demand: '',
        type: 'car'
    });

    const [photos, setPhotos] = useState<File[]>([]);
    const [rcCard, setRcCard] = useState<File | null>(null);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [rcCardPreview, setRcCardPreview] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'regNo') {
            // Auto-uppercase and remove spaces
            const formatted = value.toUpperCase().replace(/\s+/g, '');
            setFormData(prev => ({ ...prev, [name]: formatted }));
        } else if (name === 'phone') {
            // Only allow numbers, max 10 digits
            const numbers = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numbers }));
        } else if (name === 'kmDriven' || name === 'demand') {
            // Only allow numbers
            const numbers = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numbers }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'photo' | 'rcCard') => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (type === 'photo') {
                const newPhotos = Array.from(files).slice(0, 5 - photos.length); // Limit to 5 total
                const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
                setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
                setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
            } else {
                setRcCard(files[0]);
                setRcCardPreview(URL.createObjectURL(files[0]));
            }
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.phone || !formData.regNo || !formData.kmDriven || !formData.demand) {
            toast.error('Please fill all required fields');
            return;
        }

        if (formData.phone.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        // Validate reg no format (e.g., MP09CD1234)
        const regNoPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
        if (!regNoPattern.test(formData.regNo)) {
            toast.error('Please enter a valid registration number (e.g., MP09CD1234)');
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('regNo', formData.regNo);
            formDataToSend.append('kmDriven', formData.kmDriven);
            formDataToSend.append('demand', formData.demand);

            photos.forEach((photo) => {
                formDataToSend.append('photo', photo);
            });
            if (rcCard) {
                formDataToSend.append('rcCard', rcCard);
            }

            const response = await sellerInquiriesApi.create(formDataToSend);

            if (response.data.success) {
                setSuccess(true);
                setVehicleDetails(response.data.data);
                toast.success('Your inquiry has been submitted successfully!');
            }
        } catch (error: unknown) {
            console.error('Error submitting inquiry:', error);
            const err = error as any;
            toast.error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success && vehicleDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-4xl text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Inquiry Submitted Successfully!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for submitting your vehicle details. Our team will contact you shortly.
                        </p>

                        {vehicleDetails.make && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details Found</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Make:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.make}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Model:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.modelName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Variant:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.variantName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Year:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.year}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Fuel Type:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.fuelType}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Owner Count:</span>
                                        <span className="ml-2 font-medium text-gray-900">{vehicleDetails.ownerCount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/')}
                                className="btn-primary"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({ name: '', phone: '', regNo: '', kmDriven: '', demand: '', type: 'car' });
                                    setPhotos([]);
                                    setRcCard(null);
                                    setPhotoPreviews([]);
                                    setRcCardPreview('');
                                }}
                                className="btn-outline"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <FaCar className="text-3xl text-red-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Sell Your <span className="text-red-600">Vehicle</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Get the best price for your car, bike, or commercial vehicle. Fill in the details below and we&apos;ll get back to you.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="space-y-6">
                        {/* Vehicle Type Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Vehicle Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xs mx-auto sm:max-w-none sm:mx-0">
                                {[
                                    { value: 'car', label: 'Car'},
                                    { value: 'bike', label: 'Bike'},
                                    { value: 'commercial', label: 'Commercial'}
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                        className={`flex flex-col items-center justify-center p-2 sm:p-4 border-2 rounded-xl transition-all ${formData.type === type.value
                                            ? 'border-red-600 bg-red-50 text-red-600 shadow-md scale-105'
                                            : 'border-gray-100 hover:border-red-200 text-gray-500'
                                            }`}
                                    >
                                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{type.icon}</div>
                                        <span className="text-xs sm:text-sm font-bold">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter 10-digit mobile number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Vehicle Reg No */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Vehicle Registration No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="regNo"
                                value={formData.regNo}
                                onChange={handleInputChange}
                                placeholder="e.g., MP09CD1234"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors uppercase"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter in capital letters without spaces (e.g., MP09CD1234)</p>
                        </div>

                        {/* KM Driven */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                KM Driven <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="kmDriven"
                                value={formData.kmDriven}
                                onChange={handleInputChange}
                                placeholder="Enter total kilometers driven"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Demand */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Expected Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="demand"
                                value={formData.demand}
                                onChange={handleInputChange}
                                placeholder="Enter your expected price"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Upload Photo (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Vehicle Photos <span className="text-gray-400">(Optional, max 5)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e, 'photo')}
                                    className="hidden"
                                    id="photo-upload"
                                    disabled={photos.length >= 5}
                                />
                                {photoPreviews.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-3">
                                            {photoPreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={preview} alt={`Vehicle ${index + 1}`} className="h-24 w-full object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {photos.length < 5 && (
                                            <label
                                                htmlFor="photo-upload"
                                                className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                                            >
                                                <div className="text-center">
                                                    <FaUpload className="mx-auto text-xl text-gray-400 mb-1" />
                                                    <span className="text-gray-500 text-sm">Add more photos ({5 - photos.length} remaining)</span>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="photo-upload"
                                        className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                                    >
                                        <div className="text-center">
                                            <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                                            <span className="text-gray-500">Click to upload vehicle photos (up to 5)</span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Upload RC Card (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload RC Card <span className="text-gray-400">(Optional)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'rcCard')}
                                    className="hidden"
                                    id="rc-upload"
                                />
                                <label
                                    htmlFor="rc-upload"
                                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                                >
                                    {rcCardPreview ? (
                                        <img src={rcCardPreview} alt="RC Card" className="h-32 object-contain rounded" />
                                    ) : (
                                        <div className="text-center">
                                            <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                                            <span className="text-gray-500">Click to upload RC card</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit Inquiry</span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>We value your privacy. Your information is safe with us.</p>
                </div>
            </div>
        </div>
    );
}
