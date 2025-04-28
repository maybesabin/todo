import Card from "../components/dashboardCard"
import { Check, UserRoundCog, Users } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { ring } from 'ldrs'

const cardContainer = () => {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<null | []>([]);
    const [admins, setAdmins] = useState<null | []>([]);
    const [totalTasks, setTotalTasks] = useState(0);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token")
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])
    useEffect(() => {
        const calculateTotalTasks = () => {
            let total = 0;
            users?.forEach((item: any) => {
                total += item.tasks.length
            })

            setTotalTasks(total);
        }
        calculateTotalTasks();
    }, [users])
    ring.register()

    const cards = [
        { title: "Total Tasks", icon: Check, growth: 10, number: totalTasks },
        { title: "Active Users", icon: Users, growth: 10, number: users?.length },
        { title: "Admins", icon: UserRoundCog, growth: 10, number: admins?.length }
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