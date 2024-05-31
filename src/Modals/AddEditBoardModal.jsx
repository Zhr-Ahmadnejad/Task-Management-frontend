import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crossIcon from "../Assets/crossIcone.png";
import { useDispatch, useSelector } from 'react-redux';
import boardSlices from '../Redux/boardsSlice';

const API_URL = 'http://localhost:8088/api/user/boards';

function AddEditBoardModal({ setBoardModalOpen, type }) {
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boards).find((board) => board.isActive);

  const [newColumns, setNewColumns] = useState([
    { name: 'Todo', task: [], id: uuidv4() },
    { name: 'Doing', task: [], id: uuidv4() },
  ]);

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
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  };

  const onSubmit = async () => {
    setBoardModalOpen(false);
    const token = localStorage.getItem("token");
    const isValid = validate();
    if (isValid) {
      try {
        console.log('Name before sending:', name);
        const response = await axios.post(
          API_URL,
          {
            name,
            columns: newColumns
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log('Board created:', response.data);
        dispatch(boardSlices.actions.addBoard(response.data));
      } catch (error) {
        console.error('Error creating board:', error);
        // اینجا می‌توانید برای کاربر پیغام خطا یا اعمال اقدامات مورد نیاز را قرار دهید
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
            onChange={(e) => { setName(e.target.value); }}
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
                  type='text' />
                <img src={crossIcon}
                  className='w-5 h-5 cursor-pointer m-4'
                  onClick={() => { onDelete(column.id) }}
                />
              </div>
            ))
          }
        </div>

        <div>
          <button className='w-full items-center hover:opacity-75 dark:text-[#416555] dark:bg-white text-white
   bg-[#416555] py-2 mt-2 rounded-full'
            onClick={() => {
              setNewColumns((state) => [
                ...state,
                { name: '', task: [], id: uuidv4() }
              ]);
            }}
          >
            + Add new column
          </button>

          <button className='w-full items-center hover:opacity-75 dark:text-white dark:bg-[#416555] text-white
   bg-[#416555] py-2 mt-8 rounded-full'
            onClick={() => {
              const isValid = validate();
              if (isValid) onSubmit();
            }}
          >
            {type === 'add' ? 'Create New Board' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddEditBoardModal;
