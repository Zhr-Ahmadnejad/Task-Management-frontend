import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo-color.png';
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {data} = await axios.post('http://localhost:8088/api/login',{
        email, password
      })

      Cookies.set('token', data, { expires: 7 })
      navigate("/home?=dashboard");

     setError("")
      const notify = () => toast("Welcome");
      notify()

    } catch (error) {
      console.error('Error:', error.response.data);
      setError(error.response.data);
    }

  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#416555]">
      <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded px-8 py-8">
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="Logo" className="h-24" />
        </div>
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">Login</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="email">
                ایمیل
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm
                border border-gray-600 outline-none focus:outline-[#416555]"
                id="email"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="password">
                رمز عبور
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm
                border border-gray-600 outline-none focus:outline-[#416555]"
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded
                focus:outline-none focus:shadow-outline"
                type="submit"
              >
                ورود
              </button>
              <Link to="/signup" className="text-[#416555] text-sm font-bold">
                حساب کاربری نداری؟ثبتنام کن
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
