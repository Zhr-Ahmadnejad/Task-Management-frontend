import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate,useNavigate} from "react-router-dom";
import Header from "./Components/Header";
import Center from "./Components/Center";
import EmptyBoard from './Components/EmptyBoard';
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import AboutUs from "./Components/AboutUs";
import ProfilePage from "./Components/ProfilePage";
import Cookies from "js-cookie";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import TaskChartPage from './Components/TaskChartPage';


function App() {
    // وضعیت برای باز و بسته کردن مودال برد
    const [boardModalOpen, setBoardModalOpen] = useState(false);

    // وضعیت برای ذخیره داده‌های بردها
    const [boards_data, setBoards_data] = useState([]);

    // وضعیت برای به‌روزرسانی داده‌ها
    const [check, setCheck] = useState(1);

    // دریافت توکن کاربر از کوکی‌ها برای احراز هویت در درخواست‌های API
    const tokenData = Cookies.get('token');

    // استفاده از useEffect برای بارگذاری داده‌های بردها از API
    useEffect(() => {
        // اگر توکن وجود دارد، داده‌های بردها را بارگذاری کن
        if (tokenData) {
            (async () => {
                try {
                    // ارسال درخواست GET برای دریافت داده‌های بردها
                    const { data } = await axios.get("http://localhost:8088/api/user/boards", {
                        headers: {
                            Authorization: `Bearer ${tokenData}`  // ارسال توکن در هدر درخواست برای احراز هویت
                        }
                    });

                    // اگر داده‌ها دریافت شد، وضعیت boards_data را به‌روزرسانی کن
                    if (data) {
                        setBoards_data(data);
                    }
                } catch (err) {
                    // نمایش خطا در صورت بروز مشکل در درخواست API
                    console.log(err);
                }
            })();
        }
    }, [check]);  // استفاده از check به عنوان وابستگی برای به‌روزرسانی داده‌ها

    return (
        <div className="overflow-hidden overflow-x-scroll">
            <>
                <Router>
                    <Routes>
                        {/* مسیر برای صفحه اصلی */}
                        <Route path="/home" element={
                            boards_data.length > 0 ? (  // اگر داده‌های برد وجود داشته باشد
                                <>
                                    <Header
                                        setBoardModalOpen={setBoardModalOpen}  // تابع برای باز و بسته کردن مودال برد
                                        boardModalOpen={boardModalOpen}  // وضعیت باز بودن مودال برد
                                    />
                                    <Center />  {/* کامپوننت مرکزی برای نمایش محتوای اصلی */}
                                </>
                            ) : (
                                <EmptyBoard type='add' check={check} setCheck={setCheck} />  // نمایش حالت خالی برد اگر داده‌ای وجود نداشته باشد
                            )
                        }/>
                        {/* مسیر برای صفحه اصلی که کاربر را به "/home" هدایت می‌کند اگر توکن وجود داشته باشد */}
                        <Route path="/" element={tokenData ? <Navigate to="/home"/> : <LoginPage/>}/>
                        {/* مسیر برای صفحه ثبت‌نام */}
                        <Route path="/signup" element={<SignupPage/>}/>
                        {/* مسیر برای صفحه درباره ما که کاربر را به صفحه ورود هدایت می‌کند اگر توکن وجود نداشته باشد */}
                        <Route path="/aboutUs" element={tokenData ? <AboutUs/> : <Navigate to="/"/>}/>
                        {/* مسیر برای صفحه پروفایل که کاربر را به صفحه ورود هدایت می‌کند اگر توکن وجود نداشته باشد */}
                        <Route path="/ProfilePage" element={tokenData ? <ProfilePage/> : <Navigate to="/"/>}/>
                        <Route path="/task-chart" element={<TaskChartPage/>}/>
                    </Routes>
                </Router>
            </>
            {/* کامپوننت برای نمایش پیام‌های اطلاع‌رسانی */}
            <ToastContainer/>
        </div>
    );
}

export default App;
