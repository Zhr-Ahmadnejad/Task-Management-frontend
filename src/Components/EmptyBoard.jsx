import React, {useEffect, useState} from "react";
import AddEditBoardModal from "../Modals/AddEditBoardModal";
import Cookies from "js-cookie";
import axios from "axios";


function EmptyBoard({ type ,check, setCheck}) {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const tokenData = Cookies.get('token')

    useEffect(() => {


       if(tokenData && check){

           (async () => {
               try {
                   const {data} = await axios.get("http://localhost:8088/api/user/boards", {
                       headers: {
                           Authorization: `Bearer ${tokenData}`
                       }
                   })

                   if (data) {
                       setCheck(check + 1)
                   }
               } catch (err) {
                   console.log(err)
               }
           })()
       }

    }, []);




    return (
    <div className=" bg-white dark:bg-[#2b2c37] h-screen w-screen flex flex-col  items-center justify-center">
      <h3 className=" text-gray-500 font-bold">
        {type === "edit"
          ? "This board is empty. Create a new column to get started."
          : "There are no boards available. Create a new board to get started"}
      </h3>
      <button
        onClick={() => {
          setIsBoardModalOpen(true);
        }}
        className="w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#416555] mt-8 relative  text-white bg-[#416555] py-2 rounded-full"
      >
        {type === "edit" ? "+ Add New Column" : "+ Add New Board"}
      </button>
      {isBoardModalOpen && (
        <AddEditBoardModal
          type={type}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default EmptyBoard;
