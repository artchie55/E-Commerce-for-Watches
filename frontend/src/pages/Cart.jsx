import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();


   useEffect(() => {
    if (!token || (role !== 'customer' && role !== 'admin')) {
      navigate('/login');
    }
  }, [token, role, navigate]);

  // Fetch cart on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setCart([]);
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/stripe/create-checkout-session',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } catch (err) {
      alert('Failed to start checkout');
    }
  };

  const saveCart = async (items) => {
    setCart(items);
    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        {
          items: items.map(({ product, quantity }) => ({
            product: product._id || product,
            quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.product._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item.product._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.product._id !== id);
    saveCart(updated);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div id='rubik500' className="min-h-screen bg-[#000000] text-white p-6 max-[950px]:text-center">
      <h1 className="text-3xl font-bold mb-6 min-[950px]:text-[50px]">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4 relative">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="bg-white hover:brightness-85 p-4 shadow rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg ">{item.product.name}</h2>
                  <p className="text-gray-600">
                    ${item.product.price} × {item.quantity} = $
                    {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 max-[950px]:gap-0 max-[950px]:mt-[-30px] relative">
                <button
                  onClick={() => decreaseQty(item.product._id)}
                  className="bg-[#3a3939] px-2 rounded cursor-pointer hover:scale-110 duration-200"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.product._id)}
                  className="bg-[#3a3939] px-2 rounded cursor-pointer hover:scale-110 duration-200"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-4 max-[950px]:absolute max-[950px]:bottom-[-40px] max-[950px]:right-[-10px] cursor-pointer hover:scale-110 duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className=" font-bold text-[25px] mt-4 text-left ml-[100px] max-[950px]:ml-[60px]">
            TOTAL : &nbsp;&nbsp;${total.toFixed(2)}
          </div>

          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white text-[20px] max-[950px]:text-[14] px-13 py-4 rounded hover:bg-green-700 mt-4 cursor-pointer hover:scale-110 duration-200 min-[950px]:absolute min-[950px]:bottom-[-40px] min-[950px]:right-[50px]"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
