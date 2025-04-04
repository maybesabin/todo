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

    const { fetchTasks, tasks } = useGlobalContext();

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
            const response = await axios.put(`http://${import.meta.env.VITE_BACKEND_URI}/api/task/${_id}`,
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


    return (
        <div className="w-full">
            <form
                onSubmit={editTask}
                className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:p-6 p-4 rounded-lg flex flex-col items-start gap-6 md:w-[30rem] w-[90%]`}>
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
                            value={formData.category || ""}
                            defaultValue={formData.category || ""}
                        >
                            <SelectTrigger className="border-neutral-200 w-full md:text-sm text-xs">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-neutral-200">
                                <SelectItem value="chores">Household Chores</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="school">School</SelectItem>
                            </SelectContent>
                        </Select>
                    }
                </div>
                <button
                    className="md:text-sm text-xs bg-black text-white font-medium px-3 py-2 cursor-pointer hover:bg-neutral-800 rounded-lg"
                    type="submit"
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default editTask;