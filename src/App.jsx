import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Center from "./Components/Center";
import EmptyBoard from './Components/EmptyBoard';
import boardsSlice from "./Redux/boardsSlice";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import AboutUs from "./Components/AboutUs";

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);

  if (!activeBoard && boards.length > 0) {
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  }

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
            <Route path="/aboutUs" element={<AboutUs/>} />
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
    </div>
  );
}

export default App;
