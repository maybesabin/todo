import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/login"
import Homepage from "@/pages/homepage"
import Signup from "../pages/signup"
import Dashboard from "../pages/dashboard"
import ProtectedRoute from "@/lib/protectedRoutes"

const route = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes for regular users */}
                <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route path="/" element={<Homepage />} />
                </Route>

                {/* Protected routes for admins */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default route