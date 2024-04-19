import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import boardIcon from '../Assets/board-icone.jpg'
import lightIcon from '../Assets/icon-light-theme.svg'
import darkIcon from '../Assets/icon-dark-theme.svg'
import { Switch } from '@headlessui/react'
import useDarkMode from '../Hooks/useDarkMode'
import boardsSlice from '../Redux/boardsSlice'


function HeaderDropdown({setOpenDropdown , setBoardModalOpen}){
  const [colorTheme , setTheme] = useDarkMode() ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
  const [darkSide, setdarkSide] = useState(colorTheme === 'light' ? true : false) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
  const dispatch = useDispatch() 

  const toggleDarkMode = (checked) => { ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
    setTheme(colorTheme) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
    setdarkSide(checked) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
  }

  const boards = useSelector((state) => state.boards)

    return (
      <div
      className=' py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-20 bg-[#00000080]'
       onClick={
        (e) => {
          if (e.target !== e.currentTarget){
            return
          }
          setOpenDropdown(false)
        }
      }
      >
 
    
        {/* { Dropdown modal } */}

        <div className='bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl'> 
        <h3 className=' dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8'>
          All boards ({boards ? boards.length : 0})
        </h3>

        <div>
          {boards.map((board , index) =>(
            <div
            className={`dark:text-white flex items-baseline space-x-2 px-5 py-4 ${board.isActive && 'bg-[#416555] rounded-r-full text-white mr-8'}`}
            key={index}
            onClick={() => {
              dispatch(boardsSlice.actions.setBoardActive({index})) 
            }}
            >
          
              <img src={boardIcon} className='h-4'/>
              <p className=' text-lg font-bold'>{board.name}</p>
              </div>
          ))}

          <div className=' cursor-pointer flex items-baseline space-x-2 text-[#416555] px-5 py-4'
          /// ba click roye in gozine drowpdown baste va setboardmodelopen baz mishe
          onClick={()=>{
            setBoardModalOpen(true)
            setOpenDropdown(false)
          }}
          >
            <img src={boardIcon} className='h-4 '/>
            <p className='text-lg font-bold'>
              Create New Board
            </p>
          </div>

         
          <div className=" mx-2  p-4  space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
            <img src={lightIcon} alt="sun indicating light mode" />

            <Switch
              checked={darkSide}
              onChange={toggleDarkMode}
              className={`${
                darkSide ? "bg-[#416555]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  darkSide ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>

            <img src={darkIcon} alt="moon indicating dark mode" />
          </div>

        </div>

        </div>
      </div>
    )
}

export default HeaderDropdown