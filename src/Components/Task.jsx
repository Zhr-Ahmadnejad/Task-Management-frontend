import React, {useEffect, useState} from "react";
import TaskModal from "../Modals/TaskModal";
import {useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Task({ colIndex, taskIndex,col_data ,setCheck,allTasks}) {
  const [task_sorted, setTask_sorted] = useState([])
  const [all_task_checked, setAll_task_checked] = useState([])

  const final_col = allTasks.find((itm)=> itm.stateName === 'پایان')



  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  const user_token = Cookies.get('token');

  useEffect(() => {
    if (queryParam !== 'dashboard' && user_token){
      (async ()=>{
        try {
          const {data} = await axios.get(`http://localhost:8088/api/user/board/tasks/boardId/${+queryParam}`, {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          })

          if (data) {
            const filtered = data.map(task => ({
              id: task.id,
              taskStateId: task.taskStateId,
              dependentTaskIds: task.dependentTaskIds,
              draggable : false,
            }));

            const sorted = sortTasks(filtered);



            setTask_sorted(sorted)
          }
        } catch (err) {
          console.log(err);
        }
      })()
    }
  }, [queryParam , user_token]);

  const handleOnDrag = (e) => {

    e.dataTransfer.setData(
        "text",
        JSON.stringify({ prevColIndex: colIndex, taskIndex:col_data.id })
    );
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const task_handler = () => {
    setIsTaskModalOpen(true);
  }

  const check_completed = col_data?.subTasks.filter(task => !task.active).length

  const sortTasks = (tasks) => {
    const result = [];
    const taskMap = new Map();

    tasks.forEach(task => {
      taskMap.set(task.id, task);
    });

    tasks.forEach(task => {
      if (task.dependentTaskIds.length === 0) {
        result.push(task);
      }
    });

    let i = 0;
    while (i < result.length) {
      const currentTask = result[i];
      tasks.forEach(task => {
        if (task.dependentTaskIds.includes(currentTask.id) && !result.includes(task)) {
          result.push(task);
        }
      });
      i++;
    }

    return result;
  };


  const test = () => {

    const is_empty_array = task_sorted
        .filter(task => task.dependentTaskIds.length === 0)
        .every(task => task.taskStateId === final_col.id);

    const updatedTasks = task_sorted.map(task => {
      if (task.dependentTaskIds.length === 0) {
        return { ...task, draggable: true };
      }
      return task;
    });

    const updateTask2 = updatedTasks.map(itm=>{

      if (itm.dependentTaskIds.length === 0){
        return { ...itm, draggable: true };
      }

      return itm;

    })

    let foundFirstFalse = false;
    let stopProcessing = false;

    const updatedTasks3 = updateTask2.map(task => {
      if (stopProcessing) {
        return { ...task, draggable: false };
      }

      if (is_empty_array){
        if (!foundFirstFalse && !task.draggable) {
          foundFirstFalse = true;

          if (task.taskStateId === final_col.id) {
            return {
              ...task,
              draggable: true
            };
          }
        }

        if (foundFirstFalse && task.taskStateId !== final_col.id) {
          stopProcessing = true;
          return {
            ...task,
            draggable: true
          };
        }
      }

      return task;
    });



    setAll_task_checked(updatedTasks3)
  }

  useEffect(() => {
    test()
  }, [task_sorted]);








  const checkDrag = all_task_checked.find((itm)=> itm?.id === col_data?.id)





  return (
      <div>
        {queryParam === 'dashboard' ?
            <div
                onClick={task_handler}
                draggable={true}
                onDragStart={handleOnDrag}
                className={`w-[280px] first:my-5 rounded-lg bg-green-300  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 
        shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer
    
        `}
            >
              <p className=" font-bold tracking-wide ">{col_data.taskName}</p>
              <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
                {check_completed} of {col_data?.subTasks.length} completed tasks
              </p>
            </div>

            :
           <>
             {checkDrag &&
                 <div
                     onClick={task_handler}
                     draggable={checkDrag.draggable}
                     onDragStart={handleOnDrag}
                     className={`w-[280px] first:my-5 rounded-lg bg-green-300  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 
        shadow-lg hover:text-[#416555] dark:text-white dark:hover:text-[#416555] cursor-pointer
        ${checkDrag.draggable ? "" : "bg-red-400 dark:bg-red-400"}
        `}
                 >
                   <p className=" font-bold tracking-wide ">{col_data.taskName}</p>
                   <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
                     {check_completed} of {col_data?.subTasks.length} completed tasks
                   </p>
                 </div>
             }
           </>
        }


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
