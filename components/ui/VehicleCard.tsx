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
            <div className="card overflow-hidden group cursor-pointer h-full vehicle-card">
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                    <Image
                        src={imageUrl}
                        alt={vehicle.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                        }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-full border border-[#E4E4E7] z-10 text-black">
                        {vehicle.type === 'car' ? <FaCar className="text-sm" /> : vehicle.type === 'bike' ? <FaMotorcycle className="text-sm" /> : <FaTruck className="text-sm" />}
                    </div>
                    {vehicle.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10 tracking-wide uppercase">
                            {vehicle.discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 line-clamp-1 group-hover:text-black transition-colors font-display">
                        {vehicle.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-[#71717A]">
                            <FaCalendar className="text-[#71717A] flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#71717A]">
                            <FaGasPump className="text-[#71717A] flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#71717A]">
                            <FaCog className="text-[#71717A] flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#71717A]">
                            <FaTachometerAlt className="text-[#71717A] flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm truncate">{vehicle.mileage}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-[#E4E4E7] pt-3">
                        <div className="flex flex-col">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-lg sm:text-xl font-black text-gray-900 price font-display">
                                    {formatPrice(vehicle.price)}
                                </span>
                                {vehicle.originalPrice > vehicle.price && (
                                    <span className="text-xs text-gray-400 line-through font-medium">
                                        {formatPrice(vehicle.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider mt-0.5"> EMI Available</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
                            <span className="text-black group-hover:text-white transition-colors">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
