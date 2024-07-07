import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CategoryModal = ({ onClose, onCategoryChange, categories }) => {
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');

    const addCategory = async () => {
        try {
            await axios.post(`${API_URL}/addCategory`, { category: newCategory });
            onCategoryChange();
            setNewCategory('');
            setError('');
        } catch (err) {
            setError('Failed to add category');
        }
    };

    const removeCategory = async (category) => {
        try {
            await axios.post(`${API_URL}/removeCategory`, { category });
            onCategoryChange();
        } catch (err) {
            setError('Failed to remove category');
        }
    };

    return (
        <div className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="New category name"
                    />
                    <button
                        onClick={addCategory}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Category
                    </button>
                </div>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <ul className="max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                        <li key={category} className="flex justify-between items-center mb-2">
                            {category}
                            <button
                                onClick={() => removeCategory(category)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default CategoryModal;