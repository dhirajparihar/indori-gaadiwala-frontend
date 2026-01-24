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
    const [form, setForm] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setForm({
                title: vehicle.title,
                price: vehicle.price,
                originalPrice: vehicle.originalPrice,
                status: vehicle.status,
                type: vehicle.type
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
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Vehicle</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={form.title || ''}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status || 'available'}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={form.type || 'car'}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="commercial">Commercial Vehicle</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                            ✅ You can edit vehicle details! Image upload will be added soon.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
