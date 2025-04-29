import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import { ring } from "ldrs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import EditTask from "../components/editTask"
import { Checkbox } from "./ui/checkbox";
import { Edit } from "lucide-react";

const allTasks = () => {

    ring.register();
    const { tasks, isAuthenticated, loading, error, fetchTasks, token, categories } = useGlobalContext();
    const [showEditTask, setShowEditTask] = useState<boolean | false>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const handleEditClick = (taskId: string) => {
        setSelectedTaskId(taskId);
        setShowEditTask(true)
    }

    const updateTask = async (taskId: string) => {
        const loadingToast = toast.loading("Updating task")
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/task/complete/${taskId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': "application/json"
                    }
                })
            toast.success("Updated task!")
            fetchTasks();
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        } finally {
            toast.dismiss(loadingToast)
        }
    }

    return (
        <>
            {
                loading ? (
                    <>
                        {/* @ts-ignore */}
                        <l-ring
                            size="20"
                            stroke="2"
                            bg-opacity="0"
                            speed="2"
                            color="gray"
                        />
                    </>
                ) : (
                    //sorts completed tasks to bottom
                    tasks.sort((a: any, b: any) => {
                        if (a.isCompleted === b.isCompleted) return 0;
                        return a.isCompleted ? 1 : -1;
                    }).map((item: any, idx: number) => {

                        // Find matching category
                        const matchingCategory = categories.find(
                            (category: any) => category.title.toLowerCase() === item.category?.toLowerCase()
                        );

                        return (
                            <div
                                key={idx}
                                className="border md:p-4 p-2 rounded-md w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        onClick={() => updateTask(item._id)}
                                        checked={item.isCompleted}
                                    />
                                    <div className="bg-neutral-100 rounded-full h-9 w-9 flex items-center justify-center">
                                        {matchingCategory?.icon && React.cloneElement(matchingCategory.icon, {
                                            className: "size-[33px] p-2"
                                        })}
                                    </div>
                                    <h3
                                        className={`${item.isCompleted && "line-through text-neutral-600"} md:text-sm text-xs font-medium first-letter:uppercase`}
                                    >
                                        {item.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-4 md:-mr-4 -mr-3">
                                    {
                                        item.isCompleted == false ?
                                            <div className="cursor-pointer">
                                                <Edit
                                                    onClick={() => {
                                                        if (isAuthenticated) {
                                                            handleEditClick(item._id);
                                                        } else {
                                                            toast.error("You need to login first.");
                                                        }
                                                    }}
                                                    size={'32px'}
                                                    className="hover:bg-neutral-100 p-2 rounded-md"
                                                />
                                            </div>
                                            :
                                            <div className="text-xs border rounded-full px-2 py-1 -mr-5">
                                                Completed
                                            </div>
                                    }
                                    <div className="relative group cursor-pointer">
                                        <h4 className="md:flex hidden absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible w-max -top-8 -left-5 text-xs text-white px-2 py-1.5 rounded-md bg-black">
                                            Delete Task
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )
            }

            {(error && isAuthenticated && !loading) && <div className="text-xs text-red-500 -mt-2">{error}</div>}

            {(tasks.length == 0 && loading == false && error == null) &&
                <p className="text-neutral-400 text-xs -mt-2">No tasks available</p>
            }

            {/* Edit Task */}
            <EditTask showEditTask={showEditTask} setShowEditTask={setShowEditTask} _id={selectedTaskId} />

            {showEditTask && <div className="z-40 w-full fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />}
        </>
    )
}

export default allTasks