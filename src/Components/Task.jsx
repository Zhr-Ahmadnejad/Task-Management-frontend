import React, {useEffect, useState} from "react";
import TaskModal from "../Modals/TaskModal";
import {useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Task({ colIndex, taskIndex, col_data, setCheck, allTasks }) {
  const [task_sorted, setTask_sorted] = useState([]);  // استفاده از استیت برای نگهداری لیست مرتب‌شده وظایف
  const [all_task_checked, setAll_task_checked] = useState([]);  // استفاده از استیت برای نگهداری لیست وظایف که بررسی شده‌اند

  // پیدا کردن آخرین ستون با stateName 'پایان' از میان همه ستون‌ها
  const final_col = allTasks.find((itm) => itm.stateName === 'پایان');

  // دریافت پارامترهای جستجو از URL
  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  // دریافت توکن کاربر از کوکی‌ها
  const user_token = Cookies.get('token');

  // افزودن اثر بخش برای دریافت وظایف از سرور بر اساس پارامترهای جستجو و توکن
  useEffect(() => {
    if (queryParam !== 'dashboard' && user_token) {
      (async () => {
        try {
          const { data } = await axios.get(`http://localhost:8088/api/user/board/tasks/boardId/${+queryParam}`, {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          });

          if (data) {
            // فیلتر و مرتب‌سازی وظایف دریافتی از API
            const filtered = data.map(task => ({
              id: task.id,
              taskStateId: task.taskStateId,
              dependentTaskIds: task.dependentTaskIds,
              draggable: false,
            }));

            const sorted = sortTasks(filtered);  // مرتب‌سازی وظایف

            setTask_sorted(sorted);  // تنظیم وظایف مرتب‌شده در استیت
          }
        } catch (err) {
          console.log(err);  // نمایش خطا در صورت وجود خطا
        }
      })();
    }
  }, [queryParam, user_token]);

  // تابع برای کنترل حرکت موس بر روی عناصر قابل کشیدن
  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ prevColIndex: colIndex, taskIndex: col_data.id })
    );
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);  // استفاده از استیت برای نمایش یا عدم نمایش مدال وظیفه

  // تابع برای باز کردن مدال وظیفه
  const task_handler = () => {
    setIsTaskModalOpen(true);
  };

  // محاسبه تعداد وظایف کامل شده
  const check_completed = col_data?.subTasks.filter(task => !task.active).length;

  // تابع برای مرتب‌سازی وظایف بر اساس وابستگی‌هایشان
  const sortTasks = (tasks) => {
    const result = [];
    const taskMap = new Map();

    tasks.forEach(task => {
      taskMap.set(task.id, task);
    });

    tasks.forEach(task => {
      if (task.dependentTaskIds.length === 0) {
        result.push(task);
      }
    });

    let i = 0;
    while (i < result.length) {
      const currentTask = result[i];
      tasks.forEach(task => {
        if (task.dependentTaskIds.includes(currentTask.id) && !result.includes(task)) {
          result.push(task);
        }
      });
      i++;
    }

    return result;
  };

  // تابع برای بروزرسانی درستی عملکرد موارد آزمایشی
  const test = () => {
    // بررسی خالی بودن آرایه وظایف
    const is_empty_array = task_sorted
      .filter(task => task.dependentTaskIds.length === 0)
      .every(task => task.taskStateId === final_col.id);

    // بروزرسانی لیست وظایف با تنظیم قابلیت کشیدن برای وظایف غیر وابسته
    const updatedTasks = task_sorted.map(task => {
      if (task.dependentTaskIds.length === 0) {
        return { ...task, draggable: true };
      }
      return task;
    });

    // بروزرسانی دوم لیست وظایف با تنظیم قابلیت کشیدن برای وظایف غیر وابسته
    const updateTask2 = updatedTasks.map(itm => {
      if (itm.dependentTaskIds.length === 0) {
        return { ...itm, draggable: true };
      }
      return itm;
    });

    let foundFirstFalse = false;
    let stopProcessing = false;

    // بروزرسانی سوم لیست وظایف با توجه به شرایط مختلف
    const updatedTasks3 = updateTask2.map(task => {
      if (stopProcessing) {
        return { ...task, draggable: false };
      }

      if (is_empty_array) {
        if (!foundFirstFalse && !task.draggable) {
          foundFirstFalse = true;

          if (task.taskStateId === final_col.id) {
            return {
              ...task,
              draggable: true
            };
          }
        }

        if (foundFirstFalse && task.taskStateId !== final_col.id) {
          stopProcessing = true;
          return {
            ...task,
            draggable: true
          };
        }
      }

      return task;
    });

    setAll_task_checked(updatedTasks3);  // تنظیم لیست وظایف بروزرسانی شده
  };

  useEffect(() => {
    test();  // اعمال تابع آزمایشی بر روی تغییرات در task_sorted
  }, [task_sorted]);

  // بررسی کشیده شدن برای عنصر فعلی
  const checkDrag = all_task_checked.find((itm) => itm?.id === col_data?.id);

  // بازگشت به UI
  return (
    <div>
      {queryParam === 'dashboard' ? (
        // UI برای حالت داشبورد
        <div
          onClick={task_handler}
          draggable={true}
          onDragStart={handleOnDrag}
          className={`w-[280px] first:my-5 rounded-lg bg-green-300 dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 
            shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer
          `}
        >
          <p className="font-bold tracking-wide">{col_data.taskName}</p>
          <p className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
          وظایف فرعی تکمیل شده {check_completed} / {col_data?.subTasks.length} 
          </p>
        </div>
      ) : (
        // UI برای حالت عادی
        <>
          {checkDrag && (
            <div
              onClick={task_handler}
              draggable={checkDrag.draggable}
              onDragStart={handleOnDrag}
              className={`w-[280px] first:my-5 rounded-lg bg-green-300 dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 
                shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer
                ${checkDrag.draggable ? "" : "bg-red-400 dark:bg-red-400"}
              `}
            >
              <p className="font-bold tracking-wide">{col_data.taskName}</p>
              <p className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
              وظایف فرعی تکمیل شده {check_completed} / {col_data?.subTasks.length} 
              </p>
            </div>
          )}
        </>
      )}

      {/* نمایش مدال وظیفه اگر باز باشد */}
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
          task_data={col_data}
          setCheck={setCheck}
        />
      )}
    </div>
  );
}

export default Task;
