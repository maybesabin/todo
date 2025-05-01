import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

const UserTasks = ({ id }: { id: string | undefined }) => {
    const { token, categories } = useGlobalContext();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null)

    const getUserTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/user-tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setTasks(response.data.tasks);
        } catch (error: any) {
            console.log(error.message);
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserTasks();
    }, []);

    return (
        <div className="w-full border rounded-lg md:p-4 p-3 mt-4">
            <h2 className="md:text-2xl text-base font-semibold">User Tasks</h2>
            <div className="flex flex-col items-start gap-4 mt-6">
                {loading ? (
                    <>
                        {/* @ts-ignore */}
                        <l-ring size="20" stroke="2" bg-opacity="0" speed="2" color="gray" />
                    </>
                ) : (
                    // Sorts completed tasks to the bottom
                    tasks
                        .sort((a: any, b: any) => {
                            if (a.isCompleted === b.isCompleted) return 0;
                            return a.isCompleted ? 1 : -1;
                        })
                        .map((item: any, idx: number) => {
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
                                        <div className="bg-neutral-100 rounded-full h-9 w-9 flex items-center justify-center">
                                            {matchingCategory?.icon &&
                                                React.cloneElement(matchingCategory.icon, {
                                                    className: "size-[33px] p-2",
                                                })}
                                        </div>
                                        <h3
                                            className={`${item.isCompleted && "line-through text-neutral-600"
                                                } md:text-sm text-xs font-medium first-letter:uppercase`}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })
                )}
                {error && <div className="text-xs text-red-500">{error}</div>}
            </div>
        </div>
    );
};

export default UserTasks;