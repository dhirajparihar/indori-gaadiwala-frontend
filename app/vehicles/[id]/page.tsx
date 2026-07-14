'use client';

import { useEffect, useState, useRef, TouchEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { vehiclesApi, bookingsApi, formatPrice, getImageUrl } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import EMICalculator from '@/components/ui/EMICalculator';
import { FaArrowLeft, FaCalendar, FaGasPump, FaCog, FaTachometerAlt, FaCheckCircle, FaPaperPlane, FaTimes, FaChevronLeft, FaChevronRight, FaCar, FaMotorcycle, FaTruck, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function VehicleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        offeredPrice: '',
        message: '',
        preferredDate: '',
        preferredTimeSlot: ''
    });
    const [activeTab, setActiveTab] = useState<'inquiry' | 'test_drive'>('inquiry');
    const [submitting, setSubmitting] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const lightboxRef = useRef<HTMLDivElement>(null);

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (vehicle && vehicle.images && vehicle.images.length > 0) {
            setSelectedImage((prev) => (prev + 1) % vehicle.images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (vehicle && vehicle.images && vehicle.images.length > 0) {
            setSelectedImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
        }
    };

    // Touch gesture handlers for mobile swipe
    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };

    // key press support for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

    useEffect(() => {
        if (params.id) {
            loadVehicle(params.id as string);
        }
    }, [params.id]);

    const loadVehicle = async (id: string) => {
        try {
            const response = await vehiclesApi.getById(id);
            setVehicle(response.data.data);
        } catch (error) {
            console.error('Error loading vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!vehicle) return;
        const shareData = {
            title: vehicle.title,
            text: `Check out this ${vehicle.title} on Indori Gaadiwala!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;

        // Validation
        if (!formData.customerName.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (formData.customerName.trim().length < 2) {
            toast.error('Name must be at least 2 characters');
            return;
        }

        if (!formData.customerPhone.trim()) {
            toast.error('Please enter your phone number');
            return;
        }

        // Validate phone number (10 digits)
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phonePattern.test(formData.customerPhone)) {
            toast.error('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9');
            return;
        }

        const isTestDrive = activeTab === 'test_drive';

        // Additional validation for test drive
        if (isTestDrive) {
            if (!formData.preferredDate) {
                toast.error('Please select a preferred date');
                return;
            }
            if (!formData.preferredTimeSlot) {
                toast.error('Please select a preferred time slot');
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload: any = {
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                message: formData.message,
                bookingType: activeTab,
                vehicle: vehicle._id,
            };

            if (isTestDrive) {
                payload.preferredDate = formData.preferredDate;
                payload.preferredTimeSlot = formData.preferredTimeSlot;
            } else if (formData.offeredPrice) {
                payload.offeredPrice = Number(formData.offeredPrice);
            }

            await bookingsApi.create(payload);
            toast.success(isTestDrive ? 'Test drive request submitted successfully!' : 'Inquiry request submitted successfully!');
            setFormData({ customerName: '', customerPhone: '', offeredPrice: '', message: '', preferredDate: '', preferredTimeSlot: '' });
        } catch (error) {
            console.error('Error submitting booking:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A63F]"></div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Vehicle not found</h2>
                <button onClick={() => router.push('/vehicles')} className="btn-primary">
                    Back to Vehicles
                </button>
            </div>
        );
    }

    const images = vehicle.images && vehicle.images.length > 0
        ? vehicle.images.map(img => getImageUrl(img))
        : ['/placeholder-car.jpg'];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-600 hover:text-black font-semibold transition-colors font-sans text-sm"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 text-gray-600 hover:text-[#D4A63F] transition-colors p-2 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] shadow-sm"
                            title="Share Vehicle"
                        >
                            <FaShareAlt />
                        </button>
                        <div className="flex items-center space-x-2 text-gray-600 font-bold bg-[#FAFAF8] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm font-sans text-xs uppercase tracking-wide">
                            {vehicle.type === 'car' ? <FaCar className="text-[#D4A63F]" /> : vehicle.type === 'bike' ? <FaMotorcycle className="text-[#D4A63F]" /> : <FaTruck className="text-[#D4A63F]" />}
                            <span>{vehicle.type}</span>
                        </div>
                        <span className={`badge ${vehicle.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                            {vehicle.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mobile Title & Price - Only visible on mobile */}
                    <div className="lg:hidden">
                        <div className="card p-6 space-y-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight font-display">{vehicle.title}</h1>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl sm:text-3xl font-black text-black font-display">
                                        {formatPrice(vehicle.price)}
                                    </span>
                                    {vehicle.originalPrice > vehicle.price && (
                                        <span className="text-sm sm:text-base text-gray-400 line-through font-display font-medium font-sans">
                                            {formatPrice(vehicle.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image */}
                        <div className="card overflow-hidden">
                            <div
                                className="relative h-64 sm:h-80 md:h-[450px] bg-[#FAFAF8] cursor-pointer group"
                                onClick={() => openLightbox(selectedImage)}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <Image
                                    src={images[selectedImage]}
                                    alt={vehicle.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-car.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 bg-black/50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity shadow-lg">
                                        Click to Expand
                                    </span>
                                </div>
                                {vehicle.discount > 0 && (
                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#D4A63F] text-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-extrabold z-10 uppercase shadow-md">
                                        {vehicle.discount}% OFF
                                    </div>
                                )}

                                {/* Navigation Arrows for Main Image */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-md"
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft size={14} className="sm:hidden" />
                                            <FaChevronLeft size={16} className="hidden sm:block" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-md"
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight size={14} className="sm:hidden" />
                                            <FaChevronRight size={16} className="hidden sm:block" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 sm:gap-2.5 sm:p-3 bg-white border-t border-[#E5E7EB]">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === index ? 'border-[#D4A63F]' : 'border-[#E5E7EB]'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Specifications Card */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-[#E5E7EB] pb-3 font-display">Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Brand</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.brand}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Model</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.model}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Year</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.year}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Fuel</p>
                                    <p className="font-bold text-gray-900 capitalize text-sm mt-1 font-sans">{vehicle.fuelType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Transmission</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.transmission}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">KM Driven</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.mileage}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Owners</p>
                                    <p className="font-bold text-gray-900 text-sm mt-1 font-sans">{vehicle.ownerCount || 1} Owner(s)</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-sans">Type</p>
                                    <p className="font-bold text-gray-900 capitalize text-sm mt-1 font-sans">{vehicle.type}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description & Features Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="card p-6">
                                <h2 className="text-xl font-bold text-[#111111] mb-3 font-display">Description</h2>
                                <p className="text-gray-500 text-sm leading-relaxed font-sans">{vehicle.description}</p>
                            </div>
                            {vehicle.features && vehicle.features.length > 0 && (
                                <div className="card p-6">
                                    <h2 className="text-xl font-bold text-[#111111] mb-3 font-display">Features</h2>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {vehicle.features.slice(0, 6).map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2.5 text-gray-500 text-sm font-sans">
                                                <FaCheckCircle className="text-[#D4A63F] flex-shrink-0 text-sm" />
                                                <span className="truncate">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Title, Price & Form */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24 space-y-6 bg-white">
                            {/* Desktop Title & Price - Only visible on desktop */}
                            <div className="hidden lg:block border-b border-[#E5E7EB] pb-5">
                                <h1 className="text-2xl font-black text-gray-900 mb-3 leading-tight font-display">{vehicle.title}</h1>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-black text-black font-display">
                                        {formatPrice(vehicle.price)}
                                    </span>
                                    {vehicle.originalPrice > vehicle.price && (
                                        <span className="text-base text-gray-400 line-through font-display font-medium font-sans">
                                            {formatPrice(vehicle.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                {/* Tab selector */}
                                <div className="flex border-b border-[#E5E7EB] mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('inquiry')}
                                        className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all font-sans ${
                                            activeTab === 'inquiry'
                                                ? 'border-[#D4A63F] text-[#D4A63F]'
                                                : 'border-transparent text-gray-400 hover:text-gray-900'
                                        }`}
                                    >
                                        Make Offer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('test_drive')}
                                        className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all font-sans ${
                                            activeTab === 'test_drive'
                                                ? 'border-[#D4A63F] text-[#D4A63F]'
                                                : 'border-transparent text-gray-400 hover:text-gray-900'
                                        }`}
                                    >
                                        Book Test Drive
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="input py-3 text-sm font-sans"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="input py-3 text-sm font-sans"
                                            value={formData.customerPhone}
                                            onChange={(e) => {
                                                const numbers = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, customerPhone: numbers });
                                            }}
                                            required
                                        />
                                    </div>

                                    {activeTab === 'inquiry' ? (
                                        <div>
                                            <input
                                                type="number"
                                                step="5000"
                                                placeholder="Your Offered Price (₹) (Optional)"
                                                className="input py-3 text-sm font-sans"
                                                value={formData.offeredPrice}
                                                onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">
                                                    Preferred Date
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs font-sans"
                                                    value={formData.preferredDate}
                                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">
                                                    Preferred Time Slot
                                                </label>
                                                <select
                                                    required
                                                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4A63F] focus:border-[#D4A63F] transition-colors bg-white text-xs font-sans cursor-pointer"
                                                    value={formData.preferredTimeSlot}
                                                    onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                                                >
                                                    <option value="">Select Time Slot</option>
                                                    <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                                                    <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                                                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <textarea
                                            placeholder={activeTab === 'inquiry' ? "Message (Optional)" : "Special instructions or notes for test drive (Optional)"}
                                            className="input py-3 text-sm min-h-[90px] rounded-2xl font-sans"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full py-3.5 flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <FaPaperPlane className="text-xs" />
                                        <span>
                                            {submitting 
                                                ? 'Submitting...' 
                                                : activeTab === 'inquiry' 
                                                    ? 'Send Offer / Inquiry' 
                                                    : 'Book Test Drive slot'}
                                        </span>
                                    </button>
                                </form>
                            </div>

                            {/* EMI Calculator */}
                            <div className="pt-4 border-t border-[#E5E7EB]">
                                <EMICalculator price={vehicle.price} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {isLightboxOpen && (
                    <div 
                        ref={lightboxRef}
                        className="fixed inset-0 z-55 bg-black/95 flex items-center justify-center backdrop-blur-sm"
                        onClick={closeLightbox}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white z-50 p-2 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <FaTimes size={24} className="sm:hidden" />
                            <FaTimes size={30} className="hidden sm:block" />
                        </button>

                        {/* Prev Button */}
                        <button
                            onClick={prevImage}
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-2 sm:p-3 rounded-full hover:bg-white/10 transition-colors bg-black/20 sm:bg-transparent"
                        >
                            <FaChevronLeft size={28} className="sm:hidden" />
                            <FaChevronLeft size={40} className="hidden sm:block" />
                        </button>

                        {/* Image Container */}
                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-2 sm:mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[selectedImage]}
                                alt={vehicle.title}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />

                            {/* Counter */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                {selectedImage + 1} / {images.length}
                            </div>
                            
                            {/* Swipe hint for mobile */}
                            <div className="absolute bottom-16 sm:hidden text-white/50 text-xs font-medium animate-pulse">
                                Swipe to navigate
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextImage}
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-2 sm:p-3 rounded-full hover:bg-white/10 transition-colors bg-black/20 sm:bg-transparent"
                        >
                            <FaChevronRight size={28} className="sm:hidden" />
                            <FaChevronRight size={40} className="hidden sm:block" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
