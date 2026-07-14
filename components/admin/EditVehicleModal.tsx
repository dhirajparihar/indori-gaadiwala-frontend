'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import { vehiclesApi } from '@/lib/api';
import { toast } from 'react-toastify';

interface EditVehicleModalProps {
    vehicle: Vehicle | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditVehicleModal({ vehicle, onClose, onSuccess }: EditVehicleModalProps) {
    const [form, setForm] = useState<Partial<Vehicle>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setForm({
                title: vehicle.title,
                price: vehicle.price,
                originalPrice: vehicle.originalPrice,
                status: vehicle.status,
                type: vehicle.type,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                mileage: vehicle.mileage,
                fuelType: vehicle.fuelType,
                transmission: vehicle.transmission,
                description: vehicle.description,
                ownerCount: vehicle.ownerCount,
                location: vehicle.location,
                featured: vehicle.featured
            });
        }
    }, [vehicle]);

    const handleSave = async () => {
        if (!vehicle) return;

        setSaving(true);
        try {
            await vehiclesApi.update(vehicle._id, form);
            toast.success('Vehicle updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to update vehicle');
        } finally {
            setSaving(false);
        }
    };

    if (!vehicle) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">Edit Vehicle</h3>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={form.title || ''}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <input
                                type="text"
                                value={form.brand || ''}
                                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                type="text"
                                value={form.model || ''}
                                onChange={(e) => setForm({ ...form, model: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                value={form.year || ''}
                                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                            <input
                                type="text"
                                value={form.mileage || ''}
                                onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                value={form.price || ''}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                            <input
                                type="number"
                                value={form.originalPrice || ''}
                                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={form.type || 'car'}
                                onChange={(e) => setForm({ ...form, type: e.target.value as 'car' | 'bike' | 'commercial' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="commercial">Commercial Vehicle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                            <select
                                value={form.fuelType || 'Petrol'}
                                onChange={(e) => setForm({ ...form, fuelType: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                            <select
                                value={form.transmission || 'Manual'}
                                onChange={(e) => setForm({ ...form, transmission: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status || 'available'}
                                onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'sold' | 'reserved' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="reserved">Reserved</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={form.location || ''}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Count</label>
                            <input
                                type="number"
                                value={form.ownerCount || ''}
                                onChange={(e) => setForm({ ...form, ownerCount: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={form.description || ''}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                checked={form.featured || false}
                                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Featured Vehicle
                            </label>
                        </div>
                    </div>

                    {/* Banner removed */}
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 shrink-0 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-white font-medium text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
