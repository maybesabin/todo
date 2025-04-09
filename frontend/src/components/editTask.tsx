import axios from "axios"
import { X } from "lucide-react"
import { toast } from "react-hot-toast";
import { SetStateAction, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGlobalContext } from "@/context/globalContext";

const editTask = ({
    _id,
    showEditTask,
    setShowEditTask
}: {
    _id: string | null,
    showEditTask: boolean,
    setShowEditTask: React.Dispatch<SetStateAction<boolean>>
}) => {

    interface TaskType {
        title: string | undefined;
        description: string | undefined;
        category: string | undefined;
    }

    const token = localStorage.getItem("token");

    const { fetchTasks, tasks, categories } = useGlobalContext();

    const [formData, setFormData] = useState<TaskType>({
        title: "",
        description: "",
        category: ""
    })

    const currentTask = tasks.find((task: any) => task._id === _id);

    useEffect(() => {
        setFormData({
            title: currentTask?.title,
            description: currentTask?.description,
            category: currentTask?.category
        })
    }, [currentTask])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    // Handles select dropdown changes separately
    const handleSelectChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value,
        }));
    };

    const editTask = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/task/${_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            if (response.status == 200) {
                toast.success("Task edited successfully!")
                setShowEditTask(!showEditTask)
                fetchTasks();
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const deleteTask = async (taskId: string | null) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': "application/json"
                }
            })
            toast.success("Task deleted successfully!")
            setShowEditTask(!showEditTask)
            fetchTasks();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="w-full">
            <div
                className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:p-6 p-4 rounded-lg flex flex-col items-start gap-6 md:w-[30rem] w-[90%] ${showEditTask ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-75"} transition-all duration-200`}>
                <div className="flex items-center justify-between w-full">
                    <h3 className="md:text-lg text-sm font-medium">Edit Task</h3>
                    <X size={'20px'} onClick={() => setShowEditTask(!showEditTask)} />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="title">Task Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="md:text-sm text-xs border-neutral-200"
                        placeholder="Doing chores"
                    />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="description">Task Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ resize: 'none' }}
                        className="outline-none h-48 border border-neutral-200 p-2 rounded-md md:text-sm text-xs"
                        placeholder="Doing chores"
                    />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="category">Task Category</label>
                    {formData.category &&
                        <Select
                            onValueChange={handleSelectChange}
                            value={formData.category?.trim() || ""}
                            defaultValue={formData.category?.trim() || ""}
                        >
                            <SelectTrigger className="border-neutral-200 w-full md:text-sm text-xs">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-neutral-200">
                                {categories.map((item: any, idx: number) => (
                                    <SelectItem
                                        key={idx}
                                        value={item.title.toLowerCase() == 'household chores' ? 'chores' : item.title.toLowerCase()}
                                    >
                                        {item.icon}{item.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    }
                </div>
                <div className="flex items-center justify-end gap-2 w-full">
                    <button
                        onClick={() => deleteTask(_id)}
                        className="md:text-sm text-xs bg-red-600 text-white font-medium px-3 py-2 cursor-pointer hover:bg-red-500 rounded-lg"
                    >
                        Delete
                    </button>
                    <button
                        onClick={editTask}
                        className="md:text-sm text-xs bg-black text-white font-medium px-3 py-2 cursor-pointer hover:bg-neutral-800 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default editTask;