import axios from "axios";
import { Search, X } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { ring } from "ldrs";
import { useGlobalContext } from "@/context/globalContext";
import toast from "react-hot-toast";
import { Checkbox } from "./ui/checkbox";

interface PropsType {
    showSearchPopup: boolean;
    setShowSearchPopup: React.Dispatch<SetStateAction<boolean>>;
}

const searchTask = ({ showSearchPopup, setShowSearchPopup }: PropsType) => {
    ring.register();
    const [searchText, setSearchText] = useState("");
    const [filteredTasks, setFilteredTasks] = useState<any | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const { categories, fetchTasks } = useGlobalContext();

    const search = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearchSubmitted(true);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URI}/api/task/search?query=${searchText}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setFilteredTasks(response.data);
            setLoading(false);
        } catch (error: any) {
            console.log(`Error: ${error.message}`);
            setError("Failed to fetch tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopup = () => {
        setShowSearchPopup(!showSearchPopup)
        setFilteredTasks([])
        setSearchText("")
        setSearchSubmitted(false)
    }

    const updateTask = async (taskId: string) => {
        const token = localStorage.getItem("token")
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
            setShowSearchPopup(false);
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        } finally {
            toast.dismiss(loadingToast)
        }
    }

    return (
        <>
            <Search
                className="md:block hidden cursor-pointer text-neutral-400 hover:text-black transition-all"
                onClick={handleClosePopup}
                size={"20px"}
            />
            <div
                className={`z-[1000] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:p-6 p-4 rounded-lg flex flex-col items-start gap-6 md:w-[30rem] w-[90%] 
                ${showSearchPopup
                        ? "visible opacity-100 scale-100"
                        : "invisible opacity-0 scale-75"
                    } transition-all duration-200`}
            >
                <div className="flex items-center justify-between w-full">
                    <h3 className="md:text-lg text-sm font-medium">Search Task</h3>
                    <X
                        size={"20px"}
                        onClick={handleClosePopup}
                    />
                </div>

                {/* Form */}
                <form
                    onSubmit={search}
                    className="cursor-pointer flex items-center gap-3 border p-2 rounded-lg md:text-sm text-xs w-full"
                >
                    <button type="submit">
                        <Search size={"15px"} />
                    </button>
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search task..."
                        className="border-none outline-none w-full"
                    />
                </form>

                {searchSubmitted && (
                    loading ? (
                        <div className="flex justify-center items-center w-full">
                            {/* @ts-ignore */}
                            <l-ring
                                size="20"
                                stroke="2"
                                bg-opacity="0"
                                speed="2"
                                color="gray"
                            />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-xs w-full text-center">{error}</div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="flex flex-col items-start gap-4 md:text-sm text-xs w-full">
                            {filteredTasks.map((item: any, idx: number) => {

                                // Find matching category
                                const matchingCategory = categories.find(
                                    (category: any) => category.title.toLowerCase() === item.category?.toLowerCase()
                                );
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between gap-6 rounded-lg border md:p-3 p-1.5 w-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                onClick={() => updateTask(item._id)}
                                                checked={item.isCompleted}
                                            />
                                            <div className="bg-neutral-100 rounded-full h-9 w-9 flex items-center justify-center">
                                                {matchingCategory?.icon && React.cloneElement(matchingCategory.icon, {
                                                    className: "size-[33px] p-2"
                                                })}
                                            </div>
                                            <h4 className="font-medium first-letter:capitalize">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <p className="text-neutral-800 rounded-full text-[0.6rem] border px-2 py-1">
                                            {
                                                item.isCompleted == true ? "Completed" : "Incomplete"
                                            }
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-neutral-500 text-sm text-center w-full">
                            No tasks found.
                        </div>
                    )
                )}
            </div>

            {/* Popup Overlay */}
            {showSearchPopup && (
                <div className="z-40 w-full fixed inset-0 opacity-50 bg-black backdrop-blur-2xl" />
            )}
        </>
    );
};

export default searchTask;