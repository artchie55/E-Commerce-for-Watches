import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div id='rubik500' className="min-h-screen bg-[#181717] p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📊 Admin Dashboard</h1>
        
        <button
          onClick={() => navigate('/admin/add-product')}
          className="bg-green-600 text-white text-[25px] py-4 px-[130px] rounded hover:bg-green-700 hover:scale-105 duration-200 cursor-pointer"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold"> 1-Day Stats</h2>
          <p>Orders: </p>
          <p>Revenue: </p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold"> 7-Day Stats</h2>
          <p>Orders: </p>
          <p>Revenue: </p>
        </div>
      </div>

      <div className='flex justify-center text-white text-[100px] mt-[300px]'>MORE FEATURES SOON!</div>
      <a href='/dashboard' className='flex justify-center text-white text-[50px] hover:underline hover:scale-115 duration-200'>BACK TO PRODUCTS PAGE</a>
    </div>
  );
};

export default AdminDashboard;
