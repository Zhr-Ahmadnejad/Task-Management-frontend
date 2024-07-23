import React, {useEffect, useState} from 'react';
import useDarkMode from '../Hooks/useDarkMode';
import boardIcon from '../Assets/board-icone.jpg';
import lightIcon from '../Assets/icon-light-theme.svg';
import darkIcon from '../Assets/icon-dark-theme.svg';
import {Switch} from '@headlessui/react';
import hideSidebarIcon from '../Assets/icon-hide-sidebar.svg';
import showSidebarIcon from '../Assets/icon-show-sidebar.svg';
import AddEditBoardModal from '../Modals/AddEditBoardModal';
import SignoutIcon from '../Assets/sign_out_icon.jpg';
import aboutUsIcon from '../Assets/about-us-icon_final.jpg';
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

function Sidebar({ isSideBarOpen, setIsSideBarOpen }) {
    const [colorTheme, setTheme] = useDarkMode(); // استفاده از useDarkMode برای مدیریت حالت روشن و تاریک
    const [darkSide, setdarkSide] = useState(colorTheme === 'light'); // استفاده از useState برای نگهداری وضعیت حالت تاریک

    const [boards_length, setBoards_length] = useState(0); // استفاده از useState برای نگهداری تعداد بردها
    const [all_boards, setAll_boards] = useState([]); // استفاده از useState برای نگهداری لیست تمام بردها
    const [check, setCheck] = useState(1); // استفاده از useState برای ارسال پرس و جو به سرور در useEffect

    useEffect(() => {
        (async () => {
            const user_token = Cookies.get('token'); // دریافت توکن کاربر از کوکی‌ها

            try {
                const { data } = await axios.get("http://localhost:8088/api/user/boards", {
                    headers: {
                        Authorization: `Bearer ${user_token}` // ارسال توکن به سرور به منظور احراز هویت
                    }
                });

                if (data) {
                    setBoards_length(data.length); // تنظیم تعداد بردها از پاسخ دریافتی از سرور
                    setAll_boards(data); // تنظیم لیست بردها از پاسخ دریافتی از سرور
                }
            } catch (err) {
                if (err.response.data === 'The token signature is invalid. ') {
                    signoutHandler(); // فراخوانی تابع signoutHandler در صورت مشکل در احراز هویت
                }
            }
        })();
    }, [check]); // استفاده از useEffect برای ارسال پرس و جو به سرور در هنگام تغییر check

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme); // تغییر حالت روشن یا تاریک در استفاده از useDarkMode
        setdarkSide(checked); // تغییر حالت روشن یا تاریک در استفاده از useState
    };

    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false); // استفاده از useState برای مدیریت نمایش مدال اضافه کردن برد

    const navigate = useNavigate(); // استفاده از useNavigate برای انتقال به صفحات مختلف در React Router

    const signoutHandler = () => {
        Cookies.remove('token'); // حذف توکن از کوکی‌ها در صورت خروج کاربر
        navigate("/signup", {
            replace: true
        });
    };

    const board_handle = (id) => {
        navigate(`/home?=${id}`); // انتقال کاربر به برد مورد نظر بر اساس شناسه
    };

    const go_to_chart_page = () => {
        navigate('/task-chart');
        setOpenDropdown(false);
    };

    const go_to_dashboard = () => navigate('/home?=dashboard'); // انتقال کاربر به داشبورد

    let [searchParams] = useSearchParams(); // استفاده از useSearchParams برای دریافت پارامترهای جستجو از URL
    let queryParam = searchParams.get(""); // دریافت پارامترهای جستجوی مورد نظر از URL

    return (
        <div>
            <div className={isSideBarOpen ? ' min-w-[261px] bg-[#416555] dark:bg-[#2b2c37] fixed top-[72px] h-screen items-center left-0 z-20 ' : ''}>
                <div style={{ paddingTop: "100px" }}>
                    {/* نمایش مدال اضافه کردن و ویرایش بردها */}
                    {isSideBarOpen && (
                        <div className='w-full rounded-xl bg-[#416555] dark:bg-[#2b2c37]'>
                            <h3 className=' dark:text-gray-300 text-gray-300 font-semibold mx-4 mb-8'>
                                تمام بردها({boards_length})
                            </h3>
                            <div className='flex flex-col h-[60vh] justify-between'>
                                <div>
                                    {all_boards?.map((itm) => (
                                        <div
                                            className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full py-4 duration-500 ease-in-out 
                                                   cursor-pointer hover:bg-white hover:text-[#416555] dark:hover:bg-white dark:hover:text-[#416555] dark:text-white
                                                     ${queryParam === itm.id.toString() && " bg-[#416555] rounded-r-full text-white mr-8"}
                                               `}
                                            key={itm.id}
                                            onClick={() => board_handle(itm.id)}
                                        >
                                            <img src={boardIcon} className=' h-4' alt='board icon' />
                                            <p className=' text-lg font-bold'>
                                                {itm.boardName}
                                            </p>
                                        </div>
                                    ))}

                                    <div
                                        onClick={() => {
                                            setIsBoardModalOpen(true);
                                        }}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                                  text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                    >
                                        <img src={boardIcon} className=' h-4' alt='board icon' />
                                        <p className=' text-lg font-bold'>
                                            ساخت برد جدید
                                        </p>
                                    </div>

                                    <div
                                        onClick={go_to_dashboard}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                                  text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                    >
                                        <img src={boardIcon} className=' h-4' alt='board icon' />
                                        <p className=' text-lg font-bold'>
                                            داشبورد
                                        </p>
                                    </div>

                                    <div
                                        onClick={go_to_chart_page}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                                  text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                    >
                                        <img src={boardIcon} className=' h-4' alt='board icon' />
                                        <p className=' text-lg font-bold'>
                                            نمودار وضعیت وظایف
                                        </p>
                                    </div>

                                    {/* دکمه درباره ما */}
                                    <div
                                        onClick={() => {
                                            window.location.href = '/aboutUs'; // استفاده از window.location.href برای انتقال به صفحه درباره ما
                                        }}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                             text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                    >
                                        <img src={aboutUsIcon} alt='about us' className='h-4' />
                                        <p className=' text-lg font-bold'>
                                            درباره ی ما
                                        </p>
                                    </div>

                                    {/* دکمه تنظیمات */}
                                    <div
                                        onClick={() => {
                                            window.location.href = '/ProfilePage'; // استفاده از window.location.href برای انتقال به صفحه تنظیمات
                                        }}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                    text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                                        <img src={aboutUsIcon} alt='settings' className='h-4' />
                                        <p className=' text-lg font-bold'>
                                            تنظیمات
                                        </p>
                                    </div>

                                    {/* دکمه خروج */}
                                    <div
                                        onClick={signoutHandler}
                                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                     text-red-700 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                                        <img src={SignoutIcon} alt='signout' className='h-4' />
                                        <p className=' text-lg font-bold'>
                                            خروج
                                        </p>
                                    </div>
                                </div>

                                {/* بخش تغییر حالت روشن یا تاریک */}
                                <div
                                    className=' mx-2 px-1 relative space-x-2 bg-[#416555] dark:bg-[#2b2c37] flex justify-center items-center rounded-lg'>
                                    <img src={lightIcon} alt="sun indicating light mode" />

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
                                    <img src={darkIcon} alt="moon indicating dark mode" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* دکمه نمایش/عدم نمایش نوار کناری */}
                    {isSideBarOpen ? (
                        <div
                            onClick={() => setIsSideBarOpen(state => !state)}
                            className=' flex items-center mt-2 absolute bottom-16 text-lg font-bold rounded-r-full hover:text-[#ebf4f0] cursor-pointer mr-6
          mb-8 px-8 py-4 hover:bg-white space-x-2 justify-center my-4 text-gray-500'>
                            <img src={hideSidebarIcon} alt='hideSidebarIcon' className=' min-w-[20px]' />
                            {isBoardModalOpen && <p> Hide Sidebar</p>}
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsSideBarOpen(state => !state)}
                            className='flex items-center mt-2 absolute bottom-0 text-lg font-bold rounded-r-full hover:text-[#ebf4f0] cursor-pointer mr-6
        mb-8 px-8 py-4 space-x-2 justify-center my-4 text-gray-500 bg-[#416555] dark:bg-[#635fc71a] dark:hover:bg-[#416555]'>
                            <img src={showSidebarIcon} alt='showSidebarIcon' className=' min-w-[20px]' />
                        </div>
                    )}
                </div>
            </div>

            {/* نمایش مدال اضافه کردن و ویرایش برد اگر باز باشد */}
            {isBoardModalOpen &&
                <AddEditBoardModal
                    type='add'
                    setBoardModalOpen={setIsBoardModalOpen}
                    setCheck={setCheck}
                />
            }
        </div>
    );
}

export default Sidebar;
