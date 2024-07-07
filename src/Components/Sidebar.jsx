import React, {useEffect, useState} from 'react';
import useDarkMode from '../Hooks/useDarkMode';
import boardIcon from '../Assets/board-icone.jpg';
import lightIcon from '../Assets/icon-light-theme.svg';
import darkIcon from '../Assets/icon-dark-theme.svg';
import {Switch} from '@headlessui/react';
import hideSidebarIcon from '../Assets/icon-hide-sidebar.svg';
import showSidebarIcon from '../Assets/icon-show-sidebar.svg';
import AddEditBoardModal from '../Modals/AddEditBoardModal';
import SignoutIcon from '../Assets/sign_out_icon.jpg';
import aboutUsIcon from '../Assets/about-us-icon_final.jpg';
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

function Sidebar({isSideBarOpen, setIsSideBarOpen}) {
    const [colorTheme, setTheme] = useDarkMode()
    const [darkSide, setdarkSide] = useState(colorTheme === 'light') ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast

    const [boards_length, setBoards_length] = useState(0);
    const [all_boards, setAll_boards] = useState([]);
    const [check, setCheck] = useState(1);

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


    const toggleDarkMode = (checked) => { ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
        setTheme(colorTheme) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
        setdarkSide(checked) ///bara dorost kardan ghesmat dark mood(dokmehe) ast va useDarkMod dakhele file Hooks ast
    }

    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)

    const navigate = useNavigate();

    const signoutHandler = () => {
        Cookies.remove('token')
        navigate("/signup",{
            replace : true
        })
    }

    const board_handle = (id)=>{
        navigate(`/home?=${id}`)
    }

    const go_to_dashboard = ()=> navigate('/home?=dashboard')

    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");


    return (
        <div>
            <div
                className={isSideBarOpen ? ' min-w-[261px] bg-[#416555] dark:bg-[#2b2c37] fixed top-[72px] h-screen items-center left-0 z-20 ' : ''}
            >
                <div style={{paddingTop: "100px"}}>
                    {/* Rewrite Modal  */}
                    {
                        isSideBarOpen && (
                            <div className='w-full rounded-xl bg-[#416555] dark:bg-[#2b2c37]'>
                                <h3 className=' dark:text-gray-300 text-gray-300 font-semibold mx-4 mb-8'>
                                    ALL BOARDS({boards_length})
                                </h3>
                                <div className='flex flex-col h-[60vh] justify-between'>
                                    <div>
                                        {all_boards?.map((itm) => (
                                            <div
                                                className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full py-4 duration-500 ease-in-out 
                                                   cursor-pointer hover:bg-white hover:text-[#416555] dark:hover:bg-white dark:hover:text-[#416555] dark:text-white
                                                     ${queryParam === itm.id.toString() && " bg-[#416555] rounded-r-full text-white mr-8"}
                                               `}
                                                key={itm.id}
                                                onClick={() => board_handle(itm.id)}
                                            >
                                                <img src={boardIcon} className=' h-4'/>
                                                <p className=' text-lg font-bold'>
                                                    {itm.boardName}
                                                </p>
                                            </div>
                                        ))}

                                        <div
                                            onClick={() => {
                                                setIsBoardModalOpen(true)
                                            }}
                                            className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                                  text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                        >
                                            <img src={boardIcon} className=' h-4' alt={"board icon"}/>
                                            <p className=' text-lg font-bold'>
                                                Create New Board
                                            </p>
                                        </div>

                                        <div
                                            onClick={go_to_dashboard}
                                            className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                                  text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                        >
                                            <img src={boardIcon} className=' h-4' alt={"board icon"}/>
                                            <p className=' text-lg font-bold'>
                                                Dashboard
                                            </p>
                                        </div>

                                        {/* About us Button  */}

                                        <div
                                            onClick={() => {
                                                window.location.href = '/aboutUs'; // استفاده از window.location.href برای هدایت به صفحه ورود
                                            }}
                                            className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                                                             text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'
                                        >
                                            <img src={aboutUsIcon} alt='signout' className='h-4'/>
                                            <p className=' text-lg font-bold'>
                                                About Us
                                            </p>
                                        </div>

                                        {/* Setting Button  */}

                                        <div
                                            onClick={() => {
                                                window.location.href = '/ProfilePage'; // استفاده از window.location.href برای هدایت به صفحه ورود
                                            }}
                                            className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                    text-green-300 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                                            <img src={aboutUsIcon} alt='signout' className='h-4'/>
                                            <p className=' text-lg font-bold'>
                                                Setting
                                            </p>
                                        </div>

                                        {/* Sign Out Button */}
                                        <div
                                            onClick={signoutHandler}
                                            className=' flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer
                     text-red-700 px-5 py-4 hover:bg-white hover:text-[#416555] dark:hover:bg-white'>
                                            <img src={SignoutIcon} alt='signout' className='h-4'/>
                                            <p className=' text-lg font-bold'>
                                                Sign Out
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className=' mx-2 px-1 relative space-x-2 bg-[#416555] dark:bg-[#2b2c37] flex justify-center items-center rounded-lg'>
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
                        )
                    }

                    {/* Sidebar hide/show toggle */}
                    {isSideBarOpen ? (
                            <div
                                onClick={() => setIsSideBarOpen(state => !state)}
                                className=' flex items-center mt-2 absolute bottom-16 text-lg font-bold rounded-r-full hover:text-[#ebf4f0] cursor-pointer mr-6
          mb-8 px-8 py-4 hover:bg-white space-x-2 justify-center my-4 text-gray-500'>
                                <img src={hideSidebarIcon} alt='hideSidebarIcon' className=' min-w-[20px]'/>
                                {isBoardModalOpen && <p> Hide Sidebar</p>}
                            </div>
                        ) :
                        <div
                            onClick={() => setIsSideBarOpen(state => !state)}
                            className='flex items-center mt-2 absolute bottom-0 text-lg font-bold rounded-r-full hover:text-[#ebf4f0] cursor-pointer mr-6
        mb-8 px-8 py-4 space-x-2 justify-center my-4 text-gray-500 bg-[#416555] dark:bg-[#635fc71a] dark:hover:bg-[#416555]'>
                            <img src={showSidebarIcon} alt='showSidebarIcon' className=' min-w-[20px]'/>

                        </div>
                    }
                </div>
            </div>
            {
                isBoardModalOpen &&
                <AddEditBoardModal
                    type='add'
                    setBoardModalOpen={setIsBoardModalOpen}
                    setCheck={setCheck}
                />
            }
        </div>
    )
}

export default Sidebar;
