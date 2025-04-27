import axios from "axios";
import { useEffect, useState } from "react"

const userProfile = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [userData, setUserData] = useState<any | []>([]);

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
        fetchUserDetails()
    }, [])

    return (
        <div className={`absolute -left-12 top-4 bg-white min-w-64`}>
            {!loading ?
                !error &&
                <div className="flex items-center gap-3">
                    <h3 className="bg-[#fef3c7] h-8 w-8 rounded-full flex items-center justify-center text-red-800 md:text-base text-sm">
                        {userData.username?.charAt(0).toUpperCase()}
                    </h3>
                    <div className="flex flex-col items-start">
                        <h4 className="md:text-sm text-xs">{userData.username}</h4>
                        <p className="text-xs text-neutral-600">{userData.email}</p>
                    </div>
                </div>
                :
                <div className="flex items-center gap-3">
                    <h3 className="bg-neutral-200 h-8 w-8 rounded-full animate-pulse"></h3>
                    <div className="flex flex-col items-start">
                        <h4 className="md:text-sm text-xs bg-neutral-200 animate-pulse py-1 w-24 mb-1"></h4>
                        <p className="text-xs text-neutral-600 py-2 bg-neutral-200 w-32 rounded-sm animate-pulse"></p>
                    </div>
                </div>
            }
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}

export default userProfile