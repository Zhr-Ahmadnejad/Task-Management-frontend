import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AddEditBoardModal from "../Modals/AddEditBoardModal";

function EmptyBoard({ type, check, setCheck }) {
  // State برای کنترل باز بودن یا بسته بودن مدال ایجاد/ویرایش برد
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  // دریافت توکن JWT از کوکی‌ها
  const tokenData = Cookies.get('token');

  // استفاده از هوک useNavigate برای پیمایش بین صفحات
  const navigate = useNavigate();

  // استفاده از هوک useEffect برای بارگذاری اطلاعات بعد از اولین رندر کامپوننت
  useEffect(() => {
    // بررسی وجود توکن و اینکه آیا وضعیت check تغییر کرده است یا خیر
    if (tokenData && check) {
      (async () => {
        try {
          // ارسال درخواست GET به API برای دریافت لیست بردهای کاربر
          const { data } = await axios.get("http://localhost:8088/api/user/boards", {
            headers: {
              Authorization: `Bearer ${tokenData}`  // اضافه کردن توکن به هدر درخواست برای احراز هویت
            }
          });

          // اگر داده‌ای دریافت شد، وضعیت check را به‌روزرسانی کن
          if (data) {
            setCheck(check + 1);
          }
        } catch (err) {
          // در صورت بروز خطا، بررسی اینکه آیا دلیل آن امضای نامعتبر توکن است
          if (err.response.data === 'The token signature is invalid. ') {
            // حذف توکن از کوکی‌ها و هدایت کاربر به صفحه ثبت‌نام
            Cookies.remove('token');
            navigate("/signup");
            // بارگذاری مجدد صفحه بعد از هدایت به صفحه ثبت‌نام
            navigate(0);
          }
        }
      })();
    } else if (!tokenData) {
      // اگر توکن وجود ندارد، حذف توکن از کوکی‌ها و هدایت کاربر به صفحه ثبت‌نام
      Cookies.remove('token');
      navigate("/signup");
      // بارگذاری مجدد صفحه بعد از هدایت به صفحه ثبت‌نام
      navigate(0);
    }
  }, [tokenData, check, navigate]);

  return (
    <div className="bg-white dark:bg-[#2b2c37] h-screen w-screen flex flex-col items-center justify-center">
      {/* نمایش پیام متفاوت بر اساس نوع "edit" یا حالت عادی */}
      <h3 className="text-gray-500 font-bold">
        {type === "edit"
          ? "این برد خالیه . ستون جدید بساز تا باهم شروع کنیم"
          : "هیچ بردی وجود نداره . قدم اول اینه که تو برد مخصوص خودتو بسازی"}
      </h3>
      <button
        onClick={() => {
          // تغییر وضعیت isBoardModalOpen به true برای باز کردن مدال
          setIsBoardModalOpen(true);
        }}
        className="w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#416555] mt-8 relative text-white bg-[#416555] py-2 rounded-full"
      >
        {/* تغییر متن دکمه بر اساس نوع "edit" یا حالت عادی */}
        {type === "edit" ? "+ ساختن ستون جدید" : "+ ساختن برد جدید"}
      </button>
      {/* نمایش مدال برای اضافه کردن یا ویرایش برد بر اساس وضعیت isBoardModalOpen */}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type={type}
          setBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default EmptyBoard;
