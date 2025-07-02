import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import watchLogo from '../images/watchlogotransparent.png';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCart } from "react-icons/io";

export default function Dashboard() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartMessage, setCartMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!token || (role !== 'customer' && role !== 'admin')) {
      navigate('/login');
    }
  }, [token, role, navigate]);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load products.');
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = res.data.items || [];
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartCount(0);
    }
  };

  const handleAddToCart = async (product) => {
  try {
    setCartCount(prev => prev + 1);
    setCartMessage('✅ ADDED TO CART!');
    setTimeout(() => setCartMessage(''), 1000);

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let cartItems = (res.data.items || []).filter(item => item.product);

    const existingItem = cartItems.find(item => {
      const itemProductId = typeof item.product === 'string'
        ? item.product
        : item.product?._id;
      return itemProductId === product._id;
    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ product: product._id, quantity: 1 });
    }

    const cleanedItems = cartItems
      .filter(item => item.product && (item.product._id || typeof item.product === 'string'))
      .map(({ product, quantity }) => ({
        product: typeof product === 'string' ? product : product._id,
        quantity,
      }));

    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      items: cleanedItems
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Failed to add to cart:', err);
    alert('Error adding to cart');
  }
};


  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div id='lora400' className="min-h-screen bg-[#000000]">


       {/* Add to cart Success Message */}
                      {cartMessage && (
                      <p id='rubik500' className="fixed z-50 top-[50%] right-[45%] rounded-[8px] max-md:right-[30%]  text-nowrap  p-[20px] bg-[#ffffffaf] text-green-600 text-center  mb-4 transition-opacity duration-300">
                        {cartMessage}
                      </p>
                    )}


      {/* NAVBAR */}
      <nav className="bg-black z-30 py-2 text-white flex justify-between items-center fixed min-w-screen">
        <Link to="/" className="text-xl font-bold">
          <img src={watchLogo} className="w-[100px] min-[1050px]:ml-[150px]" />
        </Link>

        {/* Desktop Links */}
        <div id='rubik500' className="hidden min-[950px]:flex space-x-6 items-center text-[20px] mr-[50px] relative">



          {token && (
            <>
              <Link to="/ " className="cursor-pointer hover:scale-125 duration-200">HOME</Link>
              <Link to="/cart" className="relative cursor-pointer mr-[130px] hover:scale-125 duration-200">
                <IoIosCart size={30} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
          {token && role === 'admin' && (
            <Link to="/admin" className="cursor-pointer hover:scale-115 duration-200">ADMIN DASHBOARD</Link>
          )}
          {token ? (
            <button onClick={handleLogout} className="cursor-pointer hover:scale-125 duration-200">LOGOUT</button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
        </div>

        {/* Burger Menu */}
        <div className="min-[950px]:hidden max-[950px]:mr-[50px]">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl cursor-pointer">
            <GiHamburgerMenu />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div id='rubik500' className="absolute top-16 right-4 bg-[#111] rounded-md p-4 space-y-3 shadow-lg z-50 flex flex-col items-start">
            {token && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:underline">Dashboard</Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="relative hover:underline">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {token && role === 'admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:underline">Admin Dashboard</Link>
            )}
            {token ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="hover:underline">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:underline">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="hover:underline">Signup</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <div id='rubik500' className="pt-[200px] px-4">
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 max-w-[1500px] mx-auto">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-black rounded-xl shadow border-[3px] border-[#c4c4c4] hover:shadow-md transition mb-[100px] relative hover:scale-105 duration-200"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[700px] max-md:h-[500px] w-full object-cover object-top rounded-md mb-4"
                />
               <div className='flex flex-col items-center'> 
                  <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                  <p className="text-gray-600 mt-1 text-center">{product.description}</p>
                  <p className="mt-2 font-bold text-white">${product.price}</p>
               </div>
                <div className="flex justify-between w-full absolute top-[75%] max-md:top-[65%]">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-white text-black px-4 py-2 rounded hover:brightness-75 hover:scale-115 duration-200 cursor-pointer"
                  >
                    Add to Cart+
                  </button>
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:brightness-75 hover:scale-115 duration-200 cursor-pointer "
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
