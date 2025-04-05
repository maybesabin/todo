import { useGlobalContext } from "@/context/globalContext"
import { X } from "lucide-react"
import { SetStateAction } from "react"

const deleteTask = ({
    _id,
    title,
    showDeleteTask,
    setShowDeleteTask
}: {
    _id: string | null,
    title: string | null,
    showDeleteTask: boolean,
    setShowDeleteTask: React.Dispatch<SetStateAction<boolean>>
}) => {

    const { deleteTask } = useGlobalContext();

    return (
        <div className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:p-6 p-4 rounded-lg flex flex-col items-start gap-6 md:w-[30rem] w-[90%] ${showDeleteTask ? "visible scale-100" : "invisible scale-0"} transition-all duration-200`}>
            <div className="flex items-center justify-between w-full">
                <h3 className="md:text-sm text-xs">
                    Do you want to delete the task "{title}" ?
                </h3>
                <X size={'20px'} onClick={() => setShowDeleteTask(!showDeleteTask)} />
            </div>
            <button
                onClick={() => {
                    deleteTask(_id);
                    setShowDeleteTask(!showDeleteTask)
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md md:text-sm text-xs cursor-pointer">
                Delete
            </button>
        </div>
    )
}

export default deleteTask