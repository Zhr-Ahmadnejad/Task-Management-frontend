import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import boardIcon from '../Assets/board-icone.jpg'
import lightIcon from '../Assets/icon-light-theme.svg'
import darkIcon from '../Assets/icon-dark-theme.svg'
import {Switch} from '@headlessui/react'
import useDarkMode from '../Hooks/useDarkMode'
import boardsSlice from '../Redux/boardsSlice'
import SignoutIcon from '../Assets/sign_out_icon.jpg'
import aboutUsIcon from '../Assets/about-us-icon_final.jpg';
import {useNavigate, useSearchParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";


function HeaderDropdown({setOpenDropdown, setBoardModalOpen}) {
    const [colorTheme, setTheme] = useDarkMode()
    const [darkSide, setdarkSide] = useState(colorTheme === 'light')
    const [all_boards, setAll_boards] = useState([]);
    const [check, setCheck] = useState(1);
    const [boards_length, setBoards_length] = useState(0);
    const dispatch = useDispatch()

    const toggleDarkMode = (checked) => { ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
        setTheme(colorTheme) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
        setdarkSide(checked) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
    }

    const boards = useSelector((state) => state.boards)


    useEffect(() => {
        (async ()=>{
            const user_token = Cookies.get('token');

            try {
                const {data} = await axios.get("http://localhost:8088/api/user/boards",{
                    headers : {
                        Authorization : `Bearer ${user_token}`
                    }
                })

                if (data){
                    setBoards_length(data.length)
                    setAll_boards(data)
                }
            }catch (err){
                if(err.response.data === 'The token signature is invalid. '){
                    signoutHandler()
                }
            }
        })()
    }, [check]);

    const navigate = useNavigate();

    const signoutHandler = () => {
        Cookies.remove('token')
        navigate(0)
    }

    const board_handle = (id)=>{
        navigate(`/home?=${id}`)
    }

    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");


    return (
        <div
            className=' py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-20 bg-[#00000080]'
            onClick={
                (e) => {
                    if (e.target !== e.currentTarget) {
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
                    {all_boards.map((itm) => (
                        <div
                            className={`cursor-pointer dark:text-white flex items-baseline space-x-2 px-5 py-4 
                                ${queryParam === itm.id.toString() && 'bg-[#416555] rounded-r-full text-white mr-8'}`}
                            key={itm.id}
                            onClick={()=> board_handle(itm.id)}
                        >

                            <img src={boardIcon} className='h-4'/>
                            <p className=' text-lg font-bold'> {itm.boardName}</p>
                        </div>
                    ))}

                    <div className=' cursor-pointer flex items-baseline space-x-2 text-[#416555] px-5 py-4'
                        /// ba click roye in gozine drowpdown baste va setboardmodelopen baz mishe
                         onClick={() => {
                             setBoardModalOpen(true)
                             setOpenDropdown(false)
                         }}
                    >
                        <img src={boardIcon} className='h-4 '/>
                        <p className='text-lg font-bold'>
                            Create New Board
                        </p>
                    </div>
                    {/* About us Button  */}

                    <div
                        onClick={() => {
                            window.location.href = '/aboutUs'; // استفاده از window.location.href برای هدایت به صفحه ورود
                        }}
                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                    text-[#416555] px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                        <img src={aboutUsIcon} alt='signout' className='h-4'/>
                        <p className=' text-lg font-bold'>
                            About Us
                        </p>
                    </div>
                    <div
                        onClick={signoutHandler}
                        className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                     text-red-700 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                        <img src={SignoutIcon} alt='signout' className='h-4'/>
                        <p className=' text-lg font-bold'>
                            Sign Out
                        </p>
                    </div>

                    <div
                        className=" mx-2  p-4  space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
                        <img src={lightIcon} alt="sun indicating light mode"/>

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

                        <img src={darkIcon} alt="moon indicating dark mode"/>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default HeaderDropdown
