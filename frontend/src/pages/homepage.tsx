import { useGlobalContext } from "../context/globalContext"
import AddTask from "../components/addTask"
import { useState } from "react";
import TaskList from "../components/taskList"
import emoji from "../assets/clipboard.png"
import { Link } from "react-router-dom";

const Homeapage = () => {

    const { tasks, isAuthenticated } = useGlobalContext();
    const [showAddTask, setShowAddTask] = useState<boolean | false>(false);

    return (
        <>
            <div className="w-full relative">

                {isAuthenticated ?
                    <h3
                        onClick={() => {
                            localStorage.removeItem("token")
                            window.location.reload();
                        }}
                        className="absolute top-0 right-0 md:text-sm text-xs hover:underline cursor-pointer">
                        logout
                    </h3>
                    :
                    <Link
                        to={'/login'}
                        className="absolute top-0 right-0 md:text-sm text-xs hover:underline cursor-pointer">
                        login
                    </Link>
                }

                <div className="flex items-center justify-between w-full pt-9">
                    <div className="flex items-center gap-2">
                        <img className="md:size-12 size-6" src={emoji} alt="Iphone cool emoji" />
                        <h1 className="flex items-center gap-4 md:text-5xl text-2xl font-semibold">
                            Tasks
                            <span className="md:text-sm text-xs bg-neutral-200 rounded-full py-1 px-2.5">{tasks.length}</span>
                        </h1>
                    </div>

                    <div></div>
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