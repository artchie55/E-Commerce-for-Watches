import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/watchlogin.jpg';
import loginLogo from '../images/watchlogotransparent.png';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const imageRef = useRef(null);

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (role === 'customer' || role === 'admin') {
      navigate('/dashboard');
    }
  }, [token, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/login'); // Redirect to login
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  const handleMouseMove = (e) => {
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;

    img.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
  };

  const resetTransform = () => {
    const img = imageRef.current;
    img.style.transform = 'scale(1) translate(0, 0)';
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black">
      {/* Left Image */}
      <div
        className="w-full md:w-2/3 h-200 md:h-full bg-black/80 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTransform}
      >
        <img
          ref={imageRef}
          src={loginImage}
          alt="Watch Signup"
          className="w-full h-full object-cover transition-transform duration-300 ease-out pointer-events-none select-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/3 h-full flex flex-col items-center justify-center">
        <img src={loginLogo} alt="Logo" className="w-[200px] mb-4 hidden md:block" />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6 "
        >
          <h2 className="text-3xl font-extrabold text-center text-[#cfa61c]">Sign Up</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#cfa61c] focus:border-transparent hover:shadow"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#cfa61c] focus:border-transparent hover:shadow"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#cfa61c] focus:border-transparent hover:shadow"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#cfa61c] text-white p-3 rounded-lg transition-transform duration-200 hover:bg-[#d7b431] cursor-pointer hover:scale-105 active:scale-95"
          >
            Create Account
          </button>

          <div className="text-center text-[16px] text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#cfa61c] hover:underline hover:brightness-110 transition-colors"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
