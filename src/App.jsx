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

                    if (data) {
                        setBoards_data(data);
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [check]);  

    return (
        <div className="overflow-hidden overflow-x-scroll">
            <>
                <Router>
                    <Routes>
                        <Route path="/home" element={
                            boards_data.length > 0 ? ( 
                                <>
                                    <Header
                                        setBoardModalOpen={setBoardModalOpen} 
                                        boardModalOpen={boardModalOpen}
                                    />
                                    <Center />
                                </>
                            ) : (
                                <EmptyBoard type='add' check={check} setCheck={setCheck} /> 
                            )
                        }/>
                        <Route path="/" element={tokenData ? <Navigate to="/home"/> : <LoginPage/>}/>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/aboutUs" element={tokenData ? <AboutUs/> : <Navigate to="/"/>}/>
                        <Route path="/ProfilePage" element={tokenData ? <ProfilePage/> : <Navigate to="/"/>}/>
                        <Route path="/task-chart" element={<TaskChartPage/>}/>
                    </Routes>
                </Router>
            </>
            <ToastContainer/>
        </div>
    );
}

export default App;
