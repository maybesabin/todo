import axios from "axios"
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress"
import { ring } from "ldrs";

const topTasks = () => {
    ring.register()
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [topCategories, setTopCategories] = useState<string[] | any>([]);
    const [totalTaskCount, setTotalTaskCount] = useState(0)

    const fetchUsers = async () => {
        const token = localStorage.getItem("token")
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const tasks = response.data.tasks;
            setTotalTaskCount(tasks.length)

            //Count the frequency of each category
            const categoryCount: Record<string, number> = {};

            tasks.forEach((task: { category: string }) => {
                const category = task.category;
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            });

            //Sort categories in descending order
            const sortedCategories = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1]) //sort
                .slice(0, 5); // Take top 5

            setTopCategories(sortedCategories)
        } catch (error: any) {
            console.log(error.message)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    return (
        <div className="xl:w-1/2 w-full rounded-md md:p-4 p-3 border flex flex-col items-start gap-6">
            <h2 className="lg:text-2xl text-base font-medium">Top Categories</h2>
            {
                !loading ?
                    topCategories.map((_: any, idx: number) => (
                        <div
                            key={idx}
                            className="w-full flex flex-col gap-2"
                        >
                            <div className="w-full flex items-center justify-between">
                                <p className="text-neutral-600 md:text-base text-sm first-letter:capitalize">
                                    {topCategories[idx][0]}
                                </p>
                                <span className="text-neutral-800 md:text-sm text-xs">
                                    {((topCategories[idx][1] / totalTaskCount) * 100).toFixed()}%
                                </span>
                            </div>
                            <Progress value={(topCategories[idx][1] / totalTaskCount) * 100} />
                        </div>
                    ))
                    :
                    <>
                        {/* @ts-ignore */}
                        <l-ring
                            size="20"
                            stroke="2"
                            bg-opacity="0"
                            speed="2"
                            color="black"
                        >
                            {/* @ts-ignore */}
                        </l-ring>
                    </>

            }
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}

export default topTasks