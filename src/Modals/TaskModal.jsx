import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ElipsisMenu from "../Components/ElipsisMenu";
import elipsis from "../Assets/elipsis3.png";
import boardsSlice from "../Redux/boardsSlice";
import Subtask from "../Components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import XIcon from "../Components/icons/x-icon.jsx";
import axios from "axios";
import Cookies from "js-cookie";


// کامپوننت مودال تسک برای نمایش جزئیات و عملیات‌های مختلف
function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen, task_data, setCheck }) {
    // وضعیت برای ذخیره داده‌های تسک‌های فرعی
    const [subTask_data, setSubTask_data] = useState([]);

    // به‌روزرسانی داده‌های تسک‌های فرعی هنگام تغییر task_data
    useEffect(() => {
        setSubTask_data(task_data?.subTasks);
    }, [task_data?.subTasks]);

    // دریافت توکن کاربر از کوکی‌ها برای احراز هویت در درخواست‌های API
    const user_token = Cookies.get('token');

    // استفاده از dispatch برای ارسال اکشن‌ها به ریداکس
    const dispatch = useDispatch();

    // وضعیت برای نمایش یا پنهان کردن منوی کشویی
    const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);

    // وضعیت برای نمایش یا پنهان کردن مودال حذف
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // دریافت اطلاعات بردها از ریداکس
    const boards = useSelector((state) => state.boards);

    // پیدا کردن برد فعال
    const board = boards.find((board) => board.isActive === true);
    const columns = board.columns;

    // پیدا کردن ستون و تسک بر اساس اندیس‌های ورودی
    const col = columns.find((col, i) => i === colIndex);
    const task = col.tasks.find((task, i) => i === taskIndex);
    const subtasks = task.subtasks;

    // محاسبه تعداد تسک‌های فرعی تکمیل‌شده
    let completed = 0;
    subtasks.forEach((subtask) => {
        if (subtask.isCompleted) {
            completed++;
        }
    });

    // وضعیت برای ذخیره وضعیت تسک و اندیس ستون جدید
    const [status, setStatus] = useState(task.status);
    const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));

    // تغییر وضعیت تسک و اندیس ستون جدید هنگام تغییر انتخاب از منوی کشویی
    const onChange = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex);
    };

    // بستن مودال هنگام کلیک در خارج از محتوای مودال
    const onClose = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        setIsTaskModalOpen(false);
    };

    // بستن مودال و ارسال تغییرات وضعیت تسک به ریداکس
    const closeHandler = () => {
        dispatch(
            boardsSlice.actions.setTaskStatus({
                taskIndex,
                colIndex,
                newColIndex,
                status,
            })
        );
        setIsTaskModalOpen(false);
    };

    // حذف تسک در صورت کلیک روی دکمه "حذف" و به‌روزرسانی وضعیت مودال
    const onDeleteBtnClick = async (e) => {
        if (e.target.textContent === "Delete") {
            try {
                const { data } = await axios.delete(`http://localhost:8088/api/user/board/tasks/${task_data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${user_token}`,
                    }
                });
                if (data) {
                    setIsTaskModalOpen(false);
                    setIsDeleteModalOpen(false);
                    setCheck((prevState) => prevState + 1);  // به‌روزرسانی وضعیت در والد
                }
            } catch (err) {
                console.log(err);  // لاگ خطا در صورت بروز مشکل
            }
        } else {
            setIsDeleteModalOpen(false);  // بستن مودال در صورت کلیک روی گزینه دیگر
        }
    };

    // وضعیت برای نمایش یا پنهان کردن مودال ویرایش تسک
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // باز کردن مودال ویرایش تسک و بستن منوی کشویی
    const setOpenEditModal = () => {
        setIsAddTaskModalOpen(true);
        setIsElipsisMenuOpen(false);
    };

    // باز کردن مودال حذف تسک و بستن منوی کشویی
    const setOpenDeleteModal = () => {
        setIsElipsisMenuOpen(false);
        setIsDeleteModalOpen(true);
    };

    // تغییر وضعیت نمایش یا پنهان کردن مودال حذف
    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    // محاسبه تعداد تسک‌های فرعی غیر فعال
    const check_completed = task_data?.subTasks.filter(task => !task.active).length;

    // تغییر وضعیت تسک‌های فرعی به فعال
    const handle_sub_task_change = async (e, id) => {
        try {
            const { data } = await axios.put(`http://localhost:8088/api/user/boards/tasks/subtasks/isActive/${id}`, {
                isActive: "true"
            }, {
                headers: {
                    'Authorization': `Bearer ${user_token}`,
                }
            });
            if (data) {
                setCheck((prevState) => prevState + 1);  // به‌روزرسانی وضعیت در والد
            }
        } catch (err) {
            console.log(err);  // لاگ خطا در صورت بروز مشکل
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]"
        >
            {/* بخش مودال */}

            <div
                className="scrollbar-hide overflow-y-scroll max-h-[95vh] shadow-[#364e7e1a] my-auto bg-[#416555] dark:bg-[#2b2c37] text-white dark:text-black font-bold shadow-md max-w-md mx-auto w-full px-8 py-8 rounded-xl">
                
                {/* دکمه بستن مودال */}
                <button onClick={closeHandler}>
                    <XIcon classes={"w-10"} />  {/* آیکون بستن مودال */}
                </button>

                <div className="relative flex justify-between w-full items-center">
                    <h1 className="text-lg">{task_data.taskName}</h1>  {/* عنوان تسک */}

                    <img
                        onClick={() => setIsElipsisMenuOpen((prevState) => !prevState)}
                        src={elipsis}  // منوی کشویی برای عملیات مختلف
                        alt="elipsis"
                        className="cursor-pointer h-6"
                    />
                    {isElipsisMenuOpen && (
                        <ElipsisMenu
                            setOpenEditModal={setOpenEditModal}  // تابعی برای باز کردن مودال ویرایش
                            setOpenDeleteModal={setOpenDeleteModal}  // تابعی برای باز کردن مودال حذف
                            type="Task"  // نوع عملیات
                        />
                    )}
                </div>

                <p className="text-green-300 dark:text-gray-500 font-[600] tracking-wide text-xs pt-6 ">
                    {task_data.description}  {/* توضیحات تسک */}
                </p>

                <p className="pt-6 tracking-widest text-sm ">
                    وظایف فرعی ({check_completed} از {task_data?.subTasks.length})  {/* نمایش تعداد تسک‌های فرعی و تعداد تکمیل شده */}
                </p>

                {/* بخش تسک‌های فرعی */}
                <div className="mt-3 space-y-2 ">
                    {subTask_data.map((subtask) => {
                        return (
                            <Subtask
                                data_sub={subtask}  // داده‌های تسک فرعی
                                change={handle_sub_task_change}  // تابع تغییر وضعیت تسک فرعی
                                key={subtask.id}
                            />
                        );
                    })}
                </div>
            </div>

            {/* مودال حذف تسک */}
            {isDeleteModalOpen && (
                <DeleteModal
                    onDeleteBtnClick={onDeleteBtnClick}  // تابع برای حذف تسک
                    type="task"  // نوع مودال
                    title={task_data.taskName}  // عنوان تسک
                    isDeleteModalOpen={isDeleteModalOpen}  // وضعیت باز بودن مودال
                    toggleDeleteModal={toggleDeleteModal}  // تابع برای بستن مودال
                />
            )}

            {/* مودال ویرایش تسک */}
            {isAddTaskModalOpen && (
                <AddEditTaskModal
                    setIsAddTaskModalOpen={setIsAddTaskModalOpen}  // تابع برای بستن مودال ویرایش
                    type="edit"  // نوع عملیات: ویرایش
                    data_edited={task_data}  // داده‌های تسک برای ویرایش
                />
            )}
        </div>
    );
}

export default TaskModal;