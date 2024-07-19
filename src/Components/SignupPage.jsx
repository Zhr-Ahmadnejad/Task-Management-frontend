import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../Assets/logo-color.png';
import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify"; 

function SignupPage() {
  // استفاده از useState برای نگهداری وضعیت ایمیل، رمز عبور، نام و نام خانوادگی
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(''); // استفاده از useState برای نگهداری وضعیت خطا

  const navigate = useNavigate(); // استفاده از useNavigate برای انتقال به صفحات دیگر در React Router

  const handleSubmit = async (e) => {
    e.preventDefault(); // جلوگیری از رفتن به صفحه جدید پس از submit فرم

    try {
      // ارسال درخواست POST به سرور برای ثبت‌نام
      const {data} = await axios.post('http://localhost:8088/api/register', {
        email, password, firstName, lastName
      });

      Cookies.set('token', data, { expires: 7 }); // ذخیره توکن در کوکی با انقضای 7 روز
      navigate("/home"); // انتقال کاربر به صفحه خانه پس از ثبت‌نام موفق

      setError(""); // حذف خطاها پس از ثبت‌نام موفق
      const notify = () => toast("خوش اومدید"); // نمایش پیام خوش‌آمدگویی به کاربر با استفاده از toast
      notify();
    } catch (error) {
      setError(error.response.data); // نمایش خطاهای دریافتی از سرور به کاربر
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#416555]">
      <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded px-8 py-8">
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="لوگو" className="h-24" /> {/* نمایش لوگو در سمت چپ فرم */}
        </div>
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">ثبتنام</h2> {/* عنوان فرم ثبت‌نام */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* نمایش خطاها اگر وجود داشته باشند */}
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="email">
                ایمیل
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="email"
                type="email"
                placeholder="آدرس ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // بروزرسانی وضعیت ایمیل با ورود داده جدید
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="password">
                رمز عبور
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // بروزرسانی وضعیت رمز عبور با ورود داده جدید
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="firstName">
                نام
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="firstName"
                type="text"
                placeholder="نام خود را وارد کنید"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} // بروزرسانی وضعیت نام با ورود داده جدید
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="lastName">
                نام خانوادگی
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="lastName"
                type="text"
                placeholder="نام خانوادگی خود را وارد کنید"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} // بروزرسانی وضعیت نام خانوادگی با ورود داده جدید
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                عضویت
              </button>
              {/* اضافه کردن لینک به صفحه login */}
              <Link to="/" className="text-[#416555] text-sm font-bold">
                درحال حاضر حساب کاربری داری؟ واردشو
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
