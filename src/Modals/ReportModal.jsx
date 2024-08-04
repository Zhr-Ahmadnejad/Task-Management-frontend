import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie'; 
import { useSearchParams } from 'react-router-dom'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import moment from 'jalali-moment';  

// ثبت اجزای مورد نیاز برای Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportModal = ({ toggleReportModal }) => { 
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [taskCounts, setTaskCounts] = useState([]); 
  const [totalTasks, setTotalTasks] = useState(0); 
  const [currentDateTime, setCurrentDateTime] = useState(''); 
  const user_token = Cookies.get('token'); 
  const [searchParams] = useSearchParams(); 
  const boardId = searchParams.get(''); 

  useEffect(() => {
    if (!boardId) { 
      setError('Board ID is missing.');
      setLoading(false); 
      return;
    }

    const fetchData = async () => { 
      try {
        const statesResponse = await axios.get(`http://localhost:8088/api/user/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${user_token}` 
          }
        });

        const taskStates = statesResponse.data.taskStates; 
        const taskStateIds = taskStates.map(state => state.id); 
        const taskStateNames = taskStates.map(state => state.stateName);

        
        const tasksPromises = taskStateIds.map(async (stateId) => {
          const tasksResponse = await axios.get('http://localhost:8088/api/user/board/tasks', {
            headers: {
              Authorization: `Bearer ${user_token}`,
              boardId: boardId,
              taskStateId: stateId 
            }
          });

          const taskNames = new Set(tasksResponse.data.map(task => task.taskName)); 
          return {
            count: taskNames.size, 
            stateName: taskStates.find(state => state.id === stateId).stateName 
          };
        });

        
        const tasksData = await Promise.all(tasksPromises);
        const tasksCounts = tasksData.map(data => data.count); 
        const stateNames = tasksData.map(data => data.stateName); 

        const totalTasks = tasksCounts.reduce((acc, count) => acc + count, 0); 

        if (totalTasks === 0) { 
          setError('No tasks found for the selected board.'); 
          setLoading(false);
          return;
        }

        
        const chartData = {
          labels: stateNames, 
          datasets: [{
            label: 'درصد وظایف بر اساس وضعیت',
            data: tasksCounts.map(count => (count / totalTasks) * 100), 
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)', 
            borderWidth: 1,
          }]
        };

        setChartData(chartData); // تنظیم داده‌های نمودار
        setTaskCounts(tasksCounts);
        setTotalTasks(totalTasks); 
        setLoading(false); 
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها.'); 
        console.error('Failed to fetch task states or tasks:', err); 
        setLoading(false); 
      }
    };

    fetchData(); // فراخوانی تابع برای دریافت داده‌ها

    const updateDateTime = () => { 
      const now = moment().format('YYYY/MM/DD HH:mm:ss'); 
      setCurrentDateTime(now);
    };

    updateDateTime(); 
    const intervalId = setInterval(updateDateTime, 1000); 

    return () => clearInterval(intervalId); 
  }, [boardId, user_token]); 

  const printPDF = async () => { 
    // مخفی کردن دکمه‌ها قبل از ضبط محتوا
    const buttons = document.querySelector('#report-buttons');
    if (buttons) buttons.style.visibility = 'hidden'; // مخفی کردن دکمه‌ها
    const input = document.getElementById('report-content'); // دریافت محتوای گزارش
    const canvas = await html2canvas(input, { // تبدیل محتوای HTML به تصویر
      scale: 2,
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png'); 
    const pdf = new jsPDF('p', 'mm', 'a4'); // ایجاد فایل PDF
    pdf.addImage(imgData, 'PNG', 10, 20, 190, 0); // افزودن تصویر به فایل PDF
    pdf.save(`boardReport-${currentDateTime}.pdf`); 

    if (buttons) buttons.style.visibility = 'visible'; // نمایش دوباره دکمه‌ها
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) { 
          return;
        }
        toggleReportModal(); 
      }}
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]" // استایل برای نمایش modal
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl" id="report-content"> {/* استایل برای محتوای گزارش */}
        <h3 className="font-bold text-[#2b4d3f] text-xl text-center"> 
          گزارش درصد وظایف بر اساس وضعیت
        </h3>

        <p className="text-center text-[#6aa088] dark:text-gray-100 mb-4"> 
          تاریخ و زمان: {currentDateTime}
        </p>

        {loading ? ( 
          <p className="text-center text-[#416555] dark:text-gray-400">در حال بارگذاری داده‌ها...</p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div>
            <div style={{ width: '100%', height: '50vh', marginBottom: '5px' }}> 
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
              <ul className="ml-2 text-[#416555] dark:text-gray-100 text-right"> 
                {chartData.labels && chartData.labels.map((label, index) => (
                  <li key={index}>{label}: {taskCounts[index]}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div id="report-buttons" className="flex justify-center mt-6 space-x-4"> 
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

export default ReportModal; 
