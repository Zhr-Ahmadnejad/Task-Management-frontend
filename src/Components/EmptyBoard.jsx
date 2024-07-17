import React, {useEffect, useState} from "react";
import AddEditBoardModal from "../Modals/AddEditBoardModal";
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";


function EmptyBoard({ type ,check, setCheck}) {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const tokenData = Cookies.get('token')

    const navigate = useNavigate();

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
                   if(err.response.data === 'The token signature is invalid. '){
                       Cookies.remove('token')
                       navigate("/signup")
                       navigate(0)
                   }
               }
           })()
       }else if (!tokenData){
           Cookies.remove('token')
           navigate("/signup")
           navigate(0)
       }

    }, []);




    return (
    <div className=" bg-white dark:bg-[#2b2c37] h-screen w-screen flex flex-col  items-center justify-center">
      <h3 className=" text-gray-500 font-bold">
        {type === "edit"
          ? "این برد خالیه . ستون جدید بساز تا باهم شروع کنیم"
          : "هیچ بردی وجود نداره . قدم اول اینه که تو برد مخصوص خودتو بسازی"}
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
          setBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default EmptyBoard;
