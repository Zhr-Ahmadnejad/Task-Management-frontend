import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crossIcon from "../Assets/crossIcone.png";
import { useDispatch, useSelector } from 'react-redux';
import boardSlices from '../Redux/boardsSlice';
import XIcon from "../Components/icons/x-icon.jsx";
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";


function AddEditBoardModal({ setBoardModalOpen, type }) {
  const [name, setName] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [first_add, setFirst_add] = useState(false)

  const board = useSelector((state) => state.boards).find((board) => board.isActive);

  const [newColumns, setNewColumns] = useState([
    { name: 'Todo', task: [], id: uuidv4() },
    { name: 'Doing', task: [], id: uuidv4() },
  ]);

    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");

    useEffect(() => {
        if (!queryParam) setFirst_add(true)
    }, []);



  if (type === 'edit' && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, id: uuidv4() };
      })
    );
    setName(board.name);
    setIsFirstLoad(false);
  }

  const onChange = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const validate = () => {

    if (!name.trim()) {
        const notify = () => toast.error("empty field name");
        notify()

      return false;
    }


    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
          const notify = () => toast.error("empty field board column");
          notify()
        return false;
      }
    }

    return true;
  };

  const navigate = useNavigate();

  const onSubmit = async () => {
      const isValid = validate();
      if (isValid){
        const user_token = Cookies.get('token');
        const board_columns = newColumns.map(item => item.name);


          try {


              const {data} = await axios.post("http://localhost:8088/api/user/boards",{
                  boardName: name,
                  taskStates : board_columns
              },{
                  headers : {
                      Authorization : `Bearer ${user_token}`
                  }
              })

              if (first_add){
                  const notify = () => toast.success("board saved.");
                  notify()

                  console.log(data)
                  navigate(0)
              }else {
                  const notify = () => toast.success("board saved.");
                  notify()

                  setBoardModalOpen(false);

                  console.log(data)
              }

          }catch (err){
              console.log(err)
              if(err.response.data === 'The token signature is invalid. '){
                  Cookies.remove('token')
                  navigate(0)
              }else if (err.response.data === 'A board with the same name already exists for this user'){
                  const notify = () => toast.error("board exist");
                  notify()
              }

          }
      }

  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
      className='fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scroll
    z-50 justify-center items-center flex bg-[#00000080]'
    >

      <div className='scrollbar-hide overflow-y-scroll max-h[95vh] bg-white dark:bg-[#2b2c37] text-black
   dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl'
      >
        <button onClick={()=> setBoardModalOpen(false)}>
          <XIcon classes={"w-10"}/>
        </button>

        <h3 className='text-lg'>
          {type === 'edit' ? 'Edit' : 'Add New'} Board
        </h3>

        <div className="mt-8 flex flex-col space-y-1">
          <label className='text-sm dark:text-white text-gray-500'>
            Board Name
          </label>
          <input
              className='bg-transparent px-4 py-2 rounded-md text-sm border border-gray-600 outline-none
       focus:outline-[#416555] outline-1 right-0
       '
              placeholder='e.g Web Design'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              id='board-name-input'
          />
        </div>

        <div className=' mt-8 flex flex-col space-y-3'>
          <label
              className='text-sm dark:text-white text-gray-500'
          > Board Columns
          </label>
          {
            newColumns.map((column, index) => (
                <div key={index} className='flex items-center w-full'>
                  <input className='bg-transparent flex-grow px-4 py-2 rounded-mdtext-sm
            border border-gray-600 outline-none focus: outline-[#416555]'
                         onChange={(e) => {
                           onChange(column.id, e.target.value);
                         }}
                         value={column.name}
                         type='text'/>
                  <img src={crossIcon}
                       className='w-5 h-5 cursor-pointer m-4'
                       onClick={() => {
                         onDelete(column.id)
                       }}
                  />
                </div>
            ))
          }
        </div>

        <div>
          <button className='w-full items-center hover:opacity-75 dark:text-[#416555] dark:bg-white text-white bg-[#416555] py-2 mt-2 rounded-full'
                  onClick={() => {
                    setNewColumns((state) => [
                      ...state,
                      {name: '', task: [], id: uuidv4()}
                    ]);
                  }}
          >
            + Add new column
          </button>

          <button
              className='w-full items-center hover:opacity-75 dark:text-white dark:bg-[#416555] text-white bg-[#416555] py-2 mt-8 rounded-full'
              onClick={onSubmit}
          >
            {type === 'add' ? 'Create New Board' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddEditBoardModal;
