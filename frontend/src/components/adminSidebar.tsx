import { LayoutGrid, Settings, Users } from "lucide-react"
import clipboard from "../assets/clipboard.png"
import { useLocation, useNavigate } from "react-router-dom";

const sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const sidebarItems = [
        { title: "Dashboard", icon: <LayoutGrid className="lg:size-[22px] size-[17px]" color="gray" />, href: "" },
        { title: "Users", icon: <Users className="lg:size-[22px] size-[17px]" color="gray" />, href: "users" },
        { title: "Settings", icon: <Settings className="lg:size-[22px] size-[17px]" color="gray" />, href: "settings" }
    ]
    return (
        <div className="flex flex-col items-start gap-8 border border-r-neutral-200 border-t-0 border-b-0 lg:w-72 md:w-56 w-14 min-h-[100svh] lg:p-6 p-3">
            <div className="flex items-center gap-2">
                <img
                    className="lg:size-[40px] size-[25px]"
                    src={clipboard}
                    alt="Clipboard emoji iphone"
                />
                <h2 className="md:block hidden font-semibold lg:text-3xl text-xl tracking-tighter text-neutral-700">
                    Todo App
                </h2>
            </div>

            <ul className="flex flex-col items-start gap-4 w-full">
                {sidebarItems.map((item, idx) => {
                    const targetPath = `/dashboard${item.href ? `/${item.href}` : ""}`;

                    const isDashboard = item.href === "";
                    const isActive = isDashboard
                        ? location.pathname === "/dashboard"
                        : location.pathname.startsWith(targetPath);

                    return (
                        <li
                            key={idx}
                            onClick={() => navigate(targetPath)}
                            className={`${isActive
                                ? "bg-neutral-200/50 hover:bg-neutral-200/50"
                                : "hover:bg-neutral-100"
                                } transition-all cursor-pointer rounded-md px-2 md:py-3 py-1 w-full flex items-center gap-2`}
                        >
                            {item.icon}
                            <span className="lg:text-base text-sm md:block hidden">
                                {item.title}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default sidebar