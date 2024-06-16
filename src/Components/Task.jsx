import React, { useState } from "react";
import TaskModal from "../Modals/TaskModal";

function Task({ colIndex, taskIndex,col_data ,setCheck}) {

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex:col_data.id, prevColIndex: colIndex })
    );
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const task_handler = () => {
    setIsTaskModalOpen(true);
  }

  const check_completed = col_data?.subTasks.filter(task => !task.active).length

  return (
    <div>
      <div
        onClick={task_handler}
        draggable
        onDragStart={handleOnDrag}
        className=" w-[280px] first:my-5 rounded-lg bg-green-300  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer "
      >
        <p className=" font-bold tracking-wide ">{col_data.taskName}</p>
        <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
          {check_completed}  of {col_data?.subTasks.length} completed tasks
        </p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
          task_data={col_data}
          setCheck={setCheck}
        />
      )}
    </div>
  );
}

export default Task;
