import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../Components/ElipsisMenu";
import elipsis from "../Assets/elipsis3.png";
import boardsSlice from "../Redux/boardsSlice";
import Subtask from "../Components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import XIcon from "../Components/icons/x-icon.jsx";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const subtasks = task.subtasks;

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));
  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e) => {

    if (e.target !== e.currentTarget) {
      return;
    }

    dispatch(
      boardsSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );
    setIsTaskModalOpen(false);
  };

  const closeHandler = ()=>{
    dispatch(
        boardsSlice.actions.setTaskStatus({
          taskIndex,
          colIndex,
          newColIndex,
          status,
        })
    );
    setIsTaskModalOpen(false);
  }

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      dispatch(boardsSlice.actions.deleteTask({ taskIndex, colIndex }));
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  return (
    <div
      onClick={onClose}
      className=" fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]"
    >
      {/* MODAL SECTION */}


      <div
          className=" scrollbar-hide overflow-y-scroll max-h-[95vh] shadow-[#364e7e1a]  my-auto bg-[#416555] dark:bg-[#2b2c37] text-white dark:text-black font-bold shadow-md max-w-md mx-auto  w-full px-8  py-8 rounded-xl">

        <button onClick={closeHandler}>
          <XIcon classes={"w-10"}/>
        </button>

        <div className=" relative flex justify-between w-full items-center">
          <h1 className=" text-lg">{task.title}</h1>

          <img
              onClick={() => {
                setIsElipsisMenuOpen((prevState) => !prevState);
              }}
              src={elipsis}
              alt="elipsis"
              className=" cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
              <ElipsisMenu
                  setOpenEditModal={setOpenEditModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                  type="Task"
              />
          )}
        </div>
        <p className=" text-green-300 dark:text-gray-500 font-[600] tracking-wide text-xs pt-6 ">
          {task.description}
        </p>

        <p className=" pt-6 tracking-widest text-sm ">
          Subtasks ({completed} of {subtasks.length})
        </p>

        {/* subtasks section */}

        <div className=" mt-3 space-y-2 ">
          {subtasks.map((subtask, index) => {
            return (
                <Subtask
                    index={index}
                    taskIndex={taskIndex}
                    colIndex={colIndex}
                    key={index}
                />
            );
          })}
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm ">
            Current Status
          </label>
          <select
              className="cursor-pointer select-status flex-grow px-4 py-2 rounded-md text-sm focus:border-0  border-[1px] border-gray-300 focus:outline-white outline-none text-black"
              value={status}
              onChange={onChange}
          >
            {columns.map((col, index) => (
                <option className="status-options" key={index}>
                  {col.name}
                </option>
            ))}
          </select>
        </div>
      </div>
      {isDeleteModalOpen && (
          <DeleteModal
              onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task.title}
          isDeleteModalOpen={isDeleteModalOpen}
          toggleDeleteModal={toggleDeleteModal}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
        />
      )}
    </div>
  );
}

export default TaskModal;
