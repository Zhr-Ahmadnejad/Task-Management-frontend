import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom'; 
import moment from 'jalali-moment';  
import html2canvas from 'html2canvas';  
import jsPDF from 'jspdf';  

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

  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentDateTime, setCurrentDateTime] = useState(''); 
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalStartTasks, setTotalStartTasks] = useState(0); 
  const [totalEndTasks, setTotalEndTasks] = useState(0); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      const user_token = Cookies.get('token'); 

      try {
        const [startResponse, endResponse, allTasksResponse] = await Promise.all([
          axios.get('http://localhost:8088/api/user/board/tasks/start', {
            headers: {
              Authorization: `Bearer ${user_token}` 
            }
          }),
          axios.get('http://localhost:8088/api/user/board/tasks/end', {
            headers: {
              Authorization: `Bearer ${user_token}` 
            }
          }),
          axios.get('http://localhost:8088/api/user/board/tasks/user', {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          })
        ]);

        const startTasks = startResponse.data; 
        const endTasks = endResponse.data; 
        const allTasks = allTasksResponse.data; 

        const totalStartTasks = startTasks.length; 
        const totalEndTasks = endTasks.length; 
        const totalTasks = allTasks.length; 


        const startPercentage = (totalStartTasks / totalTasks * 100).toFixed(2);
        const endPercentage = (totalEndTasks / totalTasks * 100).toFixed(2);

    
        setChartData({
          labels: ['شروع', 'پایان'], 
          datasets: [{
            label: 'درصد وظایف در وضعیت‌های شروع و پایان',
            data: [startPercentage, endPercentage], 
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            borderColor: ['rgba(75, 192, 192, 1.5)', 'rgba(255, 99, 132, 1.5)'],
            borderWidth: 1,
          }]
        });

        
        setTotalStartTasks(totalStartTasks);
        setTotalEndTasks(totalEndTasks);
        setTotalTasks(totalTasks);

        setLoading(false); // تغییر وضعیت بارگذاری به false
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها.');
        console.error('Failed to fetch tasks:', err); 
        setLoading(false); // تغییر وضعیت بارگذاری به false
      }
    };

    fetchData(); 
  }, []); 

  useEffect(() => {
    const updateDateTime = () => {
      const now = moment().format('YYYY/MM/DD HH:mm:ss'); 
      setCurrentDateTime(now);
    };

    updateDateTime(); // بروزرسانی تاریخ و زمان اولیه
    const intervalId = setInterval(updateDateTime, 1000); // بروزرسانی هر ثانیه

    return () => clearInterval(intervalId); // پاکسازی بازه زمانی در زمان unmount کامپوننت
  }, []); // 

  const handleBackClick = () => {
    navigate('/home'); 
  };

  const downloadPDF = () => {
    // مخفی کردن دکمه‌ها قبل از ضبط محتوا
    const buttons = document.querySelector('#reportButtons');
    buttons.style.visibility = 'hidden'; 

    html2canvas(document.querySelector('#reportContent')).then(canvas => {
      const imgData = canvas.toDataURL('image/png'); 
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
              data={chartData} 
              options={{
                responsive: true, 
                plugins: {
                  title: {
                    display: true,
                    text: 'نمودار درصد وظایف در وضعیت‌های شروع و پایان',
                    color: '#416555' 
                  },
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#416555' 
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.label}: ${context.raw}%`; 
                      }
                    },
                    backgroundColor: '#416555', 
                    titleColor: '#fff', 
                    bodyColor: '#fff', 
                  }
                },
                maintainAspectRatio: true, 
                scales: {
                  y: {
                    beginAtZero: true, 
                    ticks: {
                      callback: (value) => `${value}%`, 
                      color: '#416555'  
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
            <div className="mt-4 text-center text-[#416555] dark:text-gray-100">
              <p>تعداد کل وظایف: {totalTasks}</p>
              <p>تعداد وظایف در وضعیت شروع: {totalStartTasks}</p>
              <p>تعداد وظایف در وضعیت پایان: {totalEndTasks}</p>
            </div>
          </>
        )}

        <div id="reportButtons" className="mt-6 flex justify-between fixed bottom-4 right-4"> 
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
