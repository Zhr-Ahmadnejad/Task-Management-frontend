import React from "react";

function Subtask({ data_sub, change }) {
  // دریافت داده‌های وظیفه فرعی و تابع بروزرسانی تغییرات از props
  // data_sub: شامل اطلاعات وظیفه فرعی شامل عنوان و وضعیت فعال یا غیرفعال آن
  // change: تابعی که به عنوان onChange برای چک‌باکس وظیفه فرعی استفاده می‌شود

  return (
    <div className="w-full flex hover:bg-[#5fc76240] dark:hover:bg-[#5fc76240] rounded-md relative items-center justify-start text-black dark:text-white dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd]">
      <input
        className="w-4 h-4 accent-[#416555] cursor-pointer"
        type="checkbox"
        checked={!data_sub.active} // تنظیم وضعیت چک‌باکس بر اساس وضعیت فعال بودن وظیفه
        onChange={(e) => change(e, data_sub.id)} // اجرای تابع تغییر با تغییرات چک‌باکس
      />
      <p className={data_sub.active ? "" : "line-through opacity-30"}>
        {data_sub.title} {/* نمایش عنوان وظیفه با خط کشیده اگر غیرفعال باشد */}
      </p>
    </div>
  );
}

export default Subtask;

