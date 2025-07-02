import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProductForm() {
    
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') {
    navigate('dashboard');
  }
}, []);

  const handleUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'e-commerce'); // 🔁 Replace
    

    try {
      setUploading(true);
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dqwtriadv/image/upload', // 🔁 Replace
        formData
      );
      return res.data.secure_url;
    } catch (err) {
  console.error('Cloudinary upload error:', err.response?.data || err.message);
  setError('Image upload failed');
  return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    const imageUrl = await handleUpload();

    if (!imageUrl) return;

    try {
      await axios.post(
        'http://localhost:5000/api/products',
        { ...product, image: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/dashboard'); // Or refresh product list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-lg"
      >
        <h2 className="text-xl font-bold">Add New Product</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
