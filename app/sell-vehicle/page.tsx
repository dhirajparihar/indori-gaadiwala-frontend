/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { sellerInquiriesApi } from '@/lib/api';
import { toast } from 'react-toastify';
import { FaCar, FaUpload, FaCheckCircle, FaSpinner, FaMotorcycle, FaTruck } from 'react-icons/fa';
import { compressImage } from '@/lib/imageCompressor';

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
        type: 'car',
        inspectionDate: '',
        inspectionTimeSlot: '',
        inspectionLocation: ''
    });

    const [photos, setPhotos] = useState<File[]>([]);
    const [rcCard, setRcCard] = useState<File | null>(null);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [rcCardPreview, setRcCardPreview] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

            if (formData.inspectionDate) {
                formDataToSend.append('inspectionDate', formData.inspectionDate);
                formDataToSend.append('inspectionTimeSlot', formData.inspectionTimeSlot);
                formDataToSend.append('inspectionLocation', formData.inspectionLocation);
            }

            // Compress and append photos
            const compressedPhotos = await Promise.all(photos.map(photo => compressImage(photo)));
            compressedPhotos.forEach((photo) => {
                formDataToSend.append('photo', photo);
            });
            
            // Compress and append RC Card
            if (rcCard) {
                const compressedRc = await compressImage(rcCard);
                formDataToSend.append('rcCard', compressedRc);
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
            <div className="min-h-screen bg-white py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-8 text-center shadow-sm">
                        <div className="w-20 h-20 bg-[#D4A63F]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#D4A63F]">
                            <FaCheckCircle className="text-4xl" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4 font-display">Inquiry Submitted Successfully!</h1>
                        {vehicleDetails.inspectionDate ? (
                            <p className="text-gray-500 mb-8 font-medium font-sans">
                                Thank you! Your vehicle details have been submitted and your valuation inspection is scheduled for <span className="font-extrabold text-[#D4A63F]">{new Date(vehicleDetails.inspectionDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> at <span className="font-extrabold text-[#D4A63F]">{vehicleDetails.inspectionTimeSlot}</span>.
                            </p>
                        ) : (
                            <p className="text-gray-500 mb-8 font-medium font-sans">
                                Thank you for submitting your vehicle details. Our team will contact you shortly.
                            </p>
                        )}

                        {vehicleDetails.make && (
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 mb-8 text-left shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">Vehicle Details Found</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                                    <div>
                                        <span className="text-gray-550">Make:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.make}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-550">Model:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.modelName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-550">Variant:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.variantName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-550">Year:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.year}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-550">Fuel Type:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.fuelType}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-550">Owner Count:</span>
                                        <span className="ml-2 font-bold text-gray-900">{vehicleDetails.ownerCount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/')}
                                className="btn-primary px-8 py-3.5"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({ name: '', phone: '', regNo: '', kmDriven: '', demand: '', type: 'car', inspectionDate: '', inspectionTimeSlot: '', inspectionLocation: '' });
                                    setPhotos([]);
                                    setRcCard(null);
                                    setPhotoPreviews([]);
                                    setRcCardPreview('');
                                }}
                                className="btn-secondary px-8 py-3.5"
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
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAFAF8] rounded-full mb-4 border border-[#E5E7EB] text-[#D4A63F]">
                        <FaCar className="text-2xl" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3 font-display tracking-tight">
                        Sell Your Vehicle
                    </h1>
                    <p className="text-gray-500 text-base font-medium font-sans">
                        Get the best price for your car, bike, or commercial vehicle. Fill in the details below and we&apos;ll get back to you.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-sm">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Vehicle Type Selection */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 sm:mb-3 tracking-widest font-sans">
                                Select Vehicle Type <span className="text-[#D4A63F]">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {[
                                    { value: 'car', label: 'Car'},
                                    { value: 'bike', label: 'Bike'},
                                    { value: 'commercial', label: 'Commercial'}
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                        className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-2 sm:px-4 border rounded-full transition-all text-[10px] sm:text-xs font-extrabold font-sans uppercase tracking-wider ${
                                            formData.type === type.value
                                                ? 'border-[#D4A63F] bg-[#111111] text-[#D4A63F]'
                                                : 'border-[#E5E7EB] bg-white hover:border-[#D4A63F] text-gray-500'
                                        }`}
                                    >
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Name */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Your Name <span className="text-[#D4A63F]">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                required
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Mobile Number <span className="text-[#D4A63F]">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter 10-digit mobile number"
                                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                required
                            />
                        </div>

                        {/* Vehicle Reg No */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Vehicle Registration No. <span className="text-[#D4A63F]">*</span>
                            </label>
                            <input
                                type="text"
                                name="regNo"
                                value={formData.regNo}
                                onChange={handleInputChange}
                                placeholder="e.g., MP09CD1234"
                                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm uppercase font-sans"
                                required
                            />
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 ml-2 sm:ml-3 font-semibold font-sans tracking-wide">Enter in capital letters without spaces (e.g., MP09CD1234)</p>
                        </div>

                        {/* KM Driven */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                KM Driven <span className="text-[#D4A63F]">*</span>
                            </label>
                            <input
                                type="text"
                                name="kmDriven"
                                value={formData.kmDriven}
                                onChange={handleInputChange}
                                placeholder="Enter total kilometers driven"
                                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                required
                            />
                        </div>

                        {/* Demand */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Expected Price (₹) <span className="text-[#D4A63F]">*</span>
                            </label>
                            <input
                                type="text"
                                name="demand"
                                value={formData.demand}
                                onChange={handleInputChange}
                                placeholder="Enter your expected price"
                                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                required
                            />
                        </div>

                        {/* Upload Photo (Optional) */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Upload Vehicle Photos <span className="text-gray-450 lowercase font-medium font-sans">(Optional, max 5)</span>
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
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {photoPreviews.map((preview, index) => (
                                                <div key={index} className="relative group rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
                                                    <img src={preview} alt={`Vehicle ${index + 1}`} className="h-20 sm:h-24 w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-1.5 right-1.5 bg-[#111111] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs opacity-90 hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {photos.length < 5 && (
                                            <label
                                                htmlFor="photo-upload"
                                                className="flex items-center justify-center w-full px-3 sm:px-4 py-3 sm:py-4 border border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-[#D4A63F] hover:bg-white bg-white transition-colors"
                                            >
                                                <div className="text-center font-sans">
                                                    <FaUpload className="mx-auto text-base sm:text-lg text-gray-400 mb-1" />
                                                    <span className="text-gray-500 text-[10px] sm:text-xs font-semibold">Add more photos ({5 - photos.length} remaining)</span>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="photo-upload"
                                        className="flex items-center justify-center w-full px-3 sm:px-4 py-6 sm:py-8 border border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-[#D4A63F] hover:bg-white bg-white transition-colors"
                                    >
                                        <div className="text-center text-gray-500 font-sans">
                                            <FaUpload className="mx-auto text-lg sm:text-xl text-gray-400 mb-2" />
                                            <span className="text-xs sm:text-sm font-semibold">Click to upload vehicle photos (up to 5)</span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Upload RC Card (Optional) */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                Upload RC Card <span className="text-gray-450 lowercase font-medium font-sans">(Optional)</span>
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
                                    className="flex items-center justify-center w-full px-3 sm:px-4 py-6 sm:py-8 border border-dashed border-[#E5E7EB] rounded-2xl cursor-pointer hover:border-[#D4A63F] hover:bg-white bg-white transition-colors"
                                >
                                    {rcCardPreview ? (
                                        <img src={rcCardPreview} alt="RC Card" className="h-24 sm:h-32 object-contain rounded" />
                                    ) : (
                                        <div className="text-center text-gray-500 font-sans">
                                            <FaUpload className="mx-auto text-lg sm:text-xl text-gray-400 mb-2" />
                                            <span className="text-xs sm:text-sm font-semibold">Click to upload RC card</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Inspection Scheduling (Optional) */}
                        <div className="border-t border-[#E5E7EB] pt-4 sm:pt-6">
                            <h3 className="text-xs sm:text-sm font-bold text-[#111111] uppercase tracking-wider mb-3 sm:mb-4 font-sans">
                                Book Free Valuation &amp; Inspection (Optional)
                            </h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 font-sans">
                                Choose a convenient date and time slot for our certified inspector to evaluate your vehicle in Indore.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                        Preferred Date
                                    </label>
                                    <input
                                        type="date"
                                        name="inspectionDate"
                                        value={formData.inspectionDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                        Preferred Time Slot
                                    </label>
                                    <select
                                        name="inspectionTimeSlot"
                                        value={formData.inspectionTimeSlot}
                                        onChange={handleInputChange}
                                        className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans cursor-pointer appearance-none"
                                        disabled={!formData.inspectionDate}
                                    >
                                        <option value="">Select Time Slot</option>
                                        <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                                        <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                                        <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-[#111111] uppercase mb-2 tracking-widest font-sans">
                                    Inspection Location
                                </label>
                                <input
                                    type="text"
                                    name="inspectionLocation"
                                    value={formData.inspectionLocation}
                                    onChange={handleInputChange}
                                    placeholder="Enter address for doorstep evaluation in Indore"
                                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs sm:text-sm font-sans"
                                    disabled={!formData.inspectionDate}
                                    required={!!formData.inspectionDate}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 sm:py-4 rounded-full flex items-center justify-center space-x-2 text-sm sm:text-base shadow-none font-sans"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin text-[#D4A63F]" />
                                    <span>Submitting inquiry...</span>
                                </>
                            ) : (
                                <span>Submit Inquiry</span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info */}
                <div className="mt-8 text-center text-gray-500 text-sm font-sans">
                    <p>We value your privacy. Your information is safe with us.</p>
                </div>
            </div>
        </div>
    );
}
