import React, { useEffect, useState } from "react";
import AddEditBoardModal from "../Modals/AddEditBoardModal";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./Sidebar";
import {useNavigate, useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Center() {

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [task_state, setTask_state] = useState([])


  let [searchParams] = useSearchParams();
  let queryParam = searchParams.get("");

  const navigate = useNavigate()


  useEffect(() => {
    (async ()=>{
      const user_token = Cookies.get('token');

      if (queryParam && queryParam !== 'dashboard'){

        try {
          const {data} = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`,{
            headers : {
              Authorization : `Bearer ${user_token}`
            }
          })

          if (data){
            setTask_state(data.taskStates)
          }
        }catch (err){
          console.log(err)
        }

      }else if (queryParam === 'dashboard'){

        setTask_state([{
          "id": 3,
          "stateName": "شروع",
          "boardId": 2
        }])


      } else {
        try {
          const {data} = await axios.get("http://localhost:8088/api/user/boards", {
            headers: {
              Authorization: `Bearer ${user_token}`
            }
          })

          if (data) {
            navigate(`/home?=${data[0]?.id}`)
          }
        } catch (err) {
          console.log(err)
        }
      }
    })()
  }, [queryParam]);



  return (
    <div style={{ paddingTop: "100px" }}
    className={
      windowSize[0] >= 768 && isSideBarOpen
        ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px]"
        : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6 "
    }
  >
    {windowSize[0] >= 768 && (
        <Sidebar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* Columns Section */}

      {task_state.length > 0 ? (
        <>

          {task_state.map((col,i) => (
            <Column
                key={col.id}
                dataCol={col}
                colIndex={i}
                column_all={task_state}
            />
          ))}

          {queryParam !== 'dashboard' &&
              <div
                  onClick={() => setIsBoardModalOpen(true)}
                  className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#416555] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
              >
                + New Column
              </div>
          }

        </>
      ) : (
          <>
            <EmptyBoard type="edit"/>
          </>
      )}
      {isBoardModalOpen && (
          <AddEditBoardModal
              type="edit-2"
              setBoardModalOpen={setIsBoardModalOpen}
          />
      )}
    </div>
  );
}

export default Center
