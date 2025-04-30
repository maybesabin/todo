import { Input } from "@/components/ui/input"
import axios from "axios"
import { Eye, EyeClosed, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

const signup = () => {
    interface User {
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    }

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState<any>(null);

    const [formData, setFormData] = useState<User>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleFileChange = (e: any) => setFile(e.target.files[0])

    const [showPassword, setShowPassword] = useState<boolean | false>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean | false>(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.confirmPassword !== formData.password) {
            return toast.error("Passwords do not match!");
        }

        const { username, email, password } = formData;

        const formDataToSend = new FormData();
        formDataToSend.append("username", username);
        formDataToSend.append("email", email);
        formDataToSend.append("password", password);

        if (file) {
            formDataToSend.append("profilePic", file);
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/api/user/signup`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Successfully created account!");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error("Something went wrong.");
            console.log(error);
        }
    };

    useEffect(() => {
        if (file) {
            setFilePreview(URL.createObjectURL(file))
        }
    }, [file])

    return (
        <div className="w-full h-screen flex items-center justify-center md:py-12 py-6 xl:px-0 px-6">
            <form
                onSubmit={handleSignup}
                className="md:w-96 w-full flex flex-col items-start gap-6">
                <h1 className="md:text-3xl text-base font-medium">Hey there !</h1>
                <p className="text-neutral-400 md:text-sm text-xs -mt-5">
                    Enter the details below & create your account.
                </p>

                <label className="relative flex items-center gap-5 w-full cursor-pointer">
                    <div className="border border-neutral-300 rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center">
                        {file ?
                            <img src={filePreview} className="object-cover h-full w-full rounded-full" /> :
                            <Upload color="gray" />
                        }
                    </div>
                    <p className="text-[#8155d7] text-xs font-medium hover:text-purple-600">
                        Upload profile picture
                    </p>
                    <input
                        onChange={handleFileChange}
                        type="file"
                        className="hidden"
                    />
                </label>

                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="username">Username</label>
                    <Input
                        value={formData.username}
                        onChange={handleChange}
                        name="username"
                        type="text"
                        className="w-full py-5 border-neutral-200 md:text-sm text-xs"
                    />
                </div>

                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="email">Email</label>
                    <Input
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        className="md:text-sm text-xs w-full py-5 border-neutral-200"
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
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="w-full flex items-center relative">
                        <Input
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                            type={`${showConfirmPassword ? "text" : "password"}`}
                            className="w-full py-5 border-neutral-200 md:text-sm text-xs"
                        />
                        {showConfirmPassword ?
                            <Eye
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2" size={'20px'} />
                            :
                            <EyeClosed
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2" size={'20px'} />
                        }
                    </div>
                    {formData.confirmPassword && (
                        <h5
                            className={`text-xs ${formData.confirmPassword === formData.password
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            {formData.confirmPassword === formData.password
                                ? "*Passwords match"
                                : "*Passwords do not match."}
                        </h5>
                    )}

                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-[#8155d7] py-2.5 rounded-lg md:text-sm text-xs cursor-pointer hover:bg-purple-700 transition-all">
                    Create an account
                </button>

                <h3 className="md:text-sm text-xs w-full text-center">
                    Already have an account ?&nbsp;
                    <Link
                        to={'/login'}
                        className="text-[#8155d7] hover:underline cursor-pointer">
                        Log In
                    </Link>
                </h3>
            </form>
        </div>
    )
}

export default signup