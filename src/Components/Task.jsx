import React, {useEffect, useState} from "react";
import TaskModal from "../Modals/TaskModal";
import {useSearchParams} from "react-router-dom";

function Task({ colIndex, taskIndex,col_data ,setCheck,allTasks ,all_task_data}) {
  const [priority_num, setPriority_num] = useState(0);



  const final_col = allTasks.find((itm)=> itm.stateName === 'پایان')

  const findLowestPriorityTasks = () => {

    const sortedData = [...all_task_data].sort((a, b) => {
      // Handle null priorities by considering them lower than any numeric value
      const priorityA = a.priority === null ? -Infinity : parseInt(a.priority, 10);
      const priorityB = b.priority === null ? -Infinity : parseInt(b.priority, 10);
      return priorityA - priorityB;
    });

    if (sortedData.length > 0 && final_col) {
      const filteredData = sortedData.filter(item => item.taskStateId !== final_col.id);

      // Ensure at least one non-filtered task with non-null priority remains
      if (filteredData.length > 0 && filteredData.some(item => item.priority !== null)) {
        // Find the first non-null priority after filtering
        return filteredData.find(item => item.priority !== null).priority;
      }
    }

    return null;
  };


  useEffect(() => {
    setPriority_num(+findLowestPriorityTasks())
  }, [all_task_data]);

  const handleOnDrag = (e) => {

    e.dataTransfer.setData(
        "text",
        JSON.stringify({ prevColIndex: colIndex, taskIndex:col_data.id, priority: col_data.priority })
    );
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const task_handler = () => {
    setIsTaskModalOpen(true);
  }

  const check_completed = col_data?.subTasks.filter(task => !task.active).length

  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  const isDrag =  priority_num === +col_data?.priority || final_col?.id === col_data?.taskStateId


  const redStyle = col_data.priority === null ? ""
      :
      priority_num !== +col_data.priority && final_col?.id !== col_data.taskStateId && +col_data.priority >= priority_num && "bg-red-400 dark:bg-red-400"



  return (
    <div>
      <div
        onClick={task_handler}
        draggable={col_data.priority === null ? true : queryParam !== 'dashboard' ? isDrag : true}
        onDragStart={handleOnDrag}
        className={`w-[280px]
         ${queryParam === 'dashboard' && !final_col ? "" : redStyle}
          first:my-5 rounded-lg bg-green-300  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer`}
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
