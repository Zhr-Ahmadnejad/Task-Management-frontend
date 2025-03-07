import React from "react";

function DeleteModal({ type, title, onDeleteBtnClick, toggleDeleteModal }) {


  return (
    // Modal Container
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        toggleDeleteModal();
      }}
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]"
    >
      {/* Delete Modal  */}

      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl ">
        <h3 className=" font-bold text-red-500 text-xl  ">
          میخای پاکش کنی؟
        </h3>
        {type === "task" ? (
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
            واقعا میخای این وظیفه و زیر وظیفه هارو پاک کنی؟ یادت باشه اگه پاکشون کنی دیگه قابل برگشت نیستنهاااا
          </p>
        ) : (
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
            واقعا میخای این برد رو پاک کنی؟ یادت باشخ اگه پاک کنی تمام ستون ها و وظایف پاک میشن و قابل بازگشت نیست هااا
          </p>
        )}

        <div className=" flex w-full mt-4 items-center justify-center space-x-4 ">
          <button
            onClick={onDeleteBtnClick}
            className="w-full items-center text-white hover:opacity-75 bg-red-500 py-2 rounded-full"
          >
            پاک کردن
          </button>
          <button
            onClick={toggleDeleteModal}
            className="w-full items-center text-[#416555] dark:bg-white hover:opacity-75 bg-[#635fc71a]  py-2 rounded-full"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
