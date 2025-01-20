import { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../store/slices/adminApiSlice';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, categoryName }: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete the category "{categoryName}"? This action cannot be undone.
                    </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>    
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Categories = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    
    const { data: categories, isLoading } = useGetCategoriesQuery({ page, limit });
    const [createCategory] = useCreateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const validateForm = () => {
        const errors: { name?: string; description?: string } = {};
        
        if (!name.trim()) {
            errors.name = 'Category name is required';
        } else if (name.length < 3) {
            errors.name = 'Category name must be at least 3 characters';
        } else if (name.length > 50) {
            errors.name = 'Category name must be less than 50 characters';
        } else if (categories) {
            const isDuplicate = categories.some(
                (category: Category) => 
                    category.name.toLowerCase() === name.trim().toLowerCase()
            );
            if (isDuplicate) {
                errors.name = 'Category with this name already exists';
            }
        }

        if (description && description.length > 200) {
            errors.description = 'Description must be less than 200 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }

        try {
            const trimmedName = name.trim();
            const trimmedDescription = description.trim();
            
            const isDuplicate = categories?.some(
                (category: Category) => 
                    category.name.toLowerCase() === trimmedName.toLowerCase()
            );
            
            if (isDuplicate) {
                setError('Category with this name already exists');
                return;
            }

            await createCategory({ 
                name: trimmedName, 
                description: trimmedDescription 
            }).unwrap();
            
            setName('');
            setDescription('');
            setFormErrors({});
            setPage(1);
        } catch (err: any) {
            setError(err.data?.message || 'Failed to create category');
            console.error('Failed to create category:', err);
        }
    };

    const handleDeleteClick = (id: string, name: string) => {
        setCategoryToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        
        try {
            await deleteCategory(categoryToDelete.id).unwrap();
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
        } catch (err) {
            setError('Failed to delete category');
            console.error('Failed to delete category:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900">News Categories</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (formErrors.name) {
                                    setFormErrors({ ...formErrors, name: undefined });
                                }
                            }}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                                formErrors.name 
                                    ? 'border-red-300' 
                                    : 'border-gray-300'
                            }`}
                            required
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (formErrors.description) {
                                    setFormErrors({ ...formErrors, description: undefined });
                                }
                            }}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                                formErrors.description 
                                    ? 'border-red-300' 
                                    : 'border-gray-300'
                            }`}
                            rows={3}
                        />
                        {formErrors.description && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {description.length}/200 characters
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Create Category
                    </button>
                </div>
            </form>

            {/* Categories List */}
            <div className="bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : categories && categories.length > 0 ? (
                            categories.map((category: Category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                    <td className="px-6 py-4">{category.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDeleteClick(category.id, category.name)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {categories && categories.length > 0 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!categories.length || categories.length < limit}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                categoryName={categoryToDelete?.name || ''}
            />
        </div>
    );
};

export default Categories;
