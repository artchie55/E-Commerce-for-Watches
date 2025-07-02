import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/watchlogin.jpg';
import loginLogo from '../images/watchlogotransparent.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const imageRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && (role === 'admin' || role === 'customer')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      if (!res.data?.token || !res.data?.user || !res.data?.role) {
        throw new Error('Invalid login response from server.');
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please try again.'
      );
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
    <div className="flex flex-col md:flex-row h-screen bg-black/90">
      {/* Left Side Image */}
      <div
        className="w-full md:w-2/3 h-250 md:h-full bg-black/80 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTransform}
      >
        <img
          ref={imageRef}
          src={loginImage}
          alt="Watch Login"
          className="w-full h-full object-cover transition-transform duration-300 ease-out pointer-events-none select-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/3 h-full flex flex-col items-center justify-center bg-black/90 p-6">
        <img src={loginLogo} alt="Logo" className="w-[200px] mb-4 hidden md:block" />
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8  rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-center text-[#cfa61c]">Login</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
            Log In
          </button>

          <div className="text-center text-[16px] text-gray-600">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-[#cfa61c] hover:underline hover:brightness-110 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
