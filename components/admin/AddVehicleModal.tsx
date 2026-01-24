import { useState } from 'react';
import { vehiclesApi } from '@/lib/api';
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
        featured: false
    });

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

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
                featured: false
            });
            setSelectedImages([]);
        } catch (error: any) {
            console.error('Error creating vehicle:', error);
            toast.error(`Failed to create vehicle: ${error.response?.data?.message || error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
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
