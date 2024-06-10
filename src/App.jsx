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

function App() {
    const [boardModalOpen, setBoardModalOpen] = useState(false);
    const [boards_data, setBoards_data] = useState([]);
    const [check, setCheck] = useState(1);

    const tokenData = Cookies.get('token')

    useEffect(() => {

        if (tokenData){
            (async () => {
                try {
                    const {data} = await axios.get("http://localhost:8088/api/user/boards", {
                        headers: {
                            Authorization: `Bearer ${tokenData}`
                        }
                    })

                    if (data) {
                        setBoards_data(data);
                    }
                } catch (err) {
                    console.log(err)
                }
            })()
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
                        <Route path="/signup" element={tokenData ? <Navigate to="/home"/> : <SignupPage/>}/>
                        <Route path="/aboutUs" element={tokenData ? <AboutUs/> : <Navigate to="/"/>}/>
                        <Route path="/ProfilePage" element={tokenData ? <ProfilePage/> : <Navigate to="/"/>}/>
                    </Routes>
                </Router>

            </>
            <ToastContainer/>
        </div>
    );
}

export default App;
