import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import crossIcon from "../Assets/crossIcone.png";
import XIcon from "../Components/icons/x-icon.jsx";
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";


function AddEditBoardModal({ setBoardModalOpen, type, setCheck }) {
  // وضعیت نام برد
  const [name, setName] = useState('');
  // وضعیت نام برد اصلی در حالت ویرایش
  const [name_avalie, setName_avalie] = useState('');
  // وضعیت برای تشخیص اینکه آیا این اولین بار است که برد اضافه می‌شود یا خیر
  const [first_add, setFirst_add] = useState(false);

  // وضعیت برای مدیریت ستون‌های جدید
  const [newColumns, setNewColumns] = useState([
    { name: 'شروع', task: [], id: uuidv4() },
    { name: 'پایان', task: [], id: uuidv4() },
  ]);

  // توکن کاربر برای احراز هویت در درخواست‌های API
  const user_token = Cookies.get('token');

  // دریافت پارامترهای جست‌وجو از URL
  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get('');

  // هنگام بارگذاری کامپوننت بررسی می‌کند که آیا پارامتر جست‌وجو موجود نیست و اولین بار است که برد اضافه می‌شود
  useEffect(() => {
    if (!queryParam) setFirst_add(true);
  }, []);

  console.log('Board ID edit:', queryParam);

  // بارگذاری داده‌های برد در صورت ویرایش یا ویرایش مجدد
  useEffect(() => {
    if (type === 'edit' || type === 'edit-2') {
      try {
        (async () => {
          const { data } = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
            headers: {
              Authorization: `Bearer ${user_token}`,
            },
          });

          // تنظیم نام برد و ستون‌ها از داده‌های API
          setName(data.boardName);
          setName_avalie(data.boardName);

          const new_column_sort = data.taskStates.map((itm) => ({
            id: itm.id,
            name: itm.stateName,
            task: [],
          }));

          setNewColumns(new_column_sort);
        })();
      } catch (err) {
        console.log(err);
      }
    }
  }, []); // فقط بارگذاری اولیه هنگام تغییر نوع یا پارامتر جست‌وجو

  // تغییر نام ستون با شناسه مشخص
  const onChange = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  // حذف ستون با شناسه مشخص
  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  // اعتبارسنجی ورودی‌های فرم
  const validate = () => {
    if (!name.trim()) {
      toast.error('قسمت نام خالیه');
      return false;
    }

    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        toast.error('اسم ستون خالیه');
        return false;
      }
    }

    return true;
  };

  const navigate = useNavigate();

  // ارسال فرم برای اضافه کردن یا ویرایش برد
  const onSubmit = async () => {
    const isValid = validate();
    if (isValid) {
      const board_columns = newColumns.map((item) => item.name);

      if (type === 'add') {
        try {
          const { data } = await axios.post('http://localhost:8088/api/user/boards', {
            boardName: name,
            taskStates: board_columns,
          }, {
            headers: {
              Authorization: `Bearer ${user_token}`,
            },
          });

          if (first_add) {
            toast.success('برد ذخیره شد');
            navigate(0);  // بارگذاری مجدد صفحه برای نمایش برد جدید
          } else {
            toast.success('برد ذخیره شد');
            setBoardModalOpen(false);
            setCheck((prevState) => prevState + 1);  // به‌روزرسانی وضعیت برای نمایش تغییرات جدید
          }
        } catch (err) {
          console.log(err);
          if (err.response.data === 'The token signature is invalid. ') {
            Cookies.remove('token');
            navigate(0);  // بارگذاری مجدد صفحه در صورت اعتبارسنجی نامعتبر
          } else if (err.response.data === 'A board with the same name already exists for this user') {
            toast.error('برد با این نام وجود دارد');
          }
        }
      } else if (type === 'edit' || type === 'edit-2') {
        try {
          await axios.put(`http://localhost:8088/api/user/boards/${+queryParam}`, {
            boardName: type === 'edit-2' ? null : name_avalie === name ? null : name,
            taskStates: board_columns.length > 0 ? board_columns : [],
          }, {
            headers: {
              Authorization: `Bearer ${user_token}`,
            },
          });

          toast.success('تغییرات ذخیره شد.');
          setBoardModalOpen(false);
          navigate(0);  // بارگذاری مجدد صفحه برای نمایش تغییرات
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  // اضافه کردن ستون جدید بین ستون‌های موجود
  const addNewColumnBetween = () => {
    const newColumn = { name: '', task: [], id: uuidv4() };
    const newColumnsArray = [...newColumns];
    const insertIndex = newColumnsArray.length - 1;
    newColumnsArray.splice(insertIndex, 0, newColumn);
    setNewColumns(newColumnsArray);
  };

  return (
    // پس‌زمینه مودال با قابلیت بستن از طریق کلیک در بیرون از محتوای مودال
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);  // بستن مودال هنگام کلیک خارج از آن
      }}
      className='fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scrol z-50 justify-center items-center flex bg-[#00000080]'
    >
      <div
        className='scrollbar-hide overflow-y-scroll max-h[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl'
      >
        {/* دکمه بستن مودال */}
        <button onClick={() => setBoardModalOpen(false)}>
          <XIcon classes={"w-10"} />
        </button>

        <h3 className='text-lg'>
          {type === 'edit' ? 'ویرایش' : 'ساخت'} برد
        </h3>

        {/* ورودی نام برد برای حالت‌های مختلف */}
        {type !== 'edit-2' && (
          <div className="mt-8 flex flex-col space-y-1">
            <label className='text-sm dark:text-white text-gray-500'>
              اسم برد
            </label>
            <input
              className='bg-transparent px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555] outline-1 right-0'
              placeholder='به طور مثال : تکالیف دانشگاه'
              value={name}
              onChange={(e) => setName(e.target.value)}
              id='board-name-input'
            />
          </div>
        )}

        {/* لیست ستون‌های برد و امکان اضافه/حذف ستون */}
        <div className='mt-8 flex flex-col space-y-3'>
          <label className='text-sm dark:text-white text-gray-500'>
            ستون‌های برد
          </label>
          {newColumns.map((column, index) => (
            <div key={index} className='flex items-center w-full'>
              <input
                className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]'
                onChange={(e) => {
                  onChange(column.id, e.target.value);  // تغییر نام ستون
                }}
                value={column.name}
                type='text'
                disabled={column.name === 'شروع' || column.name === 'پایان'}  // ستون‌های ثابت قابل ویرایش نیستند
              />
              {column.name !== 'شروع' && column.name !== 'پایان' ? (
                <img
                  src={crossIcon}
                  className='w-5 h-5 cursor-pointer m-4'
                  onClick={() => onDelete(column.id)}  // حذف ستون
                />
              ) : (
                <div className={""} />
              )}
            </div>
          ))}
        </div>

        {/* دکمه‌های اضافه کردن ستون جدید و ارسال فرم */}
        <div>
          <button
            className='w-full items-center hover:opacity-75 dark:text-[#416555] dark:bg-white text-white bg-[#416555] py-2 mt-2 rounded-full'
            onClick={addNewColumnBetween}  // اضافه کردن ستون جدید
          >
            + اضافه کردن ستون جدید
          </button>
          <button
            className='w-full items-center hover:opacity-75 dark:text-white dark:bg-[#416555] text-white bg-[#416555] py-2 mt-8 rounded-full'
            onClick={onSubmit}  // ارسال فرم برای اضافه/ویرایش برد
          >
            {type === 'add' ? 'ساخت برد جدید' : 'ذخیره ی تغییرات'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;