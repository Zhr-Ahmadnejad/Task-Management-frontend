import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Registering the necessary chart.js components
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user_token = Cookies.get('token');

      try {
        // Fetching the tasks data for start, end states and all tasks
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

        // Calculating percentages
        const startPercentage = (totalStartTasks / totalTasks * 100).toFixed(2);
        const endPercentage = (totalEndTasks / totalTasks * 100).toFixed(2);

        // Setting chart data
        setChartData({
          labels: ['شروع', 'پایان'],
          datasets: [{
            label: 'درصد تسک‌ها در وضعیت‌های شروع و پایان',
            data: [startPercentage, endPercentage],
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            borderColor: ['rgba(75, 192, 192, 1.5)', 'rgba(255, 99, 132, 1.5)'],
            borderWidth: 1,
          }]
        });

        setLoading(false);
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها.');
        console.error('Failed to fetch tasks:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBackClick = () => {
    navigate('/home'); // Navigate back to home page
  };

  return (
    <div className="min-h-screen bg-[#416555] dark:bg-[#20212c] p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#2b2c37] p-6 rounded-lg shadow-md border border-[#416555]">
        <h2 className="text-2xl font-bold mb-4 text-[#416555] dark:text-gray-100">
          نمودار وضعیت تسک‌ها
        </h2>

        {loading ? (
          <p className="text-center text-[#416555] dark:text-gray-400">در حال بارگذاری داده‌ها...</p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'نمودار درصد تسک‌ها در وضعیت‌های شروع و پایان',
                  color: '#416555'  // Change the chart title color
                },
                legend: {
                  position: 'top',
                  labels: {
                    color: '#416555'  // Change the legend color
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.label}: ${context.raw}%`;
                    }
                  },
                  backgroundColor: '#416555', // Tooltip background color
                  titleColor: '#fff', // Tooltip title color
                  bodyColor: '#fff', // Tooltip body color
                }
              },
              maintainAspectRatio: true, // Ensure chart maintains aspect ratio
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `${value}%`,
                    color: '#416555'  // Change the y-axis labels color
                  },
                  grid: {
                    color: '#416555'  // Change the y-axis grid line color
                  }
                },
                x: {
                  grid: {
                    color: '#416555'  // Change the x-axis grid line color
                  }
                }
              },
            }}
          />
        )}

        <button
          onClick={handleBackClick}
          className="mt-6 bg-[#2b4d3f] text-white px-4 py-2 rounded hover:bg-[#1f3b31] dark:bg-[#2b2c37] dark:hover:bg-[#3b3c47]"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
};

export default TaskChartPage;
