import React, { useEffect, useState } from "react";
import AddEditBoardModal from "../Modals/AddEditBoardModal";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./Sidebar";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Center() {

  // State برای ذخیره اندازه‌های کنونی پنجره مرورگر
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    // تابع برای به‌روزرسانی اندازه‌های پنجره در هنگام تغییر اندازه پنجره
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    // اضافه کردن event listener برای تغییر اندازه پنجره
    window.addEventListener("resize", handleWindowResize);

    // حذف event listener هنگام unmount شدن کامپوننت
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  // State برای مدیریت باز بودن/بسته بودن modal ساخت/ویرایش برد
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  // State برای مدیریت باز بودن/بسته بودن نوار کناری (Sidebar)
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  // State برای ذخیره وضعیت‌های مختلف تسک‌ها (ستون‌های تسک‌ها)
  const [task_state, setTask_state] = useState([]);

  // دریافت پارامترهای جستجو از URL
  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  // استفاده از هوک useNavigate برای پیمایش بین صفحات
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // دریافت توکن JWT از کوکی‌ها
      const user_token = Cookies.get('token');

      // اگر پارامتر جستجو وجود داشته و برابر با "dashboard" نباشد
      if (queryParam && queryParam !== 'dashboard') {
        try {
          // ارسال درخواست GET به API برای دریافت وضعیت‌های تسک‌ها بر اساس id برد
          const { data } = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          });

          // به‌روزرسانی وضعیت‌های تسک‌ها با داده‌های دریافت شده از API
          if (data) {
            setTask_state(data.taskStates);
          }
        } catch (err) {
          console.log(err);  // نمایش خطا در کنسول در صورت بروز مشکل
        }

      // اگر پارامتر جستجو برابر با "dashboard" باشد
      } else if (queryParam === 'dashboard') {
        // تنظیم وضعیت‌های تسک‌ها برای نمایش ستون "شروع" در حالت داشبورد
        setTask_state([{
          "id": 3,
          "stateName": "شروع",
          "boardId": 2
        }]);

      } else {
        try {
          // ارسال درخواست GET به API برای دریافت بردها
          const { data } = await axios.get("http://localhost:8088/api/user/boards", {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          });

          // هدایت به صفحه home با id اولین برد موجود
          if (data) {
            navigate(`/home?=${data[0]?.id}`);
          }
        } catch (err) {
          console.log(err);  // نمایش خطا در کنسول در صورت بروز مشکل
        }
      }
    })();
  }, [queryParam]);

  return (
    <div
      style={{ paddingTop: "100px" }}
      // تغییر کلاس بر اساس اندازه پنجره و وضعیت نوار کناری
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? "bg-[#f4f7fd] scrollbar-hide h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6 ml-[261px]"
          : "bg-[#f4f7fd] scrollbar-hide h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6"
      }
    >
      {/* نمایش نوار کناری (Sidebar) در صورتی که اندازه پنجره بزرگتر از 768px و نوار کناری باز باشد */}
      {windowSize[0] >= 768 && (
        <Sidebar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* بخش ستون‌ها */}
      {task_state.length > 0 ? (
        <>
          {/* نمایش ستون‌های تسک‌ها */}
          {task_state.map((col, i) => (
            <Column
              key={col.id}
              dataCol={col}
              colIndex={i}
              column_all={task_state}
            />
          ))}

          {/* نمایش دکمه "ستون جدید" در صورتی که پارامتر جستجو برابر با "dashboard" نباشد */}
          {queryParam !== 'dashboard' && (
            <div
              onClick={() => setIsBoardModalOpen(true)}  // باز کردن modal هنگام کلیک روی دکمه
              className="h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#416555] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2 mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg"
            >
              + ستون جدید
            </div>
          )}
        </>
      ) : (
        <>
          {/* نمایش کامپوننت EmptyBoard در صورت عدم وجود ستون‌ها */}
          <EmptyBoard type="edit" />
        </>
      )}
      {/* نمایش modal برای ساخت/ویرایش برد در صورتی که isBoardModalOpen برابر با true باشد */}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit-2"
          setBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Center;

