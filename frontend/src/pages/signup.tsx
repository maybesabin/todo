import { Input } from "@/components/ui/input"
import { Eye } from "lucide-react"
import { Link } from "react-router-dom"

const signup = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="md:w-96 w-full flex flex-col items-start gap-6">
                <h1 className="md:text-3xl text-base font-medium">Hey there !</h1>
                <p className="text-neutral-400 md:text-sm text-xs -mt-5">
                    Enter the details below & create your account.
                </p>

                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="username">Username</label>
                    <Input
                        name="username"
                        type="text"
                        className="w-full py-5 border-neutral-200"
                    />
                </div>

                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="email">Email</label>
                    <Input
                        name="email"
                        type="text"
                        className="w-full py-5 border-neutral-200"
                    />
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="md:text-sm text-xs" htmlFor="password">Password</label>
                    <div className="w-full flex items-center relative">
                        <Input
                            name="password"
                            type="text"
                            className="w-full py-5 border-neutral-200"
                        />
                        <Eye className="absolute right-2" size={'20px'} />
                    </div>
                </div>

                <button className="w-full text-white bg-[#8155d7] py-2.5 rounded-lg md:text-sm text-xs cursor-pointer hover:bg-purple-700 transition-all">
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
            </div>
        </div>
    )
}

export default signup