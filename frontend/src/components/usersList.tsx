import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Ellipsis } from "lucide-react";
import { ring } from "ldrs";

interface Type {
    username: null | string;
    email: null | string;
    role: null | string;
    tasks: null | any[];
    updatedAt: null | string;
    profilePic: null | string;
}

const usersList = () => {
    ring.register();
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<null | []>([]);
    const [admins, setAdmins] = useState<null | []>([]);

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

    function getLastActive(updatedAt: string | null): string {
        if (!updatedAt) return "Unknown";
        const updatedDate = new Date(updatedAt);
        const now = new Date();
        const diffInMs = now.getTime() - updatedDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${diffInDays} days ago`;
    }

    useEffect(() => { fetchUsers() }, [])

    return (
        <Table className="w-full md:rounded-lg rounded-md border md:p-4 p-3">
            <TableHeader>
                <TableRow className="md:text-base text-sm p-4">
                    <TableHead className="text-neutral-600 w-[400px] p-4">User</TableHead>
                    <TableHead className="text-neutral-600">Role</TableHead>
                    <TableHead className="text-neutral-600">Status</TableHead>
                    <TableHead className="text-neutral-600">Tasks</TableHead>
                    <TableHead className="text-neutral-600">Last Active</TableHead>
                    <TableHead className="text-right text-neutral-600"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    !loading ?
                        <>
                            {admins?.map((admin: Type, idx) => (
                                <TableRow key={idx} className="md:text-sm text-xs">
                                    <TableCell className="p-4 flex items-center gap-2">
                                        {
                                            admin.profilePic ?
                                                <img src={`${import.meta.env.VITE_BACKEND_URI}${admin.profilePic}`}
                                                    className="h-8 w-8 rounded-full object-cover" /> :
                                                <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                                        }
                                        <h4 className="font-medium">
                                            System Admin
                                        </h4>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-black text-white rounded-full px-2.5 py-0.5 capitalize">
                                            {admin.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-green-500 text-white border rounded-full px-2.5 py-0.5">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        Admins do not have tasks
                                    </TableCell>
                                    <TableCell>
                                        {getLastActive(admin.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <Ellipsis size={'17px'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users?.map((user: Type, idx) => (
                                <TableRow key={idx} className="md:text-sm text-xs">
                                    <TableCell className="p-4 flex items-center gap-2">
                                        {
                                            user.profilePic ?
                                                <img src={`${import.meta.env.VITE_BACKEND_URI}${user.profilePic}`} className="h-8 w-8 rounded-full object-cover" /> :
                                                <h3 className="bg-rose-100 cursor-default h-8 w-8 rounded-full flex items-center justify-center text-rose-500 md:text-base text-sm">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </h3>
                                        }
                                        <div className="flex flex-col items-start">
                                            <h4 className="font-medium">
                                                {!user.username ? 'Not available' : user.username}</h4>
                                            <span className="text-neutral-600 text-xs">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="border rounded-full px-2.5 py-0.5 capitalize">
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-green-500 text-white rounded-full px-2.5 py-0.5">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {user.tasks?.length}
                                    </TableCell>
                                    <TableCell>
                                        {getLastActive(user.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <Ellipsis size={'17px'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                        :
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
                }
                {error && <div className="text-red-500 text-xs">{error}</div>}
            </TableBody>
        </Table>
    )
}

export default usersList