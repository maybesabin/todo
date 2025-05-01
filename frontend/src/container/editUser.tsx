import { Button } from "@/components/ui/button";
import UserOverview from "@/components/userOverview";
import UserTasks from "@/components/userTasks";
import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

const EditUser = () => {
    const { token } = useGlobalContext();
    const [user, setUser] = useState<any>([])
    const [active, setActive] = useState("overview")

    const { id } = useParams();
    const getUserDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUser(response.data.user);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])

    return (
        <div className="w-full">
            <Link to={'/dashboard/users'}>
                <Button variant={"outline"} className="mb-6 flex items-center gap-2">
                    <ChevronLeft size={'17px'} />
                    <span>Back</span>
                </Button>
            </Link>
            <div className="w-full flex lg:flex-row flex-col items-start gap-6">
                <div className="flex flex-col items-center gap-2 border rounded-lg md:p-4 p-3 lg:w-1/3 w-full">
                    {
                        user.profilePic ?
                            <img src={user.profilePic} className="md:h-20 md:w-20 h-14 w-14 rounded-full object-cover" /> :
                            <h3 className="bg-neutral-100 cursor-default md:h-20 md:w-20 h-14 w-14 rounded-full flex items-center justify-center text-black md:text-2xl text-base">
                                {user.username?.charAt(0).toUpperCase()}
                            </h3>
                    }
                    <h1 className="mt-4 md:text-3xl text-xl font-semibold">{user.username}</h1>
                    <p className="text-neutral-600 md:text-sm text-xs">{user.email}</p>
                    <p className="text-neutral-600 md:text-sm text-xs">Role</p>
                    <div className={`border px-3 py-0.5 rounded-full text-xs capitalize font-medium`}>
                        {user.role}
                    </div>
                </div>

                <div className="lg:w-2/3 w-full flex flex-col md:items-start items-center gap-6">

                    {/* Tabs */}
                    <div className="relative p-1 md:text-sm text-xs flex w-58 items-center gap-2 rounded-full bg-neutral-100">
                        <div
                            onClick={() => setActive("overview")}
                            className={`${active != "overview" && "text-neutral-600"} cursor-pointer z-30 w-1/2 flex items-center justify-center rounded-full px-4 py-2`}
                        >
                            Overview
                        </div>
                        <div
                            onClick={() => setActive("tasks")}
                            className={`${active == "overview" && "text-neutral-600"} cursor-pointer z-30 w-1/2 flex items-center justify-center rounded-full px-4 py-2`}
                        >
                            Tasks
                        </div>
                        <div className={`w-1/2 bg-white absolute top-1 transition-all duration-300 ease-in ${active == "overview" ? "left-1" : "left-[49%]"} h-[85%] z-20 rounded-full`}></div>
                    </div>

                    {active == "overview" ?
                        <UserOverview id={id} /> :
                        <UserTasks id={id} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EditUser