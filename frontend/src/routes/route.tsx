import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/login"
import Homepage from "@/pages/homepage"
import Signup from "../pages/signup"
import Dashboard from "../pages/dashboard"
import ProtectedRoute from "@/lib/protectedRoutes"
import EditUser from "@/container/editUser"
import UsersList from "../components/usersList"
import Settings from "../container/settings"
import DashboardComponent from "../container/dashboard"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes - accessible to all */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Redirect root to home */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Protected route for regular users */}
                <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route path="/home" element={<Homepage />} />
                </Route>

                {/* Protected route for admins */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<DashboardComponent />} />
                        <Route path="users">
                            <Route index element={<UsersList />} />
                            <Route path="user/:id" element={<EditUser />} />
                        </Route>
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* Catch all - redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter