import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ایمپورت کامپوننت Link از react-router-dom
import logo from '../Assets/logo-color.png'; // مسیر لوگو

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      window.location.href = '/home'; 
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#416555]">
      <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded px-8 py-8">
        {/* قسمت قرمز */}
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="لوگو" className="h-24" />
        </div>
        {/* قسمت سفید */}
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">Login</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="username">
                email
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-mdtext-sm
                border border-gray-600 outline-none focus: outline-[#416555]"
                id="username"
                type="text"
                placeholder="Enter your email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="password">
              password
              </label>
              <input
                className=" w-full bg-transparent flex-grow px-4 py-2 rounded-mdtext-sm
                border border-gray-600 outline-none focus: outline-[#416555]"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              {/* اضافه کردن لینک به صفحه signup */}
              <Link to="/signup" className="text-[#416555] text-sm font-bold">
                Don't have an account? signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
