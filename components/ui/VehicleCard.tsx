import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { formatPrice, getImageUrl } from '@/lib/api';
import { FaCalendar, FaGasPump, FaCog, FaTachometerAlt, FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const imageUrl = vehicle.images && vehicle.images.length > 0
        ? getImageUrl(vehicle.images[0])
        : '/placeholder-car.jpg';

    return (
        <Link href={`/vehicles/${vehicle._id}`}>
            <div className="card overflow-hidden group cursor-pointer h-full vehicle-card border-[#E5E7EB] hover:border-[#D4A63F] transition-all duration-300">
                {/* Image */}
                <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden bg-[#FAFAF8]">
                    <Image
                        src={imageUrl}
                        alt={vehicle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                        }}
                    />
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-sm p-2 sm:p-2.5 rounded-full border border-[#E5E7EB] z-10 text-[#D4A63F] shadow-sm">
                        {vehicle.type === 'car' ? <FaCar className="text-xs sm:text-sm" /> : vehicle.type === 'bike' ? <FaMotorcycle className="text-xs sm:text-sm" /> : <FaTruck className="text-xs sm:text-sm" />}
                    </div>
                    {vehicle.discount > 0 && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#D4A63F] text-black px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold z-10 tracking-wider uppercase shadow-sm">
                            {vehicle.discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-neutral-900 mb-3 sm:mb-4 line-clamp-1 group-hover:text-[#D4A63F] transition-colors">
                        {vehicle.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-3 mb-4 sm:mb-5 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 sm:space-x-2.5 text-[#6B7280]">
                            <FaCalendar className="text-[#D4A63F] flex-shrink-0 text-xs sm:text-sm" />
                            <span className="font-sans font-medium text-[10px] sm:text-xs lg:text-sm">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-2.5 text-[#6B7280]">
                            <FaGasPump className="text-[#D4A63F] flex-shrink-0 text-xs sm:text-sm" />
                            <span className="font-sans font-medium text-[10px] sm:text-xs lg:text-sm">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-2.5 text-[#6B7280]">
                            <FaCog className="text-[#D4A63F] flex-shrink-0 text-xs sm:text-sm" />
                            <span className="font-sans font-medium text-[10px] sm:text-xs lg:text-sm">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-2.5 text-[#6B7280]">
                            <FaTachometerAlt className="text-[#D4A63F] flex-shrink-0 text-xs sm:text-sm" />
                            <span className="font-sans font-medium text-[10px] sm:text-xs lg:text-sm truncate">{vehicle.mileage}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3 sm:pt-4">
                        <div className="flex flex-col">
                            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
                                <span className="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 price font-display">
                                    {formatPrice(vehicle.price)}
                                </span>
                                {vehicle.originalPrice > vehicle.price && (
                                    <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium font-sans">
                                        {formatPrice(vehicle.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 font-sans">EMI Available</span>
                        </div>
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#FAFAF8] flex items-center justify-center border border-[#E5E7EB] text-neutral-900 group-hover:bg-[#D4A63F] group-hover:border-[#D4A63F] group-hover:text-black transition-all duration-300">
                            <span className="font-black text-xs sm:text-sm">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
