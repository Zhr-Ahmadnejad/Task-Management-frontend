import React from 'react';
import logo from '../Assets/logo-color.png';

function AboutUs() {
  // تابع برای هدایت کاربر به صفحه خانه
  const handleHomeClick = () => {
    window.location.href = '/home';  // تغییر مسیر به صفحه خانه
  };

  return (
    // کانتینر اصلی که کل محتوا را در مرکز صفحه نمایش می‌دهد
    <div className="flex flex-col items-center justify-center h-screen bg-[#416555] dark:bg-white">
      {/* کانتینر برای محتوای درباره ما با پس‌زمینه سفید و حاشیه‌های گرد */}
      <div className="bg-white dark:bg-[#416555] p-8 rounded-lg shadow-md flex flex-col items-center justify-center">
        {/* لوگوی پروژه */}
        <img src={logo} alt="Logo" className="w-30 h-40 " />
        {/* بخش متنی درباره تیم */}
        <div className="text-left mb-8">
          <h2 className="text-xl font-bold text-[#416555] dark:text-white">درباره ی تیم ما</h2>
          <p className="text-[#416555] dark:text-white mt-4">
            سلام. من زهرا احمدنژاد هستم و این پروژه ی کارشناسی بنده هست
          </p>
        </div>
        {/* دکمه برای برگشت به صفحه خانه */}
        <button
          onClick={handleHomeClick}  // فراخوانی تابع handleHomeClick هنگام کلیک روی دکمه
          className="px-4 py-2 bg-[#416555] text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 self-start mt-8"
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default AboutUs;