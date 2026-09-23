'use client';

import { useState } from 'react';
import { FaUsers, FaPlus, FaTrash, FaCar } from 'react-icons/fa';
import { HappyCustomer } from '@/lib/types';
import { happyCustomersApi, getOptimizedImageUrl } from '@/lib/api';
import { toast } from 'react-toastify';
import CollapsibleSection from './CollapsibleSection';

interface HappyCustomersSectionProps {
    happyCustomers: HappyCustomer[];
    onRefresh: () => void;
}

export default function HappyCustomersSection({ happyCustomers, onRefresh }: HappyCustomersSectionProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setName('');
        setVehicleName('');
        setSelectedImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !vehicleName || !selectedImage) {
            toast.error('Please fill in customer name, vehicle name and select a delivery photo');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('vehicleName', vehicleName);
            formData.append('image', selectedImage);

            const res = await happyCustomersApi.create(formData);
            if (res.data.success) {
                toast.success('Happy Customer photo added successfully!');
                handleCloseModal();
                onRefresh();
            } else {
                toast.error(res.data.message || 'Failed to add customer photo');
            }
        } catch (error: any) {
            console.error('Error creating happy customer photo:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to submit photo');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await happyCustomersApi.delete(id);
            if (res.data.success) {
                toast.success('Happy Customer photo deleted successfully!');
                onRefresh();
            } else {
                toast.error(res.data.message || 'Failed to delete photo');
            }
        } catch (error: any) {
            console.error('Error deleting happy customer photo:', error);
            toast.error(error.message || 'Failed to delete photo');
        } finally {
            setDeleteConfirmId(null);
        }
    };

    return (
        <div id="happy-customers">
            <CollapsibleSection
                title="Happy Customer Photo Show"
                count={happyCustomers.length}
                icon={<FaUsers className="text-xl" />}
                iconColor="text-yellow-600"
            >
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">
                        Manage delivery photos displayed in the "Happy Customer Photo Show" section of the homepage.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-[#D4A63F] hover:bg-[#C6942C] text-black rounded-lg transition-colors text-sm font-extrabold shadow-sm cursor-pointer"
                    >
                        <FaPlus size={12} />
                        <span>Add Customer Photo</span>
                    </button>
                </div>

                {happyCustomers.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <FaUsers className="mx-auto text-gray-400 text-3xl mb-2" />
                        <p className="text-gray-500 font-medium font-sans">No customer photos added yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Default seed images are currently being displayed on the homepage.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {happyCustomers.map((cust) => (
                            <div key={cust._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                                <div className="h-56 relative overflow-hidden bg-gray-100">
                                    <img
                                        src={getOptimizedImageUrl(cust.imageUrl, 400, 300)}
                                        alt={cust.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 font-sans">
                                        <FaCar size={11} />
                                        <span>{cust.vehicleName}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                                    <div>
                                        <h3 className="font-bold text-gray-900 font-display text-base">{cust.name}</h3>
                                        <p className="text-xs text-gray-500 font-sans mt-0.5">{cust.vehicleName}</p>
                                    </div>

                                    <div>
                                        {deleteConfirmId === cust._id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(cust._id)}
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors font-sans"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-bold transition-colors font-sans"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmId(cust._id)}
                                                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
                                                title="Delete customer photo"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CollapsibleSection>

            {/* Add Customer Show Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900 font-display">Add Happy Customer Photo</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input text-sm"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Vehicle *</label>
                                <input
                                    type="text"
                                    required
                                    value={vehicleName}
                                    onChange={(e) => setVehicleName(e.target.value)}
                                    className="input text-sm"
                                    placeholder="e.g. Mahindra Thar (2025)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Photo *</label>
                                <input
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#D4A63F]/10 file:text-[#D4A63F] file:cursor-pointer hover:file:bg-[#D4A63F]/20"
                                />
                                {imagePreview && (
                                    <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 max-h-40">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 text-sm font-medium text-black bg-[#D4A63F] rounded-lg hover:bg-[#C6942C] transition-colors disabled:opacity-50 flex items-center gap-1.5 font-extrabold cursor-pointer"
                                >
                                    {uploading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-black border-b-transparent rounded-full animate-spin"></span>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <span>Add Photo</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

