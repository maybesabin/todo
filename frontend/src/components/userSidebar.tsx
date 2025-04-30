import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import { LogOut, Search, Sparkles, X } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ring } from "ldrs";

interface PropsType {
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<SetStateAction<boolean>>;
    showSearchPopup: boolean;
    setShowSearchPopup: React.Dispatch<SetStateAction<boolean>>;
}

const userSidebar = ({ showSidebar, setShowSidebar, showSearchPopup, setShowSearchPopup }: PropsType) => {

    ring.register();
    const { isAuthenticated } = useGlobalContext()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [userData, setUserData] = useState<any | []>([]);

    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setShowSidebar(false);
        }
    };

    useEffect(() => {
        if (showSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSidebar]);

    const fetchUserDetails = async () => {
        setLoading(true)
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUserData(response.data)
            setLoading(true)
        } catch (error: any) {
            console.log(error.message)
            setError("Couldn't fetch user details.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated == true) fetchUserDetails();
    }, [isAuthenticated])

    useEffect(() => {
        if (showSearchPopup == true) setShowSidebar(false);
    }, [showSearchPopup])

    return (
        <div
            ref={sidebarRef}
            className={`${showSidebar ? "visible -translate-x-0 blur-none" : "invisible -translate-x-full blur-sm"} md:hidden flex flex-col items-start justify-between transition-all duration-300 ease-in-out fixed z-999 bg-white h-[100dvh] left-0 w-80 -mt-6`}
        >

            <div className="flex flex-col items-start w-full">

                {/* Profile */}
                {
                    !loading ?
                        <div className="bg-gradient-to-bl from-rose-400 to-rose-600 w-full text-white p-4 pb-6 flex flex-col items-start gap-4">
                            <div className="w-full flex items-center justify-between">
                                <h3 className="text-base font-medium">Profile</h3>
                                <X size={'20px'} onClick={() => setShowSidebar(!showSidebar)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-rose-800 bg-white rounded-full borde border-rose-500 h-14 w-14 flex items-center justify-center">
                                    {userData.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col items-start">
                                    <h2 className="font-medium text-lg">{userData.username}</h2>
                                    <p className="text-xs font-light -mt-1">{userData.email}</p>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            {/* @ts-ignore */}
                            <l-ring
                                size="20"
                                stroke="2"
                                bg-opacity="0"
                                speed="2"
                                color="gray"
                            />
                        </>

                }

                {(error && isAuthenticated && !loading) && <div className="text-xs text-red-500 -mt-2">{error}</div>}

                {/* Search */}
                <div
                    onClick={() => setShowSearchPopup(!showSearchPopup)}
                    className="p-4 w-full"
                >
                    <div className="flex items-center w-full gap-2 border rounded-md p-2">
                        <button type="submit">
                            <Search size={'17px'} />
                        </button>
                        <input
                            readOnly
                            placeholder="Search tasks..."
                            className="cursor-pointer w-full text-sm outline-none border-none"
                            type="text"
                        />
                    </div>
                </div>

                <div className="w-full h-[1px] bg-neutral-200"></div>

                <div
                    onClick={() => setShowSidebar(false)}
                    className="flex items-center gap-2 p-4 font-medium text-sm active:bg-neutral-100 w-full"
                >
                    <Sparkles size={'18px'} className="text-rose-500" />
                    <span>View Tasks</span>
                </div>
            </div>

            {/* Logout */}
            <div
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}
                className="w-full p-4"
            >
                <div className="w-full flex items-center gap-2 font-medium justify-center rounded-lg border py-3 px-4">
                    <LogOut size={'17px'} />
                    <span className="text-sm">Logout</span>
                </div>
            </div>
        </div>
    )
}

export default userSidebar