import { LayoutGrid, Settings } from "lucide-react"
import clipboard from "../assets/clipboard.png"

const sidebar = () => {

    const sidebarItems = [
        { title: "Dashboard", icon: <LayoutGrid className="lg:size-[22px] size-[17px]" color="gray" /> },
        { title: "Settings", icon: <Settings className="lg:size-[22px] size-[17px]" color="gray" /> }
    ]

    return (
        <div className="flex flex-col items-start gap-8 border border-r-neutral-200 lg:w-72 md:w-56 w-14 min-h-screen lg:p-6 p-3">
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
                {sidebarItems.map((item, idx) => (
                    <li
                        key={idx}
                        className="hover:bg-neutral-100 transition-all cursor-pointer rounded-md md:p-2 p-1 w-full flex items-center gap-2"
                    >
                        {item.icon}
                        <span className="lg:text-base text-sm md:block hidden">{item.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default sidebar