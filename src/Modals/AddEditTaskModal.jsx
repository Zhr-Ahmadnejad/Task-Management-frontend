import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import crossIcon from "../Assets/crossIcone.png";
import XIcon from "../Components/icons/x-icon.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";

function AddEditTaskModal({
    type,  // نوع عملیات: "edit" برای ویرایش و "add" برای ایجاد تسک جدید
    device,  // نوع دستگاه برای تعیین کلاس CSS مناسب (موبایل یا دسکتاپ)
    setIsAddTaskModalOpen,  // تابعی برای باز و بسته کردن مودال
    data_edited  // داده‌های تسک برای حالت ویرایش
}) {

    // وضعیت‌های مختلف برای نگهداری داده‌های فرم
    const [title, setTitle] = useState("");  // عنوان تسک
    const [description, setDescription] = useState("");  // توضیحات تسک
    const [list_selector, setList_selector] = useState([]);  // لیست تسک‌های وابسته برای انتخاب
    const [list_tasks, setList_tasks] = useState([]);  // لیست تسک‌های وابسته انتخاب‌شده
    const [status, setStatus] = useState("");  // وضعیت فعلی تسک
    const [subtasks, setSubtasks] = useState([  // تسک‌های فرعی با مقدار اولیه
        { title: "", isCompleted: false, id: uuidv4() },
        { title: "", isCompleted: false, id: uuidv4() },
    ]);
    const [taskState, setTaskState] = useState([]);  // لیست وضعیت‌های تسک
    const [stateId, setStateId] = useState("");  // شناسه وضعیت فعلی

    // دریافت پارامترهای جست‌وجو از URL
    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");  // پارامتر جست‌وجو برای شناسه برد

    const navigate = useNavigate();  // تابعی برای ناوبری در برنامه
    const user_token = Cookies.get('token');  // توکن کاربر از کوکی‌ها برای احراز هویت

    // بارگذاری داده‌های مربوط به تسک‌های وابسته و وضعیت‌های تسک هنگام بارگذاری کامپوننت
    useEffect(() => {
        if (queryParam !== 'dashboard') {
            (async () => {
                try {
                    // درخواست برای دریافت تسک‌های وابسته
                    const { data } = await axios.get(`http://localhost:8088/api/user/board/tasks/boardId/${+queryParam}`, {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    if (data) {
                        const filteredData = data.map(task => ({
                            id: task.id,
                            taskName: task.taskName
                        }));
                        setList_selector(filteredData);  // ذخیره تسک‌های وابسته در وضعیت
                    }
                } catch (err) {
                    console.log(err);  // لاگ خطا در صورت بروز مشکل
                }
            })();
        }
    }, []);  // وابستگی‌های خالی برای اجرای فقط در بارگذاری اولیه

    // بارگذاری داده‌های تسک و وضعیت‌ها هنگام ورود به حالت ویرایش یا ایجاد جدید
    useEffect(() => {
        if (type === "edit") {
            setTitle(data_edited.taskName);  // تنظیم عنوان تسک
            setDescription(data_edited?.description);  // تنظیم توضیحات تسک
            setSubtasks(data_edited?.subTasks);  // تنظیم تسک‌های فرعی

            // تنظیم تسک‌های وابسته با استفاده از داده‌های ویرایش شده
            const filteredTasks = data_edited.dependentTaskIds.map(id => {
                const task = list_selector.find(task => task.id === id);
                return task ? { id: task.id, name: task.taskName } : null;
            }).filter(task => task !== null);

            setList_tasks(filteredTasks);  // ذخیره تسک‌های وابسته انتخاب‌شده

            (async () => {
                try {
                    // دریافت وضعیت‌های تسک برای حالت ویرایش
                    const { data } = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    if (data) {
                        setTaskState(data.taskStates);  // ذخیره وضعیت‌های تسک
                        setStateId(data.taskStates[0].id);  // تنظیم وضعیت اولیه
                    }
                } catch (err) {
                    console.log(err);  // لاگ خطا در صورت بروز مشکل
                }
            })();

        } else {
            (async () => {
                try {
                    // دریافت وضعیت‌های تسک برای حالت ایجاد جدید
                    const { data } = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    if (data) {
                        setTaskState(data.taskStates);  // ذخیره وضعیت‌های تسک
                        setStateId(data.taskStates[0].id);  // تنظیم وضعیت اولیه
                    }
                } catch (err) {
                    console.log(err);  // لاگ خطا در صورت بروز مشکل
                }
            })();
        }
    }, []);  // وابستگی‌های خالی برای اجرای فقط در بارگذاری اولیه

    // به‌روزرسانی عنوان تسک‌های فرعی
    const onChangeSubtasks = (id, newValue) => {
        setSubtasks((prevState) => {
            const newState = [...prevState];
            const subtask = newState.find((subtask) => subtask.id === id);
            subtask.title = newValue;
            return newState;
        });
    };

    // به‌روزرسانی وضعیت فعلی تسک و تنظیم شناسه وضعیت
    const onChangeStatus = (e) => {
        setStatus(e.target.value);

        const find_id = taskState.find((itm) => itm.stateName === e.target.value);
        setStateId(find_id.id);
    };

    // اعتبارسنجی فرم برای اطمینان از پر بودن فیلدها
    const validate = () => {
        if (!title.trim()) {
            return false;
        }
        for (let i = 0; i < subtasks.length; i++) {
            if (!subtasks[i].title.trim()) {
                return false;
            }
        }
        return true;
    };

    // حذف یک تسک فرعی بر اساس شناسه
    const onDelete = (id) => {
        setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
    };

    // بستن مودال در صورت کلیک در خارج از محتوای مودال
    const closeHandler = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        setIsAddTaskModalOpen(false);
    };

    // ایجاد یا ویرایش تسک بر اساس نوع عملیات
    const create_task_handler = async () => {
        const isValid = validate();  // اعتبارسنجی فرم

        const subtaskSort = subtasks.map((itm) => itm.title);  // استخراج عنوان تسک‌های فرعی
        const dependencies = list_tasks.map(itm => itm.id);  // استخراج شناسه‌های تسک‌های وابسته

        if (type === 'edit') {
            try {
                // ارسال درخواست PUT برای ویرایش تسک
                const { data } = await axios.put(`http://localhost:8088/api/user/board/tasks/${data_edited.id}`, {
                    taskName: title ? title : null,
                    description: description ? description : null,
                    taskStateId: stateId ? stateId : null,
                    subTasks: subtaskSort.length > 0 ? subtaskSort : null,
                    dependentTaskIds: dependencies
                }, {
                    headers: {
                        Authorization: `Bearer ${user_token}`
                    }
                });

                if (data) {
                    setIsAddTaskModalOpen(false);
                    navigate(0);  // به‌روزرسانی صفحه
                }
            } catch (err) {
                console.log(err);  // لاگ خطا در صورت بروز مشکل
            }
        } else {
            if (isValid) {
                try {
                    // ارسال درخواست POST برای ایجاد تسک جدید
                    const { data } = await axios.post("http://localhost:8088/api/user/board/tasks", {
                        taskName: title,
                        description: description,
                        taskStateId: stateId,
                        boardId: queryParam,
                        subTasks: subtaskSort,
                        dependentTaskIds: dependencies
                    }, {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    if (data) {
                        setIsAddTaskModalOpen(false);
                        navigate(0);  // به‌روزرسانی صفحه
                    }
                } catch (err) {
                    console.log(err);  // لاگ خطا در صورت بروز مشکل
                }
            }
        }
    };

    // به‌روزرسانی لیست تسک‌های وابسته بر اساس انتخاب
    const handleSelectChange = (event) => {
        if (event.target.value !== '') {
            const findName = list_selector.find((itm) => itm.id === +event?.target?.value);
            const isAvailable = list_tasks.find(itm => itm.id === findName?.id);

            if (!isAvailable) {
                setList_tasks([...list_tasks, { id: findName.id, name: findName.taskName }]);
            }
        }
    };

    // حذف یک تسک وابسته بر اساس شناسه
    const remove_task = (id) => {
        const removing_task = list_tasks.filter(itm => itm.id !== id);
        setList_tasks(removing_task);
    };

    return (
        <div
            className={
                device === "mobile"
                    ? "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown bg-[#00000080] "
                    : "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown  bg-[#00000080]"
            }
            onClick={closeHandler}
        >
            {/* Modal Section */}

            <div
                className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
            >

                <button onClick={() => setIsAddTaskModalOpen(false)}>
                    <XIcon classes={"w-10"}/>
                </button>

                <h3 className=" text-lg ">
                    {type === "edit" ? "ویرایش" : "ساخت"} وظیفه
                </h3>

                {/* Task Name */}

                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        نام تسک
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="task-name-input"
                        type="text"
                        className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#416555] outline-1  ring-0  "
                        placeholder=" به طور مثال : ارسال ایمیل به استاد"
                    />
                </div>

                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        انتخاب تسک های وابسته
                    </label>

                    <select onChange={handleSelectChange}
                            className={"rounded-md text-sm  border-[0.5px] border-gray-600 p-2.5"}>
                        <option value="">به طور مثال : این تسک به تسک انجام پروژه وابسته است</option>
                        {list_selector.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.taskName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-8 flex flex-col space-y-1">
                    <span className="text-sm dark:text-white text-gray-500 text-center">
                        تسکهای وابسته
                    </span>

                   <div className={"flex gap-2.5"}>
                       {list_tasks.map((itm) => (
                           <span key={itm.id} className={"bg-[#416555] p-2.5 text-white rounded-lg"}>
                            {itm.name}

                               <button className={"text-xl ml-2.5"} onClick={() => remove_task(itm.id)}>X</button>
                        </span>
                       ))}
                   </div>

                </div>

                {/* Description */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        توضیحات
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="task-description-input"
                        className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#416555] outline-[1px] "
                        placeholder="به طور مثال : ارسال ایمیل برای تمرین پایانی"
                    />
                </div>

                {/* Subtasks */}

                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        تسکهای فرعی
                    </label>

                    {subtasks.map((subtask, index) => (
                        <div key={index} className="flex items-center w-full">
                            <input
                                onChange={(e) => {
                                    onChangeSubtasks(subtask.id, e.target.value);
                                }}
                                type="text"
                                value={subtask.title}
                                className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#416555] outline-[1px]  "
                                placeholder="  مثال : پیدا کردن ایمیل استاد یا نگارش متن ایمیل "
                            />
                            <img
                                src={crossIcon}
                                onClick={() => {
                                    onDelete(subtask.id);
                                }}
                                className=' w-5 h-5 cursor-pointer m-4'
                            />
                        </div>
                    ))}

                    <button
                        className=" w-full items-center dark:text-[#416555] dark:bg-white  text-white bg-[#416555] py-2 rounded-full "
                        onClick={() => {
                            setSubtasks((state) => [
                                ...state,
                                { title: "", isCompleted: false, id: uuidv4() },
                            ]);
                        }}
                    >
                        + اضافه کردن تسک فرعی جدید
                    </button>
                </div>

                {/* Current Status  */}

                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        وضعیت فعلی
                    </label>
                    <select
                        value={status}
                        onChange={onChangeStatus}
                        className=" select-status cursor-pointer flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#416555] outline-none"
                    >
                        {taskState.map((column, index) => (
                            <option key={index}>{column.stateName}</option>
                        ))}
                    </select>

                    {/* Create "create task button" */}

                    <button
                        onClick={create_task_handler}
                        className=" w-full items-center text-white bg-[#416555] py-2 rounded-full "
                    >
                        {type === "edit" ? " ذخیره ی تغییرات" : "ساخت وظیفه ی جدید"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default AddEditTaskModal;