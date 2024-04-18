import React, { useState } from 'react'

import logo from '../Assets/logo.png'
import icondown from '../Assets/icondown.png'
import iconup from '../Assets/iconup.png'
import elipsis from '../Assets/elipsis3.png'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../Modals/AddEditBoardModal'
import { useDispatch, useSelector } from 'react-redux'


///creat Header component
function Header({ setBoardModalOpen , boardModalOpen}) {

  const dispatch = useDispatch()


  /// use hook useState for manage dropdown
const [openDropdown, setOpenDropdown] = useState(false)
const [ boardType , setBoardType ] = useState('add')

const boards = useSelector( (state) => state.boards)
const board = boards.find(board => board.isActive)


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
            onClick={() => setOpenDropdown(state => !state)}/>
          </div>
        </div>

        {/* Right Side */}
        <div className=' flex items-center space-x-4 md:space-x-6 '>
          <button className='hidden md:block button'>
            + Add New Task
          </button>

          <button className='button py-1 px-3 md:hidden'>
            +
          </button>
          <img src={elipsis} alt='' width="53" height="26" className='cursor-pointer'/>


        </div>

      </header>
      {
      openDropdown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropdown = {setOpenDropdown}/>
      }
      {
      boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen = {setBoardModalOpen}/>//setBoardModalOpen RO be AddEditBoaedModal pas mide
      }
    </div>
  )
}

export default Header