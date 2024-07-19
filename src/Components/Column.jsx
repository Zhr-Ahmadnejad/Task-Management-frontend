import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";
import Task from "./Task";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";

function Column({ colIndex, dataCol, column_all }) {
  // تعریف رنگ‌های مختلف برای پس‌زمینه ستون
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  // State برای نگهداری رنگ انتخاب شده برای ستون
  const [color, setColor] = useState(null);

  // State برای نگهداری طول ستون (تعداد تسک‌ها)
  const [column_length, setColumn_length] = useState(0);

  // State برای نگهداری داده‌های تسک‌های ستون
  const [column_data, setColumn_data] = useState([]);

  // State برای مدیریت وضعیت به‌روزرسانی داده‌ها
  const [check, setCheck] = useState(1);

  // مرتب‌سازی داده‌های تسک‌ها بر اساس اولویت
  const sortedData = column_data.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));

  // استفاده از هوک useEffect برای انتخاب یک رنگ تصادفی برای ستون
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  // دریافت توکن JWT از کوکی‌ها
  const user_token = Cookies.get('token');

  // دریافت پارامترهای جستجو از URL
  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  // استفاده از هوک useNavigate برای پیمایش بین صفحات
  const navigate = useNavigate();

  // استفاده از هوک useEffect برای بارگذاری داده‌های تسک‌ها بر اساس پارامتر جستجو
  useEffect(() => {
    if (queryParam === 'dashboard') {
      (async () => {
        try {
          // ارسال درخواست GET به API برای دریافت تسک‌های با وضعیت "شروع"
          const { data } = await axios.get("http://localhost:8088/api/user/board/tasks/start", {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          });

          // به‌روزرسانی طول ستون و داده‌های ستون با داده‌های دریافت شده از API
          if (data) {
            setColumn_length(data.length);
            setColumn_data(data);
          }
        } catch (err) {
          console.log(err);  // نمایش خطا در کنسول در صورت بروز مشکل
        }
      })();
    } else {
      (async () => {
        try {
          // ارسال درخواست GET به API برای دریافت تسک‌های ستون خاص
          const { data } = await axios.get("http://localhost:8088/api/user/board/tasks", {
            headers: {
              'Authorization': `Bearer ${user_token}`,
              'taskStateId': dataCol.id,
              'boardId': queryParam
            }
          });

          // به‌روزرسانی طول ستون و داده‌های ستون با داده‌های دریافت شده از API
          if (data) {
            setColumn_length(data.length);
            setColumn_data(data);
          }
        } catch (err) {
          console.log(err);  // نمایش خطا در کنسول در صورت بروز مشکل
        }
      })();
    }
  }, [queryParam, check]);

  // تابع برای مدیریت رویداد رها کردن تسک در ستون
  const handleOnDrop = async (e) => {
    // دریافت اطلاعات تسک و ستون قبلی از داده‌های انتقال
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    // اگر ستون فعلی با ستون قبلی یکسان است، نیازی به انجام کار خاصی نیست
    // if (colIndex !== prevColIndex) {
    //     return;
    // }

    try {
      // ارسال درخواست PUT به API برای به‌روزرسانی وضعیت تسک
      const { data } = await axios.put(
        `http://localhost:8088/api/user/board/tasks/${taskIndex}`,
        {
          taskStateId: dataCol.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      // در صورت موفقیت‌آمیز بودن درخواست، بارگذاری مجدد صفحه
      if (data) {
        navigate(0);
      }
    } catch (err) {
      console.log(err);  // نمایش خطا در کنسول در صورت بروز مشکل
    }
  };

  // تابع برای جلوگیری از رفتار پیش‌فرض مرورگر هنگام کشیدن تسک
  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}  // اختصاص تابع handleOnDrop به رویداد رها کردن
      onDragOver={handleOnDragOver}  // اختصاص تابع handleOnDragOver به رویداد کشیدن روی ستون
      className="scrollbar-hide mx-5 pt-[90px] min-w-[280px]"
    >
      {/* نمایش عنوان ستون شامل رنگ و نام وضعیت با تعداد تسک‌ها */}
      <div className="font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <span className={`rounded-full w-4 h-4 ${color}`} />  {/* نمایش دایره رنگی */}
        {dataCol.stateName} ({column_length})  {/* نمایش نام وضعیت و تعداد تسک‌ها */}
      </div>

      {/* نمایش تسک‌ها در ستون */}
      <div className={`${queryParam === 'dashboard' && "flex gap-2.5 flex-wrap"}`}>
        {sortedData.map((task, index) => (
          <Task
            key={index}
            col_data={task}
            taskIndex={index}
            colIndex={colIndex}
            setCheck={setCheck}
            allTasks={column_all}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;
