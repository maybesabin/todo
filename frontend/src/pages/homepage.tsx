import { useGlobalContext } from "../context/globalContext"
import AddTask from "../components/addTask"
import { useEffect, useState } from "react";
import TaskList from "../components/taskList"
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import SearchTask from "../components/searchTask"
import Sidebar from "@/components/userSidebar";
import UserProfile from "@/components/userProfile";

const Homeapage = () => {

    const { tasks, isAuthenticated, setToken, fetchUserData, userData } = useGlobalContext();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<any>([])
    const [active, setActive] = useState("Tasks")
    const navigate = useNavigate()

    useEffect(() => {
        fetchUserData();
        setFilteredTasks(tasks.filter((item: any) => item.isCompleted == false))
    }, [tasks])

    return (
        <div className="w-full h-screen flex items-start justify-center md:py-12 py-6 xl:px-0 px-6">

            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                showSearchPopup={showSearchPopup}
                setShowSearchPopup={setShowSearchPopup}
            />

            <div className="xl:w-[60rem] w-full">
                <div className="w-full">
                    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-md text-white">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h1 className="flex items-center gap-4 md:text-4xl text-3xl font-semibold">
                                Tasks
                                <span className="text-xs bg-neutral-100 rounded-full py-1 px-2.5">
                                    {filteredTasks.length}
                                </span>
                            </h1>
                        </div>

                        {
                            isAuthenticated ?
                                <div className="flex items-center gap-4">
                                    <SearchTask
                                        showSearchPopup={showSearchPopup}
                                        setShowSearchPopup={setShowSearchPopup}
                                    />
                                    <Menu
                                        onClick={() => {
                                            setShowSidebar(!showSidebar)
                                            setActive("Profile")
                                        }}
                                        size={'30px'}
                                        className="bg-neutral-100 rounded-sm p-1.5 md:hidden block"
                                    />
                                    {
                                        userData.profilePic ?
                                            <img
                                                onClick={() => setActive("Profile")}
                                                src={userData.profilePic}
                                                className="h-8 w-8 rounded-full object-cover cursor-pointer"
                                            /> :
                                            <h3
                                                onClick={() => setActive("Profile")}
                                                className="bg-rose-100 cursor-pointer    h-8 w-8 rounded-full flex items-center justify-center text-rose-500 md:text-base text-sm"
                                            >
                                                {userData.username?.charAt(0).toUpperCase()}
                                            </h3>
                                    }
                                    <p
                                        onClick={() => {
                                            setToken(null)
                                            localStorage.removeItem("token");
                                            navigate("/login")
                                        }}
                                        className="cursor-pointer md:text-sm text-xs md:block hidden text-neutral-500 hover:text-black">
                                        Logout
                                    </p>
                                </div>
                                :
                                <Link
                                    to={'/login'}
                                    className="flex items-center gap-2 cursor-pointer md:text-sm text-xs text-neutral-500 hover:text-black">
                                    Login
                                </Link>
                        }
                    </div>

                    {
                        active == "Tasks" ?
                            <>
                                <AddTask />
                                <TaskList />
                            </>
                            :
                            <UserProfile setActive={setActive} />
                    }
                </div>

                {/* Overlay */}
                {showSidebar && <div className="z-40 w-full fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />}
            </div>
        </div >

    )
}

export default Homeapage