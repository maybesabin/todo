import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/login"
import Homeapage from "@/pages/homepage"
import Signup from "../pages/signup"

const route = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homeapage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    )
}

export default route