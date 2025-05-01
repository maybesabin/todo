import Card from "../components/dashboardCard"
import { BadgeCheck, ClipboardList, Clock, UserRoundCog, Users } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { ring } from 'ldrs'
import { useGlobalContext } from "@/context/globalContext"

const cardContainer = () => {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [admins, setAdmins] = useState<any[]>([]);
    const [tasks, setTasks] = useState({
        total: 0,
        pending: 0,
        completed: 0
    })
    const { token } = useGlobalContext()

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUsers(response.data.users)
            setAdmins(response.data.admins)
        } catch (error: any) {
            console.log(error.message)
            setError(error.message)
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            let tasks = response.data.tasks || [];

            setTasks({
                total: tasks.length,
                pending: tasks.filter((item: any) => !item.isCompleted).length,
                completed: tasks.filter((item: any) => item.isCompleted).length,
            })
        } catch (error: any) {
            console.log(error.message)
            setError(error.message)
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchUsers(), fetchTasks()])
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAllData()
    }, [])

    ring.register()
    const cards = [
        { title: "Total Users", icon: Users, growth: 0, number: users?.length },
        { title: "Admins", icon: UserRoundCog, growth: 0, number: admins?.length },
        { title: "Total Tasks", icon: ClipboardList, growth: 0, number: tasks.total },
        { title: "Pending Tasks", icon: Clock, growth: 0, number: tasks.pending },
        { title: "Completed Tasks", icon: BadgeCheck, growth: 0, number: tasks.completed }
    ]
    return (
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 gap-4">
            {
                loading ?
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
                    :
                    !error &&
                    cards.map((item, idx) => (
                        <Card
                            key={idx}
                            title={item.title}
                            icon={item.icon}
                            growth={item.growth}
                            number={item.number}
                        />
                    ))
            }
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}

export default cardContainer