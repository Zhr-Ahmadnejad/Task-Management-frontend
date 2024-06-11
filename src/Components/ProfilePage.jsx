
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";


function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const user_token = Cookies.get('token');

    if (user_token) {

      try {
        (async ()=>{
          const {data} = await axios.get('http://localhost:8088/api/users/user',{
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          })

          console.log(data);

          // setUser(response.data);
          // setFirstName(response.data.firstName);
          // setLastName(response.data.lastName);
          // setEmail(response.data.email);
          // setPassword(response.data.password);


        })()
      }catch (err){
        console.log(err)
      }

    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.put('http://localhost:8088/api/users', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('User updated successfully:', response.data);
      setEditMode(false);
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#416555] dark:bg-white">
      <div className="bg-white dark:bg-[#416555] p-8 rounded-lg shadow-lg text-[#416555] dark:text-white">
        <h2 className="text-2xl mb-4 font-semibold">Profile</h2>
        <div className="mb-4">
          <label className="block mb-2 font-bold">First Name:</label>
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
                Save
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Last Name:</label>
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
                Save
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Email:</label>
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
                Save
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Password:</label>
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
                Save
              </button>
            )}
          </div>
        </div>
        {!editMode && (
          <button
          className=" bg-[#416555] hover:bg-green-300 text-white font-bold py-2 px-4 rounded
          focus:outline-none focus:shadow-outline"
          type="submit"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
