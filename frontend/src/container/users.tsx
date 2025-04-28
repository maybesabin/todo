import { Search } from "lucide-react"
import UserList from "../components/usersList"

const users = () => {
    return (
        <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full flex items-center gap-2 border md:rounded-lg rounded-md md:p-3 p-2">
                <Search color="gray" className="md:size-[20px] size-[15px]" />
                <input
                    placeholder="Search users..."
                    className="md:text-base text-sm w-full border-none outline-none"
                />
            </div>

            <UserList />
        </div>
    )
}

export default users