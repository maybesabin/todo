import Dashboard from "@/container/dashboard"
import { useState } from "react"
import Sidebar from "../components/sidebar"
import { LogOut } from "lucide-react";
import Settings from "../container/settings";
import Users from "../container/users"

const dashboard = () => {

    const [active, setActive] = useState("users");
    const handleLogout = () => {
        localStorage.removeItem("token");
        setTimeout(() => {
            window.location.reload();
        }, 500)
    }

    return (
        <div className="flex items-start lg:gap-4 md:gap-2 gap-0 w-full">
            <Sidebar
                active={active}
                setActive={setActive}
            />

            <div className="lg:w-[calc(100%-288px)] md:w-[calc(100%-224px)] w-[calc(100%-56px)] lg:p-6 p-3">
                <h1 className="mb-8 tracking-tighter font-medium lg:text-4xl text-2xl text-neutral-800">
                    {active.charAt(0).toUpperCase() + active.slice(1)}
                </h1>
                {
                    active == "dashboard" ? <Dashboard /> :
                        active == "settings" ? <Settings /> :
                            active == "users" ? <Users /> : ''
                }
            </div>

            {/* Logout */}
            <div
                onClick={handleLogout}
                className="absolute right-4 top-4 flex items-center gap-2 text-neutral-600 hover:text-black cursor-pointer text-sm"
            >
                <LogOut size={'17px'} />
                <span className="md:block hidden">Logout</span>
            </div>
        </div>
    )
}

export default dashboard