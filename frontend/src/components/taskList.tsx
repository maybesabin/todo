import { useState } from "react";
import AllTasks from "./allTasks"
import CompletedTask from "./completedTask";
import PendingTask from "./pendingTask";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast"
import axios from "axios";
import { useGlobalContext } from "@/context/globalContext";

const taskList = () => {
    const [active, setActive] = useState("All");
    const taskTypes = ["All", "Pending", "Completed"]
    const { fetchTasks, tasks } = useGlobalContext();

    const deleteMany = async () => {
        const token = localStorage.getItem("token")
        const endpoint = active == "All" ? "delete-all" : active == "Pending" ? "delete-active" : "delete-completed"
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/task/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            toast.success(`Deleted ${active.toLowerCase()} tasks!`)
            fetchTasks();
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col items-start md:gap-6 gap-4 w-full mt-4">

            {/* Categories */}
            <div className="bg-neutral-100 p-1 rounded-sm flex items-center justify-between gap-2 w-full">
                {taskTypes.map((_) => (
                    <div
                        onClick={() => setActive(_)}
                        key={_}
                        className={`${active == _ && "bg-white"} transition-all cursor-pointer md:font-medium md:text-sm text-xs w-1/3 md:py-2.5 py-2 text-center rounded-sm`}
                    >
                        {_}
                    </div>
                ))}
            </div>

            <div className="w-full flex items-center justify-between md:text-sm text-xs font-medium">
                <p className="text-neutral-600">{active} Tasks</p>
                <button
                    disabled={
                        (active === "All" && tasks.length === 0) ||
                        (active === "Pending" && tasks.filter((item: any) => item.isCompleted === false).length === 0) ||
                        (active === "Completed" && tasks.filter((item: any) => item.isCompleted === true).length === 0)
                    }
                    onClick={deleteMany}
                    className={`cursor-pointer flex items-center md:font-medium font-normal gap-2 border rounded-md px-2 py-1 text-rose-600 hover:text-rose-700`}
                >
                    <Trash className="md:size-[14px] size-[12px]" />
                    <span>Delete All</span>
                </button>
            </div>

            {
                active == "All" ? <AllTasks /> :
                    active == "Pending" ? <PendingTask />
                        : <CompletedTask />
            }
        </div >
    )
}

export default taskList