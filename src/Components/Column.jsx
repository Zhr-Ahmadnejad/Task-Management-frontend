import {shuffle} from "lodash";
import React, {useEffect, useState} from "react";
import Task from "./Task";
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";


function Column({colIndex, dataCol,column_all,setAll_task_data,all_task_data}) {

    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-indigo-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-sky-500",
    ]




    const [color, setColor] = useState(null);
    const [column_length, setColumn_length] = useState(0);
    const [column_data, setColumn_data] = useState([]);
    const [check, setCheck] = useState(1);

    const sortedData = column_data.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));


    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, []);

    const user_token = Cookies.get('token');

    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");

    const navigate = useNavigate();

    useEffect(() => {
        if (queryParam === 'dashboard') {
            (async () => {

                try {
                    const {data} = await axios.get("http://localhost:8088/api/user/board/tasks/start", {
                        headers: {
                            Authorization: `Bearer ${user_token}`
                        }
                    })

                    if (data) {
                        setColumn_length(data.length);
                        setColumn_data(data);
                    }


                } catch (err) {
                    console.log(err)
                }

            })()

        } else {
            (async () => {
                try {
                    const {data} = await axios.get("http://localhost:8088/api/user/board/tasks", {
                        headers: {
                            'Authorization': `Bearer ${user_token}`,
                            'taskStateId': dataCol.id,
                            'boardId': queryParam
                        }
                    })

                    if (data) {
                        setColumn_length(data.length);
                        setColumn_data(data);
                    }

                } catch (err) {
                    console.log(err)
                }
            })()

        }
    }, [queryParam, check]);

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get("http://localhost:8088/api/user/board/tasks", {
                    headers: {
                        'Authorization': `Bearer ${user_token}`,
                        'taskStateId': dataCol.id,
                        'boardId': queryParam
                    }
                })


                const filteredData = data.map(item => {
                    const { subTasks, boardId, description, taskName, ...rest } = item;
                    return rest;
                });

                setAll_task_data((prev) => {
                    const newData = filteredData.filter(item => !prev.some(prevItem => prevItem.id === item.id));
                    return [...prev, ...newData];
                });

            } catch (err) {
                console.log(err)
            }
        })()
    }, [user_token, dataCol.id, queryParam]);



    const handleOnDrop = async (e) => {
        const {prevColIndex, taskIndex, priority} = JSON.parse(
            e.dataTransfer.getData("text")
        );

        if (colIndex !== prevColIndex && dataCol.stateName !== "پایان") {
            const lowerPriorityTasks = column_data.filter(
                (task) => task.priority < priority && task.taskStateId !== 8
            );

            if (lowerPriorityTasks.length > 0) {
                alert("ابتدا باید taskهای با اولویت پایین‌تر تکمیل شوند.");
                return;
            }
        }

        try {
            const {data} = await axios.put(
                `http://localhost:8088/api/user/board/tasks/${taskIndex}`,
                {
                    taskStateId: dataCol.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user_token}`,
                    },
                }
            );

            if (data) {
                navigate(0);
            }
        } catch (err) {
            console.log(err);
        }

    };

    const handleOnDragOver = (e) => {
        e.preventDefault();
    };



    return (
        <div
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            className="scrollbar-hide mx-5 pt-[90px] min-w-[280px] "
        >
            <div className="font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
                <span className={`rounded-full w-4 h-4 ${color}`}/>
                {dataCol.stateName} ({column_length})
            </div>


            {sortedData.map((task, index) => (
                <Task
                    key={index}
                    col_data={task}
                    taskIndex={index}
                    colIndex={colIndex}
                    setCheck={setCheck}
                    allTasks={column_all}
                    all_task_data={all_task_data}
                />
            ))}

        </div>
    );
}

export default Column;
