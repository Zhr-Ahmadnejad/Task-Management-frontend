import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Components/Header";
import Center from "./Components/Center";
import EmptyBoard from './Components/EmptyBoard';
import boardsSlice from "./Redux/boardsSlice";

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);
  if (!activeBoard && boards.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  return (
    <div className=" overflow-hidden  overflow-x-scroll">
      <>
        {boards.length > 0 ?
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
        :
        <>
          <EmptyBoard type='add'/>
        </>
      }
        
      </>
    </div>
  );
}

export default App;
