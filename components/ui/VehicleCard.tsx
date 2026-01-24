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
            <div className="card overflow-hidden group cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
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
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg z-10 text-orange-600">
                        {vehicle.type === 'car' ? <FaCar className="text-lg" /> : vehicle.type === 'bike' ? <FaMotorcycle className="text-lg" /> : <FaTruck className="text-lg" />}
                    </div>
                    {vehicle.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg z-10 tracking-wide uppercase">
                            {vehicle.discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {vehicle.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaCalendar className="text-blue-500" />
                            <span className="font-medium">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaGasPump className="text-blue-500" />
                            <span className="font-medium">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaCog className="text-blue-500" />
                            <span className="font-medium">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaTachometerAlt className="text-blue-500" />
                            <span className="font-medium">{vehicle.mileage}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex flex-col">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-black text-gray-900">
                                    {formatPrice(vehicle.price)}
                                </span>
                                {vehicle.originalPrice > vehicle.price && (
                                    <span className="text-xs text-gray-400 line-through font-medium">
                                        {formatPrice(vehicle.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5"> EMI Available</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <span className="text-blue-600 group-hover:text-white transition-colors">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
