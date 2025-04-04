import { useGlobalContext } from "../context/globalContext"
import AddTask from "../components/addTask"
import { useState } from "react";
import TaskList from "../components/taskList"
import emoji from "../assets/emoji.png"

const Homeapage = () => {

    const { tasks } = useGlobalContext();
    const [showAddTask, setShowAddTask] = useState<boolean | false>(false);

    return (
        <>
            <div className="w-full">

                <h3 className="md:text-sm text-xs hover:underline mb-2 flex justify-end w-full">

                </h3>

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <img className="md:size-12 size-6" src={emoji} alt="Iphone cool emoji" />
                        <h1 className="md:text-5xl text-2xl font-semibold">
                            Tasks
                        </h1>
                    </div>

                    <h3 className="md:text-2xl text-sm">
                        {tasks.length}
                    </h3>
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