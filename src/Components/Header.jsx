import React, {useEffect, useState} from 'react'

import logo from '../Assets/logo.png'
import icondown from '../Assets/icon-chevron-down.svg'
import iconup from '../Assets/icon-chevron-up.svg'
import elipsis from '../Assets/elipsis3.png'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../Modals/AddEditBoardModal'
import AddEditTaskModal from '../Modals/AddEditTaskModal'
import ElipsisMenu from './ElipsisMenu'
import DeleteModal from '../Modals/DeleteModal'
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom"
import axios from "axios";

///creat Header component
function Header({ setBoardModalOpen, boardModalOpen }) {
    // استفاده از useState برای مدیریت وضعیت باز و بسته بودن Dropdown
    const [openDropdown, setOpenDropdown] = useState(false);
    const [boardType, setBoardType] = useState('add');
    const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [nameBoard, setNameBoard] = useState("");

    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");

    const user_token = Cookies.get('token');

    // دریافت نام برد از API بر اساس پارامتر جستجوی فعلی
    useEffect(() => {
        if (queryParam === 'dashboard') {
            setNameBoard("داشبورد");
        } else {
            (async () => {
                try {
                    const { data } = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    if (data) {
                        setNameBoard(data.boardName);
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [queryParam]);

    // باز کردن مدال ویرایش برد
    const setOpenEditModal = () => {
        setBoardModalOpen(true);
        setIsElipsisMenuOpen(false);
    };

    // باز کردن مدال حذف برد
    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
        setIsElipsisMenuOpen(false);
    };

    // حذف برد از API
    const onDeleteBtnClick = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            });

            if (data) {
                setIsDeleteModalOpen(false);
                navigate("/");
                navigate(0);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // بستن مدال حذف برد
    const cancelBtn = () => setIsDeleteModalOpen(false);

    // باز و بسته کردن Dropdown
    const onDropdownClick = () => {
        setOpenDropdown(state => !state);
        setBoardType('add');
    };

    const navigate = useNavigate();

    // بررسی وجود توکن کاربر در هنگام بارگذاری صفحه
    useEffect(() => {
        const tokenData = Cookies.get('token');

        if (!tokenData) {
            navigate("/");
        }
    }, []);

    // باز و بسته کردن منوی الیپسیس
    const open_drop_handle = () => {
        setBoardType("edit");
        setOpenDropdown(false);
        setIsElipsisMenuOpen((prevState) => !prevState);
    };

    const close_dropDown = () => setIsElipsisMenuOpen(false);

    return (
        <div className=' p-4 fixed left-0 bg-[#416555] dark:bg-[#2b2c37] z-50 right-0'>
            <header className=' flex justify-between dark:text-white items-center'>

                {/* Left Side */}
                <div className=' flex items-center space-x-2 md:space-x-4'>
                    <img src={logo} alt='logo' width="300" height="200" className=' hidden md:inline-block' />

                    <div className='flex items-center'>
                        {/* نمایش نام برد */}
                        <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans text-white'>
                            {nameBoard}
                        </h3>
                        {/* نمایش آیکون Dropdown برای نسخه‌های موبایل */}
                        <img
                            src={openDropdown ? iconup : icondown} alt='dropdown icon'
                            className=' h-5 w-5 ml-3 mt-2.5 cursor-pointer md:hidden'
                            onClick={onDropdownClick}
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className=' flex items-center space-x-4 md:space-x-6 '>
                    {/* دکمه ساختن وظیفه جدید (فقط برای صفحات برد) */}
                    {queryParam !== 'dashboard' &&
                        <button
                            onClick={() => setIsTaskModalOpen((prevState) => !prevState)}
                            className='hidden md:block button'
                        >
                            + ساختن وظیفه ی جدید
                        </button>
                    }

                    {/* دکمه ساختن وظیفه جدید و نمایش منوی الیپسیس برای نسخه‌های موبایل */}
                    {queryParam !== 'dashboard' &&
                        <>
                            <button
                                onClick={() => setIsTaskModalOpen((prevState) => !prevState)}
                                className='button py-1 px-3 md:hidden'>
                                +
                            </button>
                            <img
                                onClick={open_drop_handle}
                                src={elipsis}
                                alt="elipsis"
                                className=" cursor-pointer h-6"
                            />
                        </>
                    }

                    {/* نمایش منوی الیپسیس اگر باز باشد */}
                    {isElipsisMenuOpen &&
                        <ElipsisMenu
                            setOpenDeleteModal={setOpenDeleteModal}
                            setOpenEditModal={setOpenEditModal}
                            type='Boards'
                            closeModal={close_dropDown}
                        />
                    }
                </div>

                {/* نمایش Dropdown اگر باز باشد */}
                {openDropdown &&
                    <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropdown={setOpenDropdown} />
                }
            </header>

            {/* نمایش مدال اضافه کردن ویرایش وظیفه */}
            {isTaskModalOpen && (
                <AddEditTaskModal setIsAddTaskModalOpen={setIsTaskModalOpen} type="add" device="mobile" />
            )}

            {/* نمایش مدال اضافه یا ویرایش برد */}
            {boardModalOpen && (
                <AddEditBoardModal setBoardType={setBoardType} type={boardType} setBoardModalOpen={setBoardModalOpen} />
            )}

            {/* نمایش مدال حذف برد اگر باز باشد */}
            {isDeleteModalOpen && (
                <DeleteModal
                    type="board"
                    title={nameBoard}
                    onDeleteBtnClick={onDeleteBtnClick}
                    toggleDeleteModal={cancelBtn}
                />
            )}
        </div>
    );
}

export default Header;
