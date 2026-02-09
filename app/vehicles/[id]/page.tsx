'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { vehiclesApi, bookingsApi, formatPrice, getImageUrl } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import EMICalculator from '@/components/ui/EMICalculator';
import { FaArrowLeft, FaCalendar, FaGasPump, FaCog, FaTachometerAlt, FaCheckCircle, FaPaperPlane, FaTimes, FaChevronLeft, FaChevronRight, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const response = await vehiclesApi.getById(params.id);
    const vehicle = response.data.data;
    
    return createMetadata(
      vehicle.title,
      `${vehicle.title} - ${vehicle.year} ${vehicle.brand} ${vehicle.model}. ${vehicle.fuelType} transmission, ${vehicle.mileage}. Best price in Indore.`,
      `/vehicles/${params.id}`
    );
  } catch (error) {
    return createMetadata('Vehicle Details', 'Find detailed information about this quality used vehicle in Indore.');
  }
}

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
    });
    const [submitting, setSubmitting] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle) return;

        setSubmitting(true);
        try {
            await bookingsApi.create({
                ...formData,
                vehicle: vehicle._id,
            });
            toast.success('Booking request submitted successfully!');
            setFormData({ customerName: '', customerPhone: '', offeredPrice: '', message: '' });
        } catch (error) {
            console.error('Error submitting booking:', error);
            toast.error('Failed to submit booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vehicle not found</h2>
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Back Button */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                            {vehicle.type === 'car' ? <FaCar className="text-blue-600" /> : vehicle.type === 'bike' ? <FaMotorcycle className="text-orange-600" /> : <FaTruck className="text-gray-800" />}
                            <span className="capitalize">{vehicle.type}</span>
                        </div>
                        <span className={`badge ${vehicle.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Mobile Title & Price - Only visible on mobile */}
                    <div className="lg:hidden">
                        <div className="card p-5 space-y-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{vehicle.title}</h1>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-green-600">
                                        {formatPrice(vehicle.price)}
                                    </span>
                                    {vehicle.originalPrice > vehicle.price && (
                                        <span className="text-sm sm:text-base text-red-500 line-through">
                                            {formatPrice(vehicle.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Main Image */}
                        <div className="card overflow-hidden">
                            <div
                                className="relative h-80 bg-gray-100 cursor-pointer group"
                                onClick={() => openLightbox(selectedImage)}
                            >
                                <Image
                                    src={images[selectedImage]}
                                    alt={vehicle.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-car.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 bg-black/50 px-4 py-2 rounded-full text-sm font-medium transition-opacity">
                                        Click to Expand
                                    </span>
                                </div>
                                {vehicle.discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-lg font-semibold shadow-lg z-10">
                                        {vehicle.discount}% OFF
                                    </div>
                                )}

                                {/* Navigation Arrows for Main Image */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft size={15} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight size={15} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-6 gap-2 p-2 bg-white">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-16 rounded overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-primary-600' : 'border-gray-200'
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
                        <div className="card p-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
                                <div>
                                    <p className="text-xs text-gray-500">Brand</p>
                                    <p className="font-medium text-gray-900">{vehicle.brand}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Model</p>
                                    <p className="font-medium text-gray-900">{vehicle.model}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Year</p>
                                    <p className="font-medium text-gray-900">{vehicle.year}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fuel</p>
                                    <p className="font-medium text-gray-900 capitalize">{vehicle.fuelType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Transmission</p>
                                    <p className="font-medium text-gray-900">{vehicle.transmission}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">KM Driven</p>
                                    <p className="font-medium text-gray-900">{vehicle.mileage}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Owners</p>
                                    <p className="font-medium text-gray-900">{vehicle.ownerCount || 1}st Owner</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Type</p>
                                    <p className="font-medium text-gray-900 capitalize">{vehicle.type}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description & Features Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card p-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">{vehicle.description}</p>
                            </div>
                            {vehicle.features && vehicle.features.length > 0 && (
                                <div className="card p-4">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {vehicle.features.slice(0, 6).map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-gray-700 text-sm">
                                                <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
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
                        <div className="card p-5 sticky top-20 space-y-5">
                            {/* Desktop Title & Price - Only visible on desktop */}
                            <div className="hidden lg:block">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{vehicle.title}</h1>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-green-600">
                                        {formatPrice(vehicle.price)}
                                    </span>
                                    {vehicle.originalPrice > vehicle.price && (
                                        <span className="text-base text-red-500 line-through">
                                            {formatPrice(vehicle.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Now</h3>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="input py-2 text-sm"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="5000"
                                            placeholder="Your Offered Price (₹)"
                                            className="input py-2 text-sm"
                                            value={formData.offeredPrice}
                                            onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="input py-2 text-sm"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Message (Optional)"
                                            className="input py-2 text-sm min-h-[80px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full py-2.5 flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <FaPaperPlane className="text-xs" />
                                        <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
                                    </button>
                                </form>
                            </div>

                            {/* EMI Calculator */}
                            <div className="pt-2">
                                <EMICalculator price={vehicle.price} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {isLightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={closeLightbox}>
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <FaTimes size={30} />
                        </button>

                        {/* Prev Button */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-3 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <FaChevronLeft size={40} />
                        </button>

                        {/* Image Container */}
                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[selectedImage]}
                                alt={vehicle.title}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />

                            {/* Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-4 py-1 rounded-full text-sm font-medium">
                                {selectedImage + 1} / {images.length}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 p-3 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <FaChevronRight size={40} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
