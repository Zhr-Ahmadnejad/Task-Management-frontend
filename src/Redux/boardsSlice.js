import { createSlice } from "@reduxjs/toolkit";
import data from '../Data/data.json'

const boardsSlice = createSlice({
    name: 'boards',
    initialState: data.boards, // استفاده از initialState برای تنظیم وضعیت اولیه برد ها
    reducers: {
        // افزودن برد جدید
        addBoard: (state, action) => {
            const isActive = state.length > 0 ? false : true; // بررسی وضعیت فعال بودن برد جدید
            const payload = action.payload;
            const board = {
                name: payload.name,
                isActive,
                columns: [],
            };
            board.columns = payload.newColumns; // افزودن ستون‌های جدید به برد
            state.push(board); // اضافه کردن برد جدید به وضعیت اصلی
        },

        // ویرایش برد
        editBoard: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            board.name = payload.name; // ویرایش نام برد
            board.columns = payload.newColumns; // ویرایش ستون‌های برد
        },

        // حذف برد
        deleteBoard: (state) => {
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            state.splice(state.indexOf(board), 1); // حذف برد از وضعیت اصلی
        },

        // تنظیم برد فعال
        setBoardActive: (state, action) => {
            state.map((board, index) => {
                index === action.payload.index
                    ? (board.isActive = true)
                    : (board.isActive = false); // تنظیم برد فعال بر اساس اندیس داده شده
                return board;
            });
        },

        // افزودن وظیفه جدید به ستون مشخص
        addTask: (state, action) => {
            const { title, status, description, subtasks, newColIndex } = action.payload;
            const task = { title, description, subtasks, status };
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const column = board.columns.find((col, index) => index === newColIndex); // پیدا کردن ستون مورد نظر برای افزودن وظیفه
            column.tasks.push(task); // افزودن وظیفه به ستون
        },

        // ویرایش وظیفه
        editTask: (state, action) => {
            const { title, status, description, subtasks, prevColIndex, newColIndex, taskIndex } = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const column = board.columns.find((col, index) => index === prevColIndex); // پیدا کردن ستون قبلی وظیفه
            const task = column.tasks.find((task, index) => index === taskIndex); // پیدا کردن وظیفه مورد نظر
            task.title = title; // ویرایش عنوان وظیفه
            task.status = status; // ویرایش وضعیت وظیفه
            task.description = description; // ویرایش توضیحات وظیفه
            task.subtasks = subtasks; // ویرایش زیر وظایف وظیفه
            if (prevColIndex === newColIndex) return; // اگر ستون قبلی و جدید یکسان باشند، تغییری اعمال نشود
            column.tasks = column.tasks.filter((task, index) => index !== taskIndex); // حذف وظیفه از ستون قبلی
            const newCol = board.columns.find((col, index) => index === newColIndex); // پیدا کردن ستون جدید
            newCol.tasks.push(task); // افزودن وظیفه به ستون جدید
        },

        // جابجایی وظیفه
        dragTask: (state, action) => {
            const { colIndex, prevColIndex, taskIndex } = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const prevCol = board.columns.find((col, i) => i === prevColIndex); // پیدا کردن ستون قبلی وظیفه
            const task = prevCol.tasks.splice(taskIndex, 1)[0]; // جابجایی وظیفه از ستون قبلی
            board.columns.find((col, i) => i === colIndex).tasks.push(task); // افزودن وظیفه به ستون جدید
        },

        // تغییر وضعیت زیر وظیفه
        setSubtaskCompleted: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const col = board.columns.find((col, i) => i === payload.colIndex); // پیدا کردن ستون مورد نظر
            const task = col.tasks.find((task, i) => i === payload.taskIndex); // پیدا کردن وظیفه مورد نظر
            const subtask = task.subtasks.find((subtask, i) => i === payload.index); // پیدا کردن زیر وظیفه مورد نظر
            subtask.isCompleted = !subtask.isCompleted; // تغییر وضعیت زیر وظیفه
        },

        // تغییر وضعیت وظیفه
        setTaskStatus: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const columns = board.columns;
            const col = columns.find((col, i) => i === payload.colIndex); // پیدا کردن ستون مورد نظر
            if (payload.colIndex === payload.newColIndex) return; // اگر ستون قدیمی و جدید یکسان باشند، تغییری اعمال نشود
            const task = col.tasks.find((task, i) => i === payload.taskIndex); // پیدا کردن وظیفه مورد نظر
            task.status = payload.status; // تغییر وضعیت وظیفه
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex); // حذف وظیفه از ستون قدیمی
            const newCol = columns.find((col, i) => i === payload.newColIndex); // پیدا کردن ستون جدید
            newCol.tasks.push(task); // افزودن وظیفه به ستون جدید
        },

        // حذف وظیفه
        deleteTask: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive); // پیدا کردن برد فعال
            const col = board.columns.find((col, i) => i === payload.colIndex); // پیدا کردن ستون مورد نظر
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex); // حذف وظیفه از ستون
        },
    },
});

export default boardsSlice;