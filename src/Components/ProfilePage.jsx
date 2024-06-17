import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";


function ProfilePage() {
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState("");
    const [check, setCheck] = useState(1);

    const user_token = Cookies.get('token');

    const navigate = useNavigate();

    useEffect(() => {


        if (user_token) {

            try {
                (async () => {
                    const {data} = await axios.get('http://localhost:8088/api/user/33', {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    })

                    setUserId(data.id)

                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setPassword(data.password);

                })()
            } catch (err) {
                console.log(err)
            }

        }
    }, [check]);

    const handleEdit = () => {
        setEditMode(true);

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
    };

    const back_handler = () => {
        setEditMode(false);
        setCheck(check + 1);
    }

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
            })

            console.log(data)
        } catch (err) {
            console.log(err)
        }

    };

    const delete_user = async () => {


        try {
            const {data} = await axios.delete(`http://localhost:8088/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            })

            if (data) {
                Cookies.remove('token')
                navigate("/signup", {
                    replace: true
                })
            }
        } catch (err) {
            console.log(err)
        }
    }


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

                <br/>

                {!editMode && (
                    <button
                        className=" bg-[#416555] mt-4 hover:bg-green-300 text-white font-bold py-2 px-4 rounded
          focus:outline-none focus:shadow-outline"
                        onClick={delete_user}
                    >
                        Delete
                    </button>
                )}

                {editMode &&
                    <button
                        className=" bg-[#416555] mt-4 hover:bg-green-300 text-white font-bold py-2 px-4 rounded
          focus:outline-none focus:shadow-outline"
                        onClick={back_handler}
                    >
                        back
                    </button>
                }
            </div>
        </div>
    );
}

export default ProfilePage;
