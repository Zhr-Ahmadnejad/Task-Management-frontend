import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


function ProfilePage() {
    const [editMode, setEditMode] = useState(false); // وضعیت ویرایش را مدیریت می‌کند
    const [firstName, setFirstName] = useState(''); // نام کاربر را در وضعیت نگه می‌دارد
    const [lastName, setLastName] = useState(''); // نام خانوادگی کاربر را در وضعیت نگه می‌دارد
    const [email, setEmail] = useState(''); // ایمیل کاربر را در وضعیت نگه می‌دارد
    const [password, setPassword] = useState(''); // رمز عبور کاربر را در وضعیت نگه می‌دارد
    const [userId, setUserId] = useState(""); // شناسه کاربر را در وضعیت نگه می‌دارد
    const [check, setCheck] = useState(1); // برای ارسال پرس و جو به سرور در useEffect استفاده می‌شود

    const user_token = Cookies.get('token'); // دریافت توکن کاربر از کوکی‌ها

    const navigate = useNavigate(); // استفاده از useNavigate برای انتقال به صفحات مختلف در React Router

    const handleHomeClick = () => {
        window.location.href = '/home'; // انتقال کاربر به صفحه خانه
    };

    useEffect(() => {
        if (user_token) {
            try {
                (async () => {
                    const {data} = await axios.get('http://localhost:8088/api/user/33', {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    });

                    // تنظیم مقادیر دریافتی از سرور برای نمایش در فرم ویرایش
                    setUserId(data.id);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setPassword(data.password);

                })();
            } catch (err) {
                console.log(err);
            }
        }
    }, [check]); // استفاده از useEffect برای دریافت اطلاعات از سرور و تغییر وضعیت check

    const handleEdit = () => {
        setEditMode(true); // فعال کردن حالت ویرایش
        // پاک کردن فیلدهای فرم برای شروع ویرایش جدید
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
    };

    const back_handler = () => {
        setEditMode(false); // خاموش کردن حالت ویرایش
        setCheck(check + 1); // افزایش check برای ارسال پرس و جو به سرور
    };

    const handleSave = async () => {
        try {
            const {data} = await axios.put('http://localhost:8088/api/user', {
                firstName: firstName.length > 0 ? firstName : null,
                lastName: lastName.length > 0 ? lastName : null,
                email: email.length > 0 ? email : null,
                password: password.length > 0 ? password : null
            }, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            });

            if(data){
                // نمایش پیام موفقیت آمیز برای ویرایش کاربر
                const notify = () => toast.success("user edited.");
                notify();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const delete_user = async () => {
        try {
            const {data} = await axios.delete(`http://localhost:8088/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            });

            if (data) {
                Cookies.remove('token'); // حذف توکن از کوکی‌ها در صورت حذف کاربر
                navigate("/signup", {
                    replace: true
                }); // انتقال کاربر به صفحه ثبت نام
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#416555] dark:bg-white">
            <div className="bg-white dark:bg-[#416555] p-8 rounded-lg shadow-lg text-[#416555] dark:text-white">
                <h2 className="text-2xl mb-4 font-semibold">اطلاعات حساب کاربری</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">نام </label>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            readOnly={!editMode}
                        />
                        {editMode && (
                            <button className="absolute top-2 right-2" onClick={handleSave}>
                                ذخیره
                            </button>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">نام خانوادگی</label>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            readOnly={!editMode}
                            placeholder={lastName}
                        />
                        {editMode && (
                            <button className="absolute top-2 right-2" onClick={handleSave}>
                                ذخیره
                            </button>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">ایمیل</label>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!editMode}
                        />
                        {editMode && (
                            <button className="absolute top-2 right-2" onClick={handleSave}>
                                ذخیره
                            </button>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-bold">رمز عبور</label>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            readOnly={!editMode}
                        />
                        {editMode && (
                            <button className="absolute top-2 right-2" onClick={handleSave}>
                                ذخیره
                            </button>
                        )}
                    </div>
                </div>
                {!editMode && (
                    <button
                        className=" bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded w-full
          focus:outline-none focus:shadow-outline"
                        type="submit"
                        onClick={handleEdit}
                    >
                        ویرایش
                    </button>
                )}

                <br/>

                {!editMode && (
                    <button
                        className=" bg-red-500 mt-4 w-full hover:bg-red-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={delete_user}
                    >
                        حذف حساب کاربری
                    </button>
                )}

                {editMode &&
                    <button
                        className=" bg-[#416555] w-full mt-4 hover:bg-green-300 text-white font-bold py-2 px-4 rounded
          focus:outline-none focus:shadow-outline"
                        onClick={back_handler}
                    >
                        برگشت
                    </button>
                }

                <button
                    className=" bg-[#416555] w-full mt-4 hover:bg-green-300 text-white font-bold py-2 px-4 rounded
          focus:outline-none focus:shadow-outline"
                    onClick={handleHomeClick}
                >
                    خانه
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
