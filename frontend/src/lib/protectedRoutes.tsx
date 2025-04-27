import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ring } from "ldrs";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    ring.register();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
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
        return <div className="h-screen w-full flex items-center justify-center">
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
        </div>;
    }

    if (role && !allowedRoles.includes(role)) {
        // Redirect admin to dashboard and regular users to home
        const redirectPath = role === "admin" ? "/dashboard" : "/";
        return <Navigate to={redirectPath} replace />;
    }

    // If not authenticated, redirect to login
    if (!role) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;