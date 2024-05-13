import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo-color.png'; // مسیر لوگو

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // اینجا می‌توانید کاربر را ثبت نام کنید
    // برای مثال، می‌توانید از یک API برای ایجاد حساب جدید استفاده کنید
    // اینجا یک شبیه‌سازی ساده از ثبت نام کاربر انجام شده است
    if (username && password) {
      // اگر ثبت‌نام با موفقیت انجام شود، می‌توانید کاربر را به صفحه ورود هدایت کنید
      // مثلاً با استفاده از window.location.href = '/login';
      window.location.href = '/login'; // اینجا به عنوان مثال، کاربر به صفحه‌ی ورود هدایت می‌شود
    } else {
      // اگر نام کاربری یا رمز عبور وارد نشده باشد، یک پیام خطا نمایش داده می‌شود
      setError('لطفاً نام کاربری و رمز عبور را وارد کنید.');
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
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">Signup</h2>
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
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="username">
                first name
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-mdtext-sm
                border border-gray-600 outline-none focus: outline-[#416555]"
                id="username"
                type="text"
                placeholder="Enter your first name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="username">
                last name
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-mdtext-sm
                border border-gray-600 outline-none focus: outline-[#416555]"
                id="username"
                type="text"
                placeholder="Enter your last name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Signup
              </button>
              {/* اضافه کردن لینک به صفحه login */}
              <Link to="/" className="text-[#416555] text-sm font-bold">
                Already have an account? login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
