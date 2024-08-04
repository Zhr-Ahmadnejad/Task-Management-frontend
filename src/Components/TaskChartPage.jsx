import React, { useEffect, useState } from 'react'; // وارد کردن کتابخانه React و hooks آن
import axios from 'axios'; // وارد کردن کتابخانه axios برای درخواست‌های HTTP
import { Bar } from 'react-chartjs-2'; // وارد کردن نمودار میله‌ای از کتابخانه react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // وارد کردن اجزای مورد نیاز از کتابخانه chart.js
import Cookies from 'js-cookie'; // وارد کردن کتابخانه js-cookie برای مدیریت کوکی‌ها
import { useNavigate } from 'react-router-dom'; // وارد کردن hook برای ناوبری
import moment from 'jalali-moment';  // وارد کردن jalali-moment برای تاریخ‌های ایرانی
import html2canvas from 'html2canvas';  // وارد کردن html2canvas برای ضبط محتوای صفحه
import jsPDF from 'jspdf';  // وارد کردن jsPDF برای تولید فایل‌های PDF

// ثبت اجزای مورد نیاز برای Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskChartPage = () => {
  // تعریف stateها با استفاده از useState
  const [chartData, setChartData] = useState({}); // داده‌های نمودار
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [error, setError] = useState(null); // خطاهای احتمالی
  const [currentDateTime, setCurrentDateTime] = useState(''); // تاریخ و زمان جاری
  const [totalTasks, setTotalTasks] = useState(0); // تعداد کل وظایف
  const [totalStartTasks, setTotalStartTasks] = useState(0); // تعداد وظایف در وضعیت شروع
  const [totalEndTasks, setTotalEndTasks] = useState(0); // تعداد وظایف در وضعیت پایان
  const navigate = useNavigate(); // ایجاد متغیر navigate برای ناوبری

  useEffect(() => {
    const fetchData = async () => {
      const user_token = Cookies.get('token'); // دریافت توکن کاربر از کوکی‌ها

      try {
        // انجام درخواست‌های همزمان برای دریافت داده‌های وظایف شروع، پایان و تمام وظایف
        const [startResponse, endResponse, allTasksResponse] = await Promise.all([
          axios.get('http://localhost:8088/api/user/board/tasks/start', {
            headers: {
              Authorization: `Bearer ${user_token}` // ارسال توکن در هدر
            }
          }),
          axios.get('http://localhost:8088/api/user/board/tasks/end', {
            headers: {
              Authorization: `Bearer ${user_token}` // ارسال توکن در هدر
            }
          }),
          axios.get('http://localhost:8088/api/user/board/tasks/user', {
            headers: {
              Authorization: `Bearer ${user_token}` // ارسال توکن در هدر
            }
          })
        ]);

        const startTasks = startResponse.data; // دریافت داده‌های وظایف شروع
        const endTasks = endResponse.data; // دریافت داده‌های وظایف پایان
        const allTasks = allTasksResponse.data; // دریافت داده‌های تمام وظایف

        const totalStartTasks = startTasks.length; // محاسبه تعداد وظایف در وضعیت شروع
        const totalEndTasks = endTasks.length; // محاسبه تعداد وظایف در وضعیت پایان
        const totalTasks = allTasks.length; // محاسبه تعداد کل وظایف

        // محاسبه درصد وظایف در وضعیت‌های شروع و پایان
        const startPercentage = (totalStartTasks / totalTasks * 100).toFixed(2);
        const endPercentage = (totalEndTasks / totalTasks * 100).toFixed(2);

        // تنظیم داده‌های نمودار
        setChartData({
          labels: ['شروع', 'پایان'], // برچسب‌های محور x
          datasets: [{
            label: 'درصد وظایف در وضعیت‌های شروع و پایان',
            data: [startPercentage, endPercentage], // داده‌های نمودار
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'], // رنگ پس‌زمینه نوارها
            borderColor: ['rgba(75, 192, 192, 1.5)', 'rgba(255, 99, 132, 1.5)'], // رنگ مرز نوارها
            borderWidth: 1,
          }]
        });

        // تنظیم تعداد وظایف
        setTotalStartTasks(totalStartTasks);
        setTotalEndTasks(totalEndTasks);
        setTotalTasks(totalTasks);

        setLoading(false); // تغییر وضعیت بارگذاری به false
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها.'); // تنظیم پیام خطا در صورت بروز خطا
        console.error('Failed to fetch tasks:', err); // ثبت خطا در کنسول
        setLoading(false); // تغییر وضعیت بارگذاری به false
      }
    };

    fetchData(); // فراخوانی تابع برای دریافت داده‌ها
  }, []); // استفاده از useEffect بدون وابستگی برای اجرای تنها یک بار

  useEffect(() => {
    // تابعی برای بروزرسانی تاریخ و زمان
    const updateDateTime = () => {
      const now = moment().format('YYYY/MM/DD HH:mm:ss'); // دریافت تاریخ و زمان جاری به فرمت ایرانی
      setCurrentDateTime(now);
    };

    updateDateTime(); // بروزرسانی تاریخ و زمان اولیه
    const intervalId = setInterval(updateDateTime, 1000); // بروزرسانی هر ثانیه

    return () => clearInterval(intervalId); // پاکسازی بازه زمانی در زمان unmount کامپوننت
  }, []); // استفاده از useEffect بدون وابستگی برای اجرای تنها یک بار

  const handleBackClick = () => {
    navigate('/home'); // ناوبری به صفحه اصلی
  };

  const downloadPDF = () => {
    // مخفی کردن دکمه‌ها قبل از ضبط محتوا
    const buttons = document.querySelector('#reportButtons');
    buttons.style.visibility = 'hidden';  // مخفی کردن دکمه‌ها به جای استفاده از display: none

    html2canvas(document.querySelector('#reportContent')).then(canvas => {
      const imgData = canvas.toDataURL('image/png'); // تبدیل تصویر به فرمت PNG
      const pdf = new jsPDF('p', 'mm', 'a4'); // ایجاد فایل PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // افزودن تصویر به فایل PDF
      pdf.save(`finalReport-${currentDateTime}.pdf`); // ذخیره فایل PDF با نام report.pdf

      // نمایش دوباره دکمه‌ها
      buttons.style.visibility = 'visible';
    });
  };

  return (
    <div className="min-h-screen bg-[#416555] dark:bg-[#20212c] p-4"> {/* استایل برای پس‌زمینه و padding */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#2b2c37] p-6 rounded-lg shadow-md border border-[#416555]" id="reportContent"> {/* استایل برای بخش محتوای گزارش */}
        <div className="flex justify-between items-center mb-4"> {/* استایل برای بخش عنوان */}
          <h2 className="text-2xl font-bold text-[#416555] dark:text-gray-100">
            نمودار وضعیت وظایف
          </h2>
        </div>

        <p className="text-right text-[#416555] dark:text-gray-100 mb-4">
          تاریخ و زمان: {currentDateTime}
        </p>

        {loading ? (
          <p className="text-center text-[#416555] dark:text-gray-400">در حال بارگذاری داده‌ها...</p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <>
            <Bar
              data={chartData} // داده‌های نمودار
              options={{
                responsive: true, // قابلیت پاسخگویی نمودار
                plugins: {
                  title: {
                    display: true,
                    text: 'نمودار درصد وظایف در وضعیت‌های شروع و پایان',
                    color: '#416555'  // رنگ عنوان نمودار
                  },
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#416555'  // رنگ legend
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.label}: ${context.raw}%`; // فرمت tooltip
                      }
                    },
                    backgroundColor: '#416555', // رنگ پس‌زمینه tooltip
                    titleColor: '#fff', // رنگ عنوان tooltip
                    bodyColor: '#fff', // رنگ متن tooltip
                  }
                },
                maintainAspectRatio: true, // حفظ نسبت ابعاد نمودار
                scales: {
                  y: {
                    beginAtZero: true, // شروع محور y از صفر
                    ticks: {
                      callback: (value) => `${value}%`, // فرمت برچسب‌های محور y
                      color: '#416555'  // رنگ برچسب‌های محور y
                    },
                    grid: {
                      color: '#416555'  // رنگ خطوط شبکه محور y
                    }
                  },
                  x: {
                    grid: {
                      color: '#416555'  // رنگ خطوط شبکه محور x
                    }
                  }
                },
              }}
            />
            <div className="mt-4 text-center text-[#416555] dark:text-gray-100">
              <p>تعداد کل وظایف: {totalTasks}</p>
              <p>تعداد وظایف در وضعیت شروع: {totalStartTasks}</p>
              <p>تعداد وظایف در وضعیت پایان: {totalEndTasks}</p>
            </div>
          </>
        )}

        <div id="reportButtons" className="mt-6 flex justify-between fixed bottom-4 right-4"> {/* استایل برای دکمه‌ها */}
          <button
            onClick={handleBackClick}
            className="bg-[#2b4d3f] text-white px-4 py-2 rounded hover:bg-[#1f3b31] dark:bg-[#2b2c37] dark:hover:bg-[#3b3c47]"
          >
            بازگشت به صفحه اصلی
          </button>
          <button
            onClick={downloadPDF}
            className="bg-[#2b4d3f] text-white px-4 py-2 rounded hover:bg-[#1f3b31] dark:bg-[#2b2c37] dark:hover:bg-[#3b3c47]"
          >
            دانلود PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskChartPage;
