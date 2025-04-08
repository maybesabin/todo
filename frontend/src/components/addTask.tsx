import axios from "axios"
import { BriefcaseBusiness, ListCheck, MessageSquare, Package, Plus, Trophy, UserRound, Wallet, X } from "lucide-react"
import { toast } from "react-hot-toast";
import { SetStateAction, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGlobalContext } from "@/context/globalContext";
import { GoogleGenAI } from "@google/genai";

const addTask = ({
    showAddTask,
    setShowAddTask
}: {
    showAddTask: boolean,
    setShowAddTask: React.Dispatch<SetStateAction<boolean>>
}) => {
    interface TaskType {
        title: string;
        description: string;
        category: string;
    }

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateContent = async (title: string) => {
        if (!title.trim()) return;
        setIsGenerating(true);

        try {
            const descriptionPrompt = `For a todo task titled "${title}", generate a brief and specific task description. Keep it under 1-2 sentences and make it actionable.`
            const categoryPrompt = `
             Recommend the most appropriate category for task titled "${title}" from ONLY these options: "chores" (for household tasks), "work" (for professional tasks), "personal" (for personal learning/growth), "finances" (for money related), "social" (for family time/mental health), "goals" (for certain tasks to be done), or "miscellaneous" (for others). Write response in one word and small caps.
            `

            //make both calls at once
            const [descriptionResponse, categoryResponse] = await Promise.all([
                ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }]
                }),
                ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: [{ role: "user", parts: [{ text: categoryPrompt }] }]
                })
            ]);


            const generatedDescription = descriptionResponse?.text?.trim() || "";
            const generatedCategory = categoryResponse?.text?.trim() || "";

            setFormData(prevData => ({
                ...prevData,
                description: generatedDescription,
                category: generatedCategory
            }));
        } catch (error: any) {
            console.log(error.message)
            toast.error("Failed to generate description");
        }
    }

    const token = localStorage.getItem("token");

    const { fetchTasks, isAuthenticated } = useGlobalContext();

    const [formData, setFormData] = useState<TaskType>({
        title: "",
        description: "",
        category: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))

        if (name === 'title') {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
                if (value.trim()) {
                    generateContent(value);
                }
            }, 500) //wait 500ms after user stop typing
        }
    }

    // Handles select dropdown changes separately
    const handleSelectChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value,
        }));
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.category) {
            toast.error("Please fill out all required fields.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/task`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            if (response.status == 200) {
                toast.success("Task added successfully!")
                setShowAddTask(!showAddTask)
                fetchTasks();
                setFormData({
                    title: "",
                    description: "",
                    category: ""
                })
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const categories = [
        { title: 'Household Chores', icon: <ListCheck /> },
        { title: 'Work', icon: <BriefcaseBusiness /> },
        { title: 'Personal', icon: <UserRound /> },
        { title: 'Finances', icon: <Wallet /> },
        { title: 'Social', icon: <MessageSquare /> },
        { title: 'Goals', icon: <Trophy /> },
        { title: 'Miscellaneous', icon: <Package /> },
    ];

    return (
        <div className="w-full md:py-4 p-3 mt-6">
            <div
                onClick={() => {
                    if (isAuthenticated) {
                        setShowAddTask(!showAddTask)
                    } else {
                        toast.error("You need to login first.")
                    }
                }}
                className="flex items-center gap-2 w-full">
                <button>
                    <Plus color="gray" size={'15px'} />
                </button >
                <input
                    readOnly
                    placeholder="Add New Task"
                    className="w-full outline-none border-none md:text-sm text-xs"
                    type="text"
                />
            </div>

            {/* Popup */}
            <form
                onSubmit={addTask}
                className={`z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:p-6 p-4 rounded-lg flex flex-col items-start gap-6 md:w-[30rem] w-[90%] 
                ${showAddTask ? "visible scale-100" : "invisible scale-0"} transition-all duration-200`}>
                <div className="flex items-center justify-between w-full">
                    <h3 className="md:text-lg text-sm font-medium">Add New Task</h3>
                    <X size={'20px'} onClick={() => setShowAddTask(!showAddTask)} />
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
                    <label className="md:text-sm text-xs" htmlFor="description">
                        Task Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ resize: 'none' }}
                        className="outline-none h-48 border border-neutral-200 p-2 rounded-md md:text-sm text-xs"
                        placeholder={isGenerating ? "Generating description..." : "Take out the trash at 9 am"}
                    />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="category">Task Category</label>
                    <Select
                        onValueChange={handleSelectChange}
                        value={formData.category.trim()}
                    >
                        <SelectTrigger className="border-neutral-200 w-full md:text-sm text-xs">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-neutral-200">
                            {categories.map((item, idx) => (
                                <SelectItem key={idx} value={item.title.toLowerCase()}>{item.icon}{item.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <button
                    className="md:text-sm text-xs bg-black text-white font-medium px-3 py-2 cursor-pointer hover:bg-neutral-800 rounded-lg"
                    type="submit"
                >
                    Add Task
                </button>
            </form>
        </div>
    )
}

export default addTask;