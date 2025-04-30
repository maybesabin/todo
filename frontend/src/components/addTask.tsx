import axios from "axios"
import { Plus, Zap } from "lucide-react"
import { toast } from "react-hot-toast";
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGlobalContext } from "@/context/globalContext";
import { GoogleGenAI } from "@google/genai";

const addTask = () => {
    interface TaskType {
        title: string;
        category: string;
    }

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const token = localStorage.getItem("token");
    const { fetchTasks, isAuthenticated, categories } = useGlobalContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false)

    const generateContent = async (title: string) => {
        if (!title.trim()) return toast.error("Enter a valid task")
        setIsGenerating(true);

        try {
            const categoryPrompt = `
             Recommend the most appropriate category for task titled "${title}" from ONLY these options: "chores" (for household tasks), "work" (for professional tasks), "personal" (for personal learning/growth), "finances" (for money related), "social" (for family time/mental health), "goals" (for certain tasks to be done), or "miscellaneous" (for others). Write response in one word and small caps.
            `

            const categoryResponse = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ role: "user", parts: [{ text: categoryPrompt }] }]
            })

            const generatedCategory = categoryResponse?.text?.trim() || "";

            setFormData(prevData => ({
                ...prevData,
                category: generatedCategory
            }));
            setIsGenerating(false);
        } catch (error: any) {
            console.log(error.message)
            toast.error("Failed to generate description");
        } finally {
            setIsGenerating(false)
        }
    }

    const [formData, setFormData] = useState<TaskType>({
        title: "",
        category: ""
    })

    // Handles select dropdown changes separately
    const handleSelectChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            category: value,
        }));
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.category) {
            toast.error("Please fill out all required fields.");
            return;
        }
        const loadingToast = toast.loading("Adding Task")
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
                toast.dismiss(loadingToast)
                fetchTasks();
                setFormData({
                    title: "",
                    category: ""
                })
            }
        } catch (error: any) {
            console.log(error.message)
            toast.error("Failed to add task.")
        } finally {
            toast.dismiss(loadingToast)
        }
    }

    return (
        <form
            onSubmit={addTask}
            className="w-full md:py-4 py-3 mt-6"
        >

            <input
                value={formData.title}
                onChange={(e) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        title: e.target.value,
                    }));
                }}
                maxLength={50}
                placeholder="What needs to be done?"
                className={`border border-rose-200 text-rose-800 w-full outline-none px-4 md:py-4 py-2.5 rounded-md md:text-sm text-xs ${!isAuthenticated && "cursor-not-allowed"}`}
                type="text"
            />

            <div className="mt-4 w-full flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <Select
                        open={open}
                        onOpenChange={setOpen}
                        onValueChange={handleSelectChange}
                        value={formData.category.trim()}
                    >
                        <SelectTrigger className="border-neutral-200 md:text-sm text-xs md:w-52">
                            <SelectValue
                                placeholder={
                                    isGenerating
                                        ? "Selecting Category..."
                                        : "Select Category"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-neutral-200">
                            {categories.map((item: any, idx: number) => (
                                <SelectItem
                                    key={idx}
                                    value={item.title.toLowerCase()}
                                    className="md:text-sm text-xs"
                                >{item.icon}{item.title}
                                </SelectItem>
                            ))}
                            <div className="w-full bg-neutral-200 h-[1px] my-2"></div>
                            <div
                                onClick={() => {
                                    setOpen(false)
                                    generateContent(formData.title)
                                }}
                                className="cursor-default hover:bg-neutral-100 my-0.5 transition-all p-2 rounded-sm flex items-center gap-2 md:text-sm text-xs"
                            >
                                <Zap color="#ec003f" className="md:size-[17px] size-[14px]" />
                                <span className="text-rose-600">Generate with AI</span>
                            </div>
                        </SelectContent>
                    </Select>
                </div>
                <button
                    onClick={addTask}
                    className={`bg-gradient-to-b from-rose-500 to-pink-500 hover:bg-rose-600 cursor-pointer transition-all py-3 md:px-5 px-3 flex items-center justify-center gap-3 text-white rounded-md md:text-sm text-xs whitespace-nowrap`}
                >
                    <Plus size={'17px'} className={`${isAuthenticated ? "cursor-pointer" : "cursor-not-allowed"}`} />
                    <h4 className={`font-medium ${isAuthenticated ? "cursor-pointer" : "cursor-not-allowed"}`}>Add Task</h4>
                </button>
            </div>
        </form >
    )
}

export default addTask;