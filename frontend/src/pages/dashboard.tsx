import Sidebar from "../components/adminSidebar"
import { LogOut } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext"

const dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setToken } = useGlobalContext();
    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem("token");
        navigate("/login")
    }

    const getPageTitle = () => {
        const pathParts = location.pathname.split("/").filter(Boolean); // removes empty strings

        if (pathParts.length === 1 && pathParts[0] === "dashboard") {
            return "Dashboard";
        }

        if (pathParts.includes("user")) {
            return "User Profile";
        }

        return pathParts[pathParts.length - 1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="flex items-start lg:gap-4 md:gap-2 gap-0 w-full">
            <Sidebar />

            <div className="lg:w-[calc(100%-288px)] md:w-[calc(100%-224px)] w-[calc(100%-56px)] lg:p-6 p-3">
                <h1 className="mb-8 tracking-tighter font-medium lg:text-4xl text-2xl text-neutral-800">
                    {getPageTitle()}
                </h1>

                <Outlet />
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