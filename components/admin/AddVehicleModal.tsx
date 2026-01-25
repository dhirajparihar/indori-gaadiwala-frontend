import { useState } from 'react';
import { vehiclesApi, sellerInquiriesApi } from '@/lib/api';
import { createVehicleWithImages } from '@/lib/vehicleHelpers';
import { toast } from 'react-toastify';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddVehicleModal({ isOpen, onClose, onSuccess }: AddVehicleModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'car',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        originalPrice: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        description: '',
        features: '',
        status: 'available',
        featured: false,
        owners: ''
    });

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [fetchingVehicle, setFetchingVehicle] = useState(false);

    // Function to fetch vehicle details by registration number
    const fetchVehicleDetails = async (regNo: string) => {
        if (!regNo || regNo.length < 4) return;
        
        setFetchingVehicle(true);
        try {
            // Using the same API as VehicleLookup
            const response = await sellerInquiriesApi.lookupByRegNo(regNo);
            
            if (response.data.success) {
                const data = response.data.data;
                
                // Map API response to form fields
                setFormData(prev => ({
                    ...prev,
                    title: `${data.year} ${data.make} ${data.model}`,
                    brand: data.make || '',
                    model: data.model || '',
                    year: parseInt(data.year) || new Date().getFullYear(),
                    fuelType: data.fuelType || 'Petrol',
                    transmission: data.transmissionType === 'AT' ? 'Automatic' : 'Manual',
                    description: `Vehicle Details:\nRegistration: ${data.regNo}\nColor: ${data.color}\nBody Type: ${data.bodyType}\nRegistered At: ${data.registeredAt}\nInsurance Up To: ${data.insuranceUpTo}\nFitness Up To: ${data.fitnessUpTo}`,
                    features: `${data.bodyType}, ${data.fuelType}, ${data.transmissionType === 'AT' ? 'Automatic' : 'Manual'} Transmission`,
                    owners: data.rcOwnerCount || ''
                }));
                
                toast.success('Vehicle details fetched successfully!');
            }
        } catch (error) {
            console.error('Error fetching vehicle details:', error);
            toast.error('Failed to fetch vehicle details. Please enter manually.');
        } finally {
            setFetchingVehicle(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const data = await createVehicleWithImages(formData, selectedImages);
            await vehiclesApi.create(data);

            toast.success('Vehicle created successfully!');
            onSuccess();
            onClose();

            // Reset form
            setFormData({
                title: '',
                type: 'car',
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                price: '',
                originalPrice: '',
                mileage: '',
                fuelType: 'Petrol',
                transmission: 'Manual',
                description: '',
                features: '',
                status: 'available',
                featured: false,
                owners: ''
            });
            setSelectedImages([]);
            setVehicleNumber('');
        } catch (error: unknown) {
            console.error('Error creating vehicle:', error);
            const err = error as any;
            toast.error(`Failed to create vehicle: ${err.response?.data?.message || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const handleVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setVehicleNumber(value);
        
        // Auto-fetch when user enters a complete registration number (typical format: XX00XX0000)
        if (value.length >= 10) {
            fetchVehicleDetails(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vehicle Number */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle Registration Number *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={handleVehicleNumberChange}
                                    className="input flex-1"
                                    placeholder="e.g., MP09CE2757"
                                    maxLength={10}
                                />
                                <button
                                    type="button"
                                    onClick={() => fetchVehicleDetails(vehicleNumber)}
                                    disabled={fetchingVehicle || !vehicleNumber}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {fetchingVehicle ? 'Fetching...' : 'Fetch Details'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Enter vehicle number to auto-fill details (e.g., MP09CE2757)
                            </p>
                        </div>

                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vehicle Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input"
                                placeholder="e.g., 2019 Tata Nexon - Compact SUV"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type *
                            </label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input"
                            >
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="commercial">Commercial Vehicle</option>
                            </select>
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="input"
                                placeholder="e.g., Tata, Honda, Maruti"
                            />
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Model *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="input"
                                placeholder="e.g., Nexon, City, Swift"
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year *
                            </label>
                            <input
                                type="number"
                                required
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="input"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="750000"
                            />
                        </div>

                        {/* Original Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Original Price (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="850000"
                            />
                        </div>

                        {/* Mileage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mileage *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.mileage}
                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                className="input"
                                placeholder="35,000 km"
                            />
                        </div>

                        {/* Owners */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Owners *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.owners}
                                onChange={(e) => setFormData({ ...formData, owners: e.target.value })}
                                className="input"
                                placeholder="e.g., 1, 2, 3"
                            />
                        </div>

                        {/* Fuel Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fuel Type *
                            </label>
                            <select
                                required
                                value={formData.fuelType}
                                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                className="input"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>

                        {/* Transmission */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transmission *
                            </label>
                            <select
                                required
                                value={formData.transmission}
                                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                className="input"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                            </label>
                            <select
                                required
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="input"
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>

                        {/* Featured */}
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    ⭐ Mark as Featured (Show on homepage)
                                </span>
                            </label>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input"
                                placeholder="Describe the vehicle condition, features, etc."
                            />
                        </div>

                        {/* Features */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Features (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="input"
                                placeholder="ABS, Airbags, Power Steering, AC, Music System"
                            />
                        </div>

                        {/* Images */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images (up to 10)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="input"
                            />
                            {selectedImages.length > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {selectedImages.length} image(s) selected
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={uploading}
                        >
                            {uploading ? 'Creating...' : 'Create Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
