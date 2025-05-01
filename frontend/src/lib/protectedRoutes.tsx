import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ring } from "ldrs";
import { useGlobalContext } from "@/context/globalContext";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { token } = useGlobalContext()
    ring.register();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token) {
                    setRole(null);
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setRole(response.data.role);
            } catch (error: any) {
                console.log(error.message);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return <div className="h-screen w-full flex items-center gap-4 justify-center">
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
            <span className="text-base text-neutral-600">Loading, please wait</span>
        </div>;
    }

    // If not authenticated, redirect to login
    if (role === null) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!allowedRoles.includes(role)) {
        const redirectPath = role === "admin" ? "/dashboard" : "/";
        return <Navigate to={redirectPath} replace />;
    }

    // If authenticated and has the correct role, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;