import { useGlobalContext } from "../context/globalContext"
import AddTask from "../components/addTask"
import { useEffect, useState } from "react";
import TaskList from "../components/taskList"
import emoji from "../assets/clipboard.png"
import { Link } from "react-router-dom";
import axios from "axios";
import { LogIn, LogOut } from "lucide-react";

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
        <>
            <div className="w-full">
                <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <img className="md:size-12 size-6" src={emoji} alt="Iphone task emoji" />
                        <h1 className="flex items-center gap-4 md:text-5xl text-3xl font-semibold">
                            Tasks
                            <span className="md:text-sm text-xs bg-neutral-200 rounded-full py-1 px-2.5">
                                {tasks.length}
                            </span>
                        </h1>
                    </div>

                    {
                        isAuthenticated ?
                            <div className="flex items-center gap-4">
                                <h3 className="bg-[#fef3c7] h-8 w-8 rounded-full flex items-center justify-center text-red-800 md:text-base text-sm">
                                    {username?.charAt(0).toUpperCase()}
                                </h3>
                                <div className="flex items-center gap-2 cursor-pointer group">
                                    <LogOut size={'17px'} className="text-neutral-500 group-hover:text-black" />
                                    <p
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            window.location.reload();
                                        }}
                                        className="md:text-sm text-xs text-neutral-500 group-hover:text-black">
                                        Logout
                                    </p>
                                </div>
                            </div>
                            :
                            <Link
                                to={'/login'}
                                className="bg-black hover:bg-neutral-800 transition-all text-white rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer group">
                                <LogIn size={'17px'} />
                                <p
                                    className="md:text-sm text-xs">
                                    Login
                                </p>
                            </Link>
                    }
                </div>

                <AddTask showAddTask={showAddTask} setShowAddTask={setShowAddTask} />

                {/* Task List */}
                {tasks.length > 0 ? <TaskList /> : <p className="text-xs text-neutral-400 mt-4">No tasks available</p>}
            </div>

            {/* Overlay */}
            {showAddTask && <div className="z-40 w-full h-screen fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />}
        </>

    )
}

export default Homeapage