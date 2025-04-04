import { Input } from "@/components/ui/input"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

const login = () => {

    interface User {
        email: string,
        password: string
    }

    const [formData, setFormData] = useState<User>({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const [showPassword, setShowPassword] = useState<boolean | false>(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/login`, formData)
            if (response.status == 200) {
                localStorage.setItem("token", response.data.token)
                toast.success("Logged in successfully!");
                navigate('/');
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="md:w-96 w-full flex flex-col items-start gap-6">
                <h1 className="md:text-3xl text-base font-medium">Welcome back</h1>
                <p className="text-neutral-400 md:text-sm text-xs -mt-5">
                    Welcome back! Please enter your details.
                </p>

                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="email">Email</label>
                    <Input
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        className="w-full py-5 border-neutral-200 md:text-sm text-xs"
                    />
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="password">Password</label>
                    <div className="w-full flex items-center relative">
                        <Input
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            type={`${showPassword ? "text" : "password"}`}
                            className="w-full py-5 border-neutral-200 md:text-sm text-xs"
                        />
                        {showPassword ?
                            <Eye
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2" size={'20px'} />
                            :
                            <EyeClosed
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2" size={'20px'} />
                        }
                    </div>
                </div>

                <button className="w-full text-white bg-[#8155d7] py-2.5 rounded-lg md:text-sm text-xs cursor-pointer hover:bg-purple-700 transition-all">
                    Sign In
                </button>

                <h3 className="md:text-sm text-xs w-full text-center">
                    Don't have an account ?&nbsp;
                    <Link
                        to={'/signup'}
                        className="text-[#8155d7] hover:underline cursor-pointer">
                        Sign up
                    </Link>
                </h3>
            </form>
        </div>
    )
}

export default login