import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from './boardsSlice'

// تنظیم store با استفاده از configureStore از Redux Toolkit
const store = configureStore({
    reducer: {
        // اضافه کردن slice مربوط به بردها به reducer
        boards: boardsSlice.reducer,
    }
});

export default store;