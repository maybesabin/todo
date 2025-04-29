import { useGlobalContext } from "../context/globalContext"
import AddTask from "../components/addTask"
import { useEffect, useState } from "react";
import TaskList from "../components/taskList"
import { Link } from "react-router-dom";
import axios from "axios";
import { LogIn, Sparkles } from "lucide-react";
import SearchTask from "../components/searchTask"
import UserProfile from "../components/userProfile"

const Homeapage = () => {

    const { tasks, isAuthenticated } = useGlobalContext();
    const [showAddTask, setShowAddTask] = useState<boolean | false>(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                setUsername(response.data.username);
            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchUserData();
    }, [])

    return (
        <div className="w-full h-screen flex items-start justify-center md:py-12 py-6 xl:px-0 px-6">
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
                                    {tasks.length}
                                </span>
                            </h1>
                        </div>

                        {
                            isAuthenticated ?
                                <div className="flex items-center gap-4">
                                    <SearchTask />
                                    <div className="relative group">
                                        <h3 className="bg-rose-100 cursor-default h-8 w-8 rounded-full flex items-center justify-center text-rose-500 md:text-base text-sm">
                                            {username?.charAt(0).toUpperCase()}
                                        </h3>
                                        <div className="group-hover:visible group-hover:opacity-100 group-hover:scale-100 scale-0 opacity-0 transition-all duration-300 invisible">
                                            <UserProfile />
                                        </div>
                                    </div>
                                    <p
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            window.location.reload();
                                        }}
                                        className="md:text-sm text-xs text-neutral-500 hover:text-black">
                                        Logout
                                    </p>
                                </div>
                                :
                                <Link
                                    to={'/login'}
                                    className="flex items-center gap-2 cursor-pointer group">
                                    <LogIn size={'17px'} className="text-neutral-500 group-hover:text-black" />
                                    <p
                                        className="md:text-sm text-xs text-neutral-500 group-hover:text-black">
                                        Login
                                    </p>
                                </Link>
                        }
                    </div>

                    <AddTask showAddTask={showAddTask} setShowAddTask={setShowAddTask} />

                    {/* Task List */}
                    <TaskList />
                </div>

                {/* Overlay */}
                {showAddTask && <div className="z-40 w-full h-screen fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />}
            </div>
        </div>

    )
}

export default Homeapage