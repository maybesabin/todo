import { useGlobalContext } from "@/context/globalContext"
import { BriefcaseBusiness, ListCheck, MessageSquare, Package, PencilLine, Trash, Trophy, UserRound, Wallet } from "lucide-react";
import { useState } from "react";
import DeleteTask from "../components/deleteTask"
import EditTask from "../components/editTask"
import { toast } from "react-hot-toast"

const taskList = () => {
    const { tasks, isAuthenticated } = useGlobalContext();
    const [showDeleteTask, setShowDeleteTask] = useState<boolean | false>(false);
    const [showEditTask, setShowEditTask] = useState<boolean | false>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedTaskTitle, setSelectedTaskTitle] = useState<string | null>(null);

    const handleDeleteClick = (taskId: string, title: string) => {
        setSelectedTaskId(taskId);
        setSelectedTaskTitle(title);
        setShowDeleteTask(true);
    };

    const handleEditClick = (taskId: string) => {
        setSelectedTaskId(taskId);
        setShowEditTask(true)
    }

    const categories = [
        { title: 'Chores', icon: <ListCheck size={'33px'} className="p-2" /> },
        { title: 'Work', icon: <BriefcaseBusiness size={'33px'} className="p-2" /> },
        { title: 'Personal', icon: <UserRound size={'33px'} className="p-2" /> },
        { title: 'Finances', icon: <Wallet size={'33px'} className="p-2" /> },
        { title: 'Social', icon: <MessageSquare size={'33px'} className="p-2" /> },
        { title: 'Goals', icon: <Trophy size={'33px'} className="p-2" /> },
        { title: 'Miscellaneous', icon: <Package size={'33px'} className="p-2" /> },
    ];

    return (
        <div className="flex flex-col items-start md:gap-6 gap-4 w-full mt-6">
            {tasks.map((item: any, idx: number) => {

                //find matching category
                const matchingCategory = categories.find(
                    (category) => category.title.toLowerCase() === item.category?.toLowerCase()
                );

                return (
                    <div key={idx} className="border md:p-4 p-3 rounded-md w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-neutral-100 rounded-full h-9 w-9 flex items-center justify-center">
                                {matchingCategory?.icon}
                            </div>
                            <h3 className="md:text-sm text-xs font-medium first-letter:uppercase">{item.title}</h3>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <h4 className="md:flex hidden absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible w-max -top-8 -left-5 text-xs text-white px-2 py-1.5 rounded-md bg-black">
                                    Edit Task
                                </h4>
                                <PencilLine
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            handleEditClick(item._id)
                                        } else {
                                            toast.error("You need to login first.")
                                        }
                                    }}
                                    size={'25px'}
                                    className="hover:bg-neutral-200 p-1 rounded-md"
                                />
                            </div>
                            <div className="relative group cursor-pointer">
                                <h4 className="md:flex hidden absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible w-max -top-8 -left-5 text-xs text-white px-2 py-1.5 rounded-md bg-black">
                                    Delete Task
                                </h4>
                                <Trash
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            handleDeleteClick(item._id, item.title)
                                        } else {
                                            toast.error("You need to login first.")
                                        }
                                    }}
                                    size={'25px'}
                                    className="hover:bg-neutral-200 p-1 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Delete Task */}
            <DeleteTask title={selectedTaskTitle} showDeleteTask={showDeleteTask} setShowDeleteTask={setShowDeleteTask} _id={selectedTaskId} />

            {/* Edit Task */}
            <EditTask showEditTask={showEditTask} setShowEditTask={setShowEditTask} _id={selectedTaskId} />

            {(showDeleteTask || showEditTask) &&
                <div className="z-40 w-full h-screen fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />
            }

        </div >
    )
}

export default taskList