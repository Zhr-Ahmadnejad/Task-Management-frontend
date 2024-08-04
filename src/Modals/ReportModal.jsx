import React, { useEffect, useState } from 'react'; // وارد کردن React و hooks های useEffect و useState برای مدیریت وضعیت و اثرات جانبی
import axios from 'axios'; // وارد کردن کتابخانه axios برای انجام درخواست‌های HTTP
import { Bar } from 'react-chartjs-2'; // وارد کردن کامپوننت Bar برای نمایش نمودار میله‌ای
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // وارد کردن اجزای مورد نیاز برای ایجاد نمودار با chart.js
import Cookies from 'js-cookie'; // وارد کردن کتابخانه js-cookie برای مدیریت کوکی‌ها
import { useSearchParams } from 'react-router-dom'; // وارد کردن hook برای دستیابی به پارامترهای جستجو در URL
import html2canvas from 'html2canvas'; // وارد کردن کتابخانه html2canvas برای تبدیل محتوای HTML به تصویر
import jsPDF from 'jspdf'; // وارد کردن کتابخانه jsPDF برای تولید فایل‌های PDF
import moment from 'jalali-moment';  // وارد کردن jalali-moment برای مدیریت تاریخ‌های ایرانی

// ثبت اجزای مورد نیاز برای Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportModal = ({ toggleReportModal }) => { // تعریف کامپوننت ReportModal با props برای تغییر وضعیت نمایش مودال
  const [chartData, setChartData] = useState({}); // state برای ذخیره داده‌های نمودار
  const [loading, setLoading] = useState(true); // state برای نمایش وضعیت بارگذاری
  const [error, setError] = useState(null); // state برای ذخیره پیام‌های خطا
  const [taskCounts, setTaskCounts] = useState([]); // state برای تعداد وظایف در هر وضعیت
  const [totalTasks, setTotalTasks] = useState(0); // state برای تعداد کل وظایف
  const [currentDateTime, setCurrentDateTime] = useState(''); // state برای ذخیره تاریخ و زمان جاری
  const user_token = Cookies.get('token'); // دریافت توکن کاربر از کوکی‌ها
  const [searchParams] = useSearchParams(); // دریافت پارامترهای جستجو از URL
  const boardId = searchParams.get(''); // دریافت boardId از پارامترهای جستجو (توجه: مقدار boardId به درستی خوانده نشده است و باید اصلاح شود)

  useEffect(() => {
    if (!boardId) { // اگر boardId وجود نداشته باشد
      setError('Board ID is missing.'); // تنظیم پیام خطا
      setLoading(false); // تغییر وضعیت بارگذاری به false
      return;
    }

    const fetchData = async () => { // تابعی برای دریافت داده‌ها
      try {
        // ارسال درخواست برای دریافت وضعیت‌های وظایف
        const statesResponse = await axios.get(`http://localhost:8088/api/user/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${user_token}` // ارسال توکن در هدر درخواست
          }
        });

        const taskStates = statesResponse.data.taskStates; // دریافت وضعیت‌های وظایف
        const taskStateIds = taskStates.map(state => state.id); // استخراج شناسه‌های وضعیت
        const taskStateNames = taskStates.map(state => state.stateName); // استخراج نام‌های وضعیت

        // ارسال درخواست برای دریافت وظایف هر وضعیت
        const tasksPromises = taskStateIds.map(async (stateId) => {
          const tasksResponse = await axios.get('http://localhost:8088/api/user/board/tasks', {
            headers: {
              Authorization: `Bearer ${user_token}`,
              boardId: boardId,
              taskStateId: stateId // ارسال شناسه وضعیت به عنوان پارامتر
            }
          });

          const taskNames = new Set(tasksResponse.data.map(task => task.taskName)); // ایجاد مجموعه‌ای از نام‌های وظایف برای هر وضعیت
          return {
            count: taskNames.size, // تعداد وظایف منحصر به فرد
            stateName: taskStates.find(state => state.id === stateId).stateName // نام وضعیت
          };
        });

        // دریافت داده‌های وظایف
        const tasksData = await Promise.all(tasksPromises);
        const tasksCounts = tasksData.map(data => data.count); // تعداد وظایف در هر وضعیت
        const stateNames = tasksData.map(data => data.stateName); // نام‌های وضعیت

        const totalTasks = tasksCounts.reduce((acc, count) => acc + count, 0); // محاسبه تعداد کل وظایف

        if (totalTasks === 0) { // اگر تعداد کل وظایف صفر باشد
          setError('No tasks found for the selected board.'); // تنظیم پیام خطا
          setLoading(false); // تغییر وضعیت بارگذاری به false
          return;
        }

        // تنظیم داده‌های نمودار
        const chartData = {
          labels: stateNames, // برچسب‌های محور x
          datasets: [{
            label: 'درصد وظایف بر اساس وضعیت',
            data: tasksCounts.map(count => (count / totalTasks) * 100), // درصد وظایف در هر وضعیت
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // رنگ پس‌زمینه نوارها
            borderColor: 'rgba(75, 192, 192, 1)', // رنگ مرز نوارها
            borderWidth: 1,
          }]
        };

        setChartData(chartData); // تنظیم داده‌های نمودار
        setTaskCounts(tasksCounts); // تنظیم تعداد وظایف
        setTotalTasks(totalTasks); // تنظیم تعداد کل وظایف
        setLoading(false); // تغییر وضعیت بارگذاری به false
      } catch (err) { // در صورت بروز خطا
        setError('خطا در بارگذاری داده‌ها.'); // تنظیم پیام خطا
        console.error('Failed to fetch task states or tasks:', err); // ثبت خطا در کنسول
        setLoading(false); // تغییر وضعیت بارگذاری به false
      }
    };

    fetchData(); // فراخوانی تابع برای دریافت داده‌ها

    const updateDateTime = () => { // تابعی برای بروزرسانی تاریخ و زمان
      const now = moment().format('YYYY/MM/DD HH:mm:ss'); // دریافت تاریخ و زمان جاری به فرمت ایرانی
      setCurrentDateTime(now); // تنظیم تاریخ و زمان جاری
    };

    updateDateTime(); // بروزرسانی تاریخ و زمان اولیه
    const intervalId = setInterval(updateDateTime, 1000); // بروزرسانی هر ثانیه

    return () => clearInterval(intervalId); // پاکسازی بازه زمانی در زمان unmount کامپوننت
  }, [boardId, user_token]); // وابستگی به boardId و user_token

  const printPDF = async () => { // تابعی برای تولید فایل PDF
    // مخفی کردن دکمه‌ها قبل از ضبط محتوا
    const buttons = document.querySelector('#report-buttons');
    if (buttons) buttons.style.visibility = 'hidden'; // مخفی کردن دکمه‌ها

    // افزودن فضای اضافی برای header و footer در PDF
    const input = document.getElementById('report-content'); // دریافت محتوای گزارش
    const canvas = await html2canvas(input, { // تبدیل محتوای HTML به تصویر
      scale: 2,
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png'); // تبدیل تصویر به فرمت PNG
    const pdf = new jsPDF('p', 'mm', 'a4'); // ایجاد فایل PDF
    pdf.addImage(imgData, 'PNG', 10, 20, 190, 0); // افزودن تصویر به فایل PDF
    pdf.save(`boardReport-${currentDateTime}.pdf`); // ذخیره فایل PDF با نام report.pdf

    // نمایش دوباره دکمه‌ها بعد از ضبط محتوا
    if (buttons) buttons.style.visibility = 'visible'; // نمایش دوباره دکمه‌ها
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) { // بررسی اینکه آیا کلیک در داخل modal رخ داده است
          return;
        }
        toggleReportModal(); // فراخوانی تابع برای بستن مودال
      }}
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]" // استایل برای نمایش modal
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl" id="report-content"> {/* استایل برای محتوای گزارش */}
        <h3 className="font-bold text-[#2b4d3f] text-xl text-center"> {/* عنوان گزارش */}
          گزارش درصد وظایف بر اساس وضعیت
        </h3>

        <p className="text-center text-[#6aa088] dark:text-gray-100 mb-4"> {/* تاریخ و زمان */}
          تاریخ و زمان: {currentDateTime}
        </p>

        {loading ? ( // نمایش وضعیت بارگذاری
          <p className="text-center text-[#416555] dark:text-gray-400">در حال بارگذاری داده‌ها...</p>
        ) : error ? ( // نمایش پیام خطا
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div>
            <div style={{ width: '100%', height: '50vh', marginBottom: '5px' }}> {/* نمودار */}
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'نمودار وظایف بر اساس وضعیت',
                      color: '#416555',
                      font: {
                        size: 14
                      }
                    },
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#416555',
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${context.raw.toFixed(2)}%`;
                        }
                      },
                      backgroundColor: '#416555',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      font: {
                        size: 10
                      }
                    }
                  },
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${value}%`,
                        color: '#416555',
                        font: {
                          size: 12
                        }
                      },
                      grid: {
                        color: '#416555'
                      }
                    },
                    x: {
                      grid: {
                        color: '#416555'
                      }
                    }
                  },
                }}
              />
            </div>
            <div className="mt-0 ">
              <h4 className="font-bold text-[#416555] dark:text-gray-100 text-right">تعداد کل وظایف : {totalTasks}</h4>
              <ul className="ml-2 text-[#416555] dark:text-gray-100 text-right"> {/* لیست تعداد وظایف */}
                {chartData.labels && chartData.labels.map((label, index) => (
                  <li key={index}>{label}: {taskCounts[index]}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div id="report-buttons" className="flex justify-center mt-6 space-x-4"> {/* دکمه‌های گزارش */}
          <button
            onClick={printPDF}
            className="bg-[#2b4d3f] text-white px-4 py-2 rounded hover:bg-[#1f3b31] dark:bg-[#2b2c37] dark:hover:bg-[#3b3c47]"
          >
            دانلود PDF
          </button>
          <button
            onClick={toggleReportModal}
            className="bg-[#2b4d3f] text-white px-4 py-2 rounded hover:bg-[#1f3b31] dark:bg-[#2b2c37] dark:hover:bg-[#3b3c47]"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal; // صادر کردن کامپوننت
