import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import boardIcon from '../Assets/board-icone.jpg'
import lightIcon from '../Assets/icon-light-theme.svg'
import darkIcon from '../Assets/icon-dark-theme.svg'
import {Switch} from '@headlessui/react'
import useDarkMode from '../Hooks/useDarkMode'
import SignoutIcon from '../Assets/sign_out_icon.jpg'
import aboutUsIcon from '../Assets/about-us-icon_final.jpg';
import {useNavigate, useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";


function HeaderDropdown({ setOpenDropdown, setBoardModalOpen }) {
    const [colorTheme, setTheme] = useDarkMode(); // وضعیت تم را از hook useDarkMode دریافت می‌کند
    const [darkSide, setdarkSide] = useState(colorTheme === 'light'); // وضعیت تاریکی/روشنی را بر اساس تم فعلی تنظیم می‌کند
    const [all_boards, setAll_boards] = useState([]); // لیست تمام بردها از API
    const [check, setCheck] = useState(1); // متغیر برای انجام مجدد درخواست به API
    const [boards_length, setBoards_length] = useState(0); // تعداد بردهای دریافت شده از API
    const dispatch = useDispatch(); // استفاده از useDispatch برای ارسال اعمال به store Redux

    // تغییر وضعیت تاریکی/روشنی
    const toggleDarkMode = (checked) => {
        setTheme(colorTheme); // تنظیم وضعیت تم بر اساس تم فعلی
        setdarkSide(checked); // تنظیم وضعیت تاریکی/روشنی بر اساس وضعیت چک‌باکس
    };

    const boards = useSelector((state) => state.boards); // دریافت لیست بردها از store Redux

    // درخواست دریافت بردها از API
    useEffect(() => {
        (async () => {
            const user_token = Cookies.get('token'); // دریافت توکن از کوکی‌ها

            try {
                const { data } = await axios.get("http://localhost:8088/api/user/boards", {
                    headers: {
                        Authorization: `Bearer ${user_token}` // ارسال توکن به عنوان هدر درخواست
                    }
                });

                if (data) {
                    setBoards_length(data.length); // تنظیم تعداد بردهای دریافت شده
                    setAll_boards(data); // تنظیم لیست تمام بردها
                }
            } catch (err) {
                if (err.response.data === 'The token signature is invalid. ') {
                    signoutHandler(); // اجرای عملیات خروج در صورت نامعتبر بودن توکن
                }
            }
        })();
    }, [check]);

    const navigate = useNavigate(); // استفاده از useNavigate برای انتقال به صفحات مختلف در React Router

    // عملیات خروج کاربر
    const signoutHandler = () => {
        Cookies.remove('token'); // حذف توکن از کوکی‌ها
        navigate("/signup", {
            replace: true // جایگزین کردن مسیر جاری با /signup
        });
    };

    // انتقال به صفحه برد با شناسه مشخص
    const board_handle = (id) => {
        navigate(`/home?=${id}`); // انتقال به صفحه خانه با اضافه کردن پارامتر شناسه برد
        setOpenDropdown(false); // بستن منو Dropdown پس از انتقال
    };

    let [searchParams] = useSearchParams(); // دریافت پارامترهای جستجو از آدرس
    let queryParam = searchParams.get(""); // دریافت مقدار پارامتر جستجوی فعلی

    // انتقال به صفحه داشبورد
    const go_to_dashboard = () => {
        navigate('/home?=dashboard'); // انتقال به صفحه خانه با اضافه کردن پارامتر dashboard
        setOpenDropdown(false); // بستن منو Dropdown پس از انتقال
    };

    const go_to_chart_page = () => {
        navigate('/task-chart');
        setOpenDropdown(false);
    };

    return (
        <div
            className=' py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-20 bg-[#00000080]'
            onClick={
                (e) => {
                    if (e.target !== e.currentTarget) {
                        return; // جلوگیری از بستن منو در صورت کلیک بر روی محتویات آن
                    }
                    setOpenDropdown(false); // بستن منو Dropdown در صورت کلیک بر روی پس زمینه
                }
            }
        >

            {/* Modal Dropdown */}
            <div className='bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl'>
                <h3 className=' dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8'>
                    تمام بردها ({boards ? boards.length : 0}) {/* نمایش تعداد کل بردها */}
                </h3>

                <div>
                    {/* نمایش لیست تمام بردها */}
                    {all_boards.map((itm) => (
                        <div
                            className={`cursor-pointer dark:text-white flex items-baseline space-x-2 px-5 py-4 
                                ${queryParam === itm.id.toString() && 'bg-[#416555] rounded-r-full text-white mr-8'}`}
                            key={itm.id}
                            onClick={() => board_handle(itm.id)}
                        >
                            <img src={boardIcon} className='h-4'/>
                            <p className=' text-lg font-bold'> {itm.boardName}</p>
                        </div>
                    ))}

                    {/* دکمه ساخت برد جدید */}
                    <div className=' cursor-pointer flex items-baseline space-x-2 text-[#416555] px-5 py-4'
                         onClick={() => {
                             setBoardModalOpen(true); // باز کردن مدال ساخت برد جدید
                             setOpenDropdown(false); // بستن منو Dropdown
                         }}
                    >
                        <img src={boardIcon} className='h-4 '/>
                        <p className='text-lg font-bold'>
                            ساختن برد جدید
                        </p>
                    </div>

                    {/* دکمه داشبورد */}
                    <div className=' cursor-pointer flex items-baseline space-x-2 text-[#416555] px-5 py-4'
                         onClick={go_to_dashboard}
                    >
                        <img src={boardIcon} className='h-4 '/>
                        <p className='text-lg font-bold'>
                            داشبورد
                        </p>
                    </div>

                    <div className=' cursor-pointer flex items-baseline space-x-2 text-[#416555] px-5 py-4'
                         onClick={go_to_chart_page} 
                    >
                        <img src={boardIcon} className='h-4 '/>
                        <p className='text-lg font-bold'>
                            نمودار وضعیت تسک‌ها
                        </p>
                    </div>

                    {/* دکمه درباره‌ی ما */}
                    <div
                        onClick={() => {
                            window.location.href = '/aboutUs'; // انتقال به صفحه درباره‌ی ما با استفاده از window.location.href
                        }}
                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                    text-[#416555] px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                        <img src={aboutUsIcon} alt='signout' className='h-4'/>
                        <p className=' text-lg font-bold'>
                            درباره ی ما
                        </p>
                    </div>

                    {/* دکمه تنظیمات */}
                    <div
                        onClick={() => {
                            window.location.href = '/ProfilePage'; // انتقال به صفحه تنظیمات کاربری با استفاده از window.location.href
                        }}
                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                    text-[#416555] px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                        <img src={aboutUsIcon} alt='signout' className='h-4'/>
                        <p className=' text-lg font-bold'>
                            تنظیمات
                        </p>
                    </div>

                    {/* دکمه خروج */}
                    <div
                        onClick={signoutHandler}
                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                     text-red-700 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                        <img src={SignoutIcon} alt='signout' className='h-4'/>
                        <p className=' text-lg font-bold'>
                            خروج
                        </p>
                    </div>

                    {/* دکمه تغییر تم */}
                    <div
                        className=" mx-2  p-4  space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
                        <img src={lightIcon} alt="sun indicating light mode"/>

                        <Switch
                            checked={darkSide}
                            onChange={toggleDarkMode}
                            className={`${
                                darkSide ? "bg-[#416555]" : "bg-gray-200"
                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable notifications</span>
                            <span
                                className={`${
                                    darkSide ? "translate-x-6" : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>

                        <img src={darkIcon} alt="moon indicating dark mode"/>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default HeaderDropdown;

