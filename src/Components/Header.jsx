import React, { useState } from 'react'

import logo from '../Assets/logo.png'
import icondown from '../Assets/icon-chevron-down.svg'
import iconup from '../Assets/icon-chevron-up.svg'
import elipsis from '../Assets/elipsis3.png'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../Modals/AddEditBoardModal'
import { useDispatch, useSelector } from 'react-redux'
import AddEditTaskModal from '../Modals/AddEditTaskModal'
import ElipsisMenu from './ElipsisMenu'
import boardsSlice from '../Redux/boardsSlice'
import DeleteModal from '../Modals/DeleteModal'


///creat Header component
function Header({ setBoardModalOpen , boardModalOpen}) {

  const dispatch = useDispatch()


  /// use hook useState for manage dropdown
const [openDropdown, setOpenDropdown] = useState(false)
const [ boardType , setBoardType ] = useState('add')
const [openAddEditTassk, setOpenAddEditTassk] = useState(false)
const [isElipsisOpen, setIsElipsisOpen] = useState(false)
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const boards = useSelector( (state) => state.boards)
const board = boards.find(board => board.isActive)

 const setOpenEditModal = () => {
  setBoardModalOpen(true)
  setIsElipsisOpen(false)
}

const setOpenDeleteModal = () => {
  setIsDeleteModalOpen(true)
  setIsElipsisOpen(false)
}

const onDeleteBtnClick = () => {
  dispatch ( boardsSlice.actions.deleteBoard())
  dispatch ( boardsSlice.actions.setBoardActive({index : 0}))
  setIsDeleteModalOpen(false)
}

const onDropdownClick = () => {
  setOpenDropdown( state => !state)
  setIsElipsisOpen(false)
  setBoardType('add')
}


  return (
    <div className=' p-4 fixed left-0 bg-[#416555] dark:bg-[#2b2c37] z-50 right-0'>
      <header className=' flex justify-between dark:text-white items-center'>

      
        {/* Left Side */}
        <div className=' flex items-center space-x-2 md:space-x-4'>
          <img src={logo} alt='logo' width="300" height="126" className=' hidden md:inline-block'/>
          <div className='flex items-center'>
            <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans text-white'>
               {board.name}
            </h3>
            <img src={openDropdown ? iconup : icondown} alt='dropdown icon' className=' h-9 w-9 ml-3 cursor-pointer md:hidden' 
            onClick={onDropdownClick}/>
          </div>
        </div>

        {/* Right Side */}
        <div className=' flex items-center space-x-4 md:space-x-6 '>
          <button onClick={
            () => {
              setOpenAddEditTassk(state => !state)
            }
          }
          className='hidden md:block button'>
            + Add New Task
          </button>

          <button
          onClick={
            () => {
              setOpenAddEditTassk(state => !state)
            }
          }
          className='button py-1 px-3 md:hidden'>
            +
          </button>
          <img src={elipsis} onClick={() => {
            setBoardType('edit')
            setOpenDropdown(false)
            setIsElipsisOpen(state => !state)
          }} alt='elipsis' width="53" height="26" className='cursor-pointer '/>

          {
            isElipsisOpen && <ElipsisMenu
            setOpenDeleteModal={setOpenDeleteModal}
            setOpenEditModal={setOpenEditModal}
             type='Boards'/>
          }


        </div>

      </header>
      {
      openDropdown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropdown = {setOpenDropdown}/>
      }
      {
      boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen = {setBoardModalOpen}/>//setBoardModalOpen RO be AddEditBoaedModal pas mide
      }

      {
        openAddEditTassk && <AddEditTaskModal setOpenAddEditTassk={setOpenAddEditTassk} device='mobile' type='add'/>
      }
      {
        isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen}
        type="board"
        title={board.name}
        onDeleteBtnClick={onDeleteBtnClick}/>
      }
    </div>
  )
}

export default Header