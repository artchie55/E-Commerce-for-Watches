import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import watchPic from '../../images/watchhomepage.jpg';

export default function ProductForm() {
    
  const imageRef = useRef(null);

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
        `${import.meta.env.VITE_API_URL}/api/products`,
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

  const handleMouseMove = (e) => {
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;

    img.style.transform = `scale(1.25) translate(${x}px, ${y}px)`;
  };

  const resetTransform = () => {
    const img = imageRef.current;
    img.style.transform = 'scale(1) translate(0, 0)';
  };

  return (
        <div
               className="w-screen h-screen bg-black/80 overflow-hidden relative z-5" 
               onMouseMove={handleMouseMove}
               onMouseLeave={resetTransform}
                >
                    <img
                      ref={imageRef}
                      src={watchPic}
                      alt="Watch Login"
                      className="w-full h-full object-cover object-center transition-transform duration-300 ease-out pointer-events-none select-none"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={(e) => e.preventDefault()}
                    />
      <form
        onSubmit={handleSubmit}
        className="bg-[#020202] text-white p-6 rounded-[5px] shadow-md space-y-4 w-full max-w-lg z-20 absolute top-[30%] left-[35%] max-[1000px]:left-[0px] max-[1000px]:scale-85"
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
          className="cursor-pointer bg-white text-black rounded-[6px] max-w-[220px] p-2 px-2 hover:scale-110 duration-200"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
