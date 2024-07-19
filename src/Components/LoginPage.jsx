import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo-color.png';
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState(''); // وضعیت ایمیل ورودی کاربر
  const [password, setPassword] = useState(''); // وضعیت رمز عبور ورودی کاربر
  const [error, setError] = useState(''); // وضعیت خطا برای نمایش خطاهای ورود

  const navigate = useNavigate(); // استفاده از useNavigate برای انتقال به صفحات مختلف در React Router

  const handleSubmit = async (e) => {
    e.preventDefault(); // جلوگیری از رفتن به صفحه جدید پس از ارسال فرم

    try {
      const {data} = await axios.post('http://localhost:8088/api/login', {
        email, password
      });

      Cookies.set('token', data, { expires: 7 }); // ذخیره توکن در کوکی‌ها با انقضای ۷ روز
      navigate("/home?=dashboard"); // انتقال کاربر به صفحه خانه با پارامتر

      setError(""); // پاک کردن وضعیت خطا
      const notify = () => toast("خوش اومدید"); // نمایش پیام خوش‌آمدگویی به کاربر
      notify();

    } catch (error) {
      console.error('Error:', error.response.data); // چاپ خطا در کنسول
      setError(error.response.data); // تنظیم خطای دریافتی برای نمایش به کاربر
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#416555]">
      <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded px-8 py-8">
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="Logo" className="h-24" />
        </div>
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">Login</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* نمایش خطا اگر وجود داشته باشد */}
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="email">
                ایمیل
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm
                border border-gray-600 outline-none focus:outline-[#416555]"
                id="email"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="password">
                رمز عبور
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm
                border border-gray-600 outline-none focus:outline-[#416555]"
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded
                focus:outline-none focus:shadow-outline"
                type="submit"
              >
                ورود
              </button>
              <Link to="/signup" className="text-[#416555] text-sm font-bold">
                حساب کاربری نداری؟ ثبت‌نام کن
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
