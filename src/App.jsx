import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import Header from "./Components/Header";
import Center from "./Components/Center";
import EmptyBoard from './Components/EmptyBoard';
import boardsSlice from "./Redux/boardsSlice";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import AboutUs from "./Components/AboutUs";
import ProfilePage from "./Components/ProfilePage";
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);

  if (!activeBoard && boards.length > 0) {
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  }



  const tokenData =  Cookies.get('token')

    // console.log(tokenData);

  return (
    <div className="overflow-hidden overflow-x-scroll">
      <>
        <Router>
          <Routes>
            <Route path="/home" element={
                boards.length > 0 ? (
                    <>
                        <Header
                            setBoardModalOpen={setBoardModalOpen}
                            boardModalOpen={boardModalOpen}
                        />
                        <Center
                            setBoardModalOpen={setBoardModalOpen}
                            boardModalOpen={boardModalOpen}
                        />
                    </>
                ) : (
                    <EmptyBoard type='add'/>
                )
            } />
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/aboutUs" element={tokenData ? <AboutUs/> : <Navigate to="/" />} />
            <Route path="/ProfilePage" element={tokenData ? <ProfilePage/> : <Navigate to="/" />}/>
          </Routes>
        </Router>

        {/* دکمه Sign Out */}
        {/* <div
          onClick={handleSignOut}
          className='fixed bottom-4 left-4 bg-red-500 px-4 py-2 rounded-md text-white cursor-pointer'
        >
          Sign Out
        </div> */}
      </>
        <ToastContainer />
    </div>
  );
}

export default App;
