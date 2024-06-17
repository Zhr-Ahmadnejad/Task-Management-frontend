import React, {useEffect, useState} from 'react'

import logo from '../Assets/logo.png'
import icondown from '../Assets/icon-chevron-down.svg'
import iconup from '../Assets/icon-chevron-up.svg'
import elipsis from '../Assets/elipsis3.png'
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../Modals/AddEditBoardModal'
import AddEditTaskModal from '../Modals/AddEditTaskModal'
import ElipsisMenu from './ElipsisMenu'
import DeleteModal from '../Modals/DeleteModal'
import Cookies from "js-cookie";
import {useNavigate, useSearchParams} from "react-router-dom"
import axios from "axios";

///creat Header component
function Header({setBoardModalOpen, boardModalOpen}) {
/// use hook useState for manage dropdown
    const [openDropdown, setOpenDropdown] = useState(false)
    const [boardType, setBoardType] = useState('add')
    const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [nameBoard, setNameBoard] = useState("");


    let [searchParams] = useSearchParams();
    let queryParam = searchParams.get("");

    const user_token = Cookies.get('token');

    useEffect(() => {


        (async () => {
            try {
                const {data} = await axios.get(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                    headers: {
                        Authorization: `Bearer ${user_token}`
                    }
                })

                if (data) {

                    setNameBoard(data.boardName)
                }
            } catch (err) {
                console.log(err)
            }
        })()

    }, [queryParam]);

    const setOpenEditModal = () => {
        setBoardModalOpen(true)
        setIsElipsisMenuOpen(false)
    }

    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setIsElipsisMenuOpen(false)
    }

    const onDeleteBtnClick = async () => {

        try {
            const {data} = await axios.delete(`http://localhost:8088/api/user/boards/${+queryParam}`, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            })


            if (data) {
                setIsDeleteModalOpen(false)
                navigate("/")
                navigate(0)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const cancelBtn = () => setIsDeleteModalOpen(false)

    const onDropdownClick = () => {
        setOpenDropdown(state => !state)
        setBoardType('add')
    }

    const navigate = useNavigate()

    useEffect(() => {
        const tokenData = Cookies.get('token')

        if (!tokenData) {
            navigate("/")
        }
    }, [])


    const open_drop_handle = () => {
        setBoardType("edit");
        setOpenDropdown(false)
        setIsElipsisMenuOpen((prevState) => !prevState);
    }

    const close_dropDown = () => setIsElipsisMenuOpen(false)


    return (
        <div className=' p-4 fixed left-0 bg-[#416555] dark:bg-[#2b2c37] z-50 right-0'>
            <header className=' flex justify-between dark:text-white items-center'>


                {/* Left Side */}
                <div className=' flex items-center space-x-2 md:space-x-4'>
                    <img src={logo} alt='logo' width="300" height="200" className=' hidden md:inline-block'/>

                    <div className='flex items-center'>
                        <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans text-white'>
                            {nameBoard}
                        </h3>
                        <img
                            src={openDropdown ? iconup : icondown} alt='dropdown icon'
                            className=' h-5 w-5 ml-3 mt-2.5 cursor-pointer md:hidden'
                            onClick={onDropdownClick}
                        />
                    </div>

                </div>

                {/* Right Side */}
                <div className=' flex items-center space-x-4 md:space-x-6 '>
                    <button
                        onClick={() => setIsTaskModalOpen((prevState) => !prevState)}
                        className='hidden md:block button'
                    >
                        + Add New Task
                    </button>

                    <button
                        onClick={
                            () => {
                                // setOpenAddEditTassk(state => !state)
                                setIsTaskModalOpen((prevState) => !prevState)
                            }
                        }
                        className='button py-1 px-3 md:hidden'>
                        +
                    </button>
                    <img
                        onClick={open_drop_handle}
                        src={elipsis}
                        alt="elipsis"
                        className=" cursor-pointer h-6"
                    />

                    {
                        isElipsisMenuOpen &&
                        <ElipsisMenu
                            setOpenDeleteModal={setOpenDeleteModal}
                            setOpenEditModal={setOpenEditModal}
                            type='Boards'
                            closeModal={close_dropDown}
                        />
                    }


                </div>
                {
                    openDropdown &&
                    <HeaderDropdown setBoardModalOpen={setBoardModalOpen} setOpenDropdown={setOpenDropdown}/>
                }
            </header>

            {
                isTaskModalOpen && (
                    <AddEditTaskModal setIsAddTaskModalOpen={setIsTaskModalOpen} type="add" device="mobile"/>
                )
            }
            {
                boardModalOpen && (
                    <AddEditBoardModal setBoardType={setBoardType} type={boardType} setBoardModalOpen={setBoardModalOpen}/>
                )
            }
            {
                isDeleteModalOpen && (
                    <DeleteModal
                        type="board"
                        title={nameBoard}
                        onDeleteBtnClick={onDeleteBtnClick}
                        toggleDeleteModal={cancelBtn}
                    />
                )
            }
        </div>
    )
}

export default Header
