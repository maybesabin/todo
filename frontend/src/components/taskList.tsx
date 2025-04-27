import { useGlobalContext } from "@/context/globalContext"
import { BriefcaseBusiness, ListCheck, MessageSquare, Package, PencilLine, Trophy, UserRound, Wallet } from "lucide-react";
import { useState } from "react";
import EditTask from "../components/editTask"
import { toast } from "react-hot-toast"
import { ring } from "ldrs";

const taskList = () => {
    ring.register();
    const { tasks, isAuthenticated, loading, error } = useGlobalContext();
    const [showEditTask, setShowEditTask] = useState<boolean | false>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
        <div className="flex flex-col items-start md:gap-6 gap-4 w-full mt-4">
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
                    tasks.map((item: any, idx: number) => {
                        // Find matching category
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
                                                    handleEditClick(item._id);
                                                } else {
                                                    toast.error("You need to login first.");
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
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )
            }

            {(error && isAuthenticated) && <div className="text-xs text-red-500 -mt-2">{error}</div>}

            {(tasks.length == 0 && loading == false && error == null) &&
                <p className="text-neutral-400 text-xs -mt-2">No tasks available</p>
            }

            {/* Edit Task */}
            <EditTask showEditTask={showEditTask} setShowEditTask={setShowEditTask} _id={selectedTaskId} />

            {showEditTask &&
                <div className="z-40 w-full h-screen fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />
            }

        </div >
    )
}

export default taskList