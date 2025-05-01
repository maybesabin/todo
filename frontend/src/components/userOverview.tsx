import { BadgeCheck, ClipboardList, Clock } from "lucide-react"
import Card from "../components/dashboardCard"
import axios from "axios"
import { useGlobalContext } from "@/context/globalContext"
import { useEffect, useState } from "react"
import { Progress } from "./ui/progress"

const UserOverview = ({ id }: { id: string | undefined }) => {

    const { token } = useGlobalContext();
    const [tasks, setTasks] = useState<any>({
        total: 0,
        pending: 0,
        completed: 0
    })

    const getUserTasks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/user-tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            let totalTasks = response.data.tasks

            setTasks({
                total: totalTasks.length,
                pending: totalTasks.filter((item: any) => !item.isCompleted).length,
                completed: totalTasks.filter((item: any) => item.isCompleted).length,
            })
        } catch (error: any) {
            console.log(error.message)
            setTasks({
                total: "N/A",
                pending: "N/A",
                completed: "N/A",
            })
        }
    }

    const cardItems = [
        { title: "Total Tasks", icon: ClipboardList, growth: 0, number: tasks.total },
        { title: "Pending Tasks", icon: Clock, growth: 0, number: tasks.pending },
        { title: "Completed Tasks", icon: BadgeCheck, growth: 0, number: tasks.completed }
    ]

    useEffect(() => {
        getUserTasks()
    }, [])

    return (
        <div className="w-full">
            <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {cardItems.map((item, idx) => (
                    <Card
                        key={idx}
                        title={item.title}
                        icon={item.icon}
                        growth={item.growth}
                        number={item.number}
                    />
                ))}
            </div>

            <div className="w-full border rounded-lg md:p-4 p-3 mt-4">
                <h2 className="md:text-2xl text-base font-semibold">Task Completion</h2>
                <div className="w-full flex flex-col items-start gap-2 mt-5">
                    <div className="flex items-center justify-between w-full">
                        <p className="md:text-sm text-xs">🟢 Completed</p>
                        <p className="md:text-sm text-xs">{tasks.total} tasks</p>
                    </div>
                    <Progress
                        value={(tasks.completed / tasks.total) * 100}
                    />
                </div>
                <div className="w-full flex flex-col items-start gap-2 mt-6">
                    <div className="flex items-center justify-between w-full">
                        <p className="md:text-sm text-xs">🟠 Pending</p>
                        <p className="md:text-sm text-xs">{tasks.pending} tasks</p>
                    </div>
                    <Progress
                        value={(tasks.pending / tasks.total) * 100}
                    />
                </div>
            </div>
        </div>
    )
}

export default UserOverview