import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo-color.png'; // مسیر لوگو

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8088/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }), // افزودن اطلاعات firstName و lastName
      });
      const data = await response.text();
      if (response.ok) {
        // Signup successful, redirect to login page or perform other actions
        window.location.href = '/'; // به عنوان مثال به صفحه اصلی هدایت می‌شود
      } else {
        // Display error message received from the server
        setError(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('خطایی در ارتباط با سرور رخ داده است.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#416555]">
      <div className="grid grid-cols-2 gap-4 bg-white shadow-md rounded px-8 py-8">
        <div className="col-span-1 flex justify-center items-center">
          <img src={logo} alt="لوگو" className="h-24" />
        </div>
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-4 text-center text-[#416555] font-semibold">Signup</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#416555] text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className=" w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="firstName">
                First Name
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#416555] text-sm font-bold mb-2 " htmlFor="lastName">
                Last Name
              </label>
              <input
                className="w-full bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#416555]"
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Signup
              </button>
              {/* اضافه کردن لینک به صفحه login */}
              <Link to="/" className="text-[#416555] text-sm font-bold">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage
