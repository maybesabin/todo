import { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, Lock, Mail, Save, Upload, User } from "lucide-react";
import axios from "axios";
import { useGlobalContext } from "@/context/globalContext";
import { Input } from "./ui/input";
import { ring } from "ldrs";
import toast from "react-hot-toast";

const UserProfile = ({ setActive }: { setActive: React.Dispatch<SetStateAction<string>> }) => {

    ring.register();
    const { token, userData, fetchUserData } = useGlobalContext();
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<any>({
        username: userData.username,
        email: userData.email,
        password: "",
    });

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        const formDataToSend = new FormData();
        formDataToSend.append("username", userData.username);
        formDataToSend.append("email", userData.email);
        formDataToSend.append("password", formData.password);

        if (file) {
            formDataToSend.append("profilePic", file);
        } else {
            formDataToSend.append("profilePic", userData.profilePic)
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URI}/api/user/update-profile`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Profile updated successfully!")
            fetchUserData();
            setFile(null);
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    };

    const renderProfileImage = () => {
        // If user has uploaded a new file, show that first
        if (file) {
            return (
                <img
                    className="md:h-40 md:w-40 h-28 w-28 rounded-full object-cover"
                    src={URL.createObjectURL(file)}
                    alt="Profile preview"
                />
            );
        }

        // If user has an existing profile picture, show that
        if (userData.profilePic) {
            return (
                <img
                    className="md:h-40 md:w-40 h-28 w-28 rounded-full object-cover"
                    src={userData.profilePic}
                    alt="Profile"
                />
            );
        }

        // If neither exists, show the default letter avatar
        return (
            <h3
                className="bg-rose-100 md:h-40 md:w-40 h-28 w-28 rounded-full flex items-center justify-center text-rose-500 md:text-4xl text-2xl"
            >
                {userData.username?.charAt(0).toUpperCase()}
            </h3>
        );
    };

    return (
        <div className="w-full md:py-4 py-3 mt-6">
            <Button
                onClick={() => setActive("Tasks")}
                variant={"outline"}
                className="mb-6 flex items-center gap-2"
            >
                <ChevronLeft size={"17px"} />
                <span>Back</span>
            </Button>

            <form
                onSubmit={updateProfile}
                className="md:border rounded-lg md:p-6 flex md:flex-row flex-col md:items-end items-center gap-8"
            >
                <div className="flex flex-col md:items-start items-center gap-4 md:min-w-52">
                    {renderProfileImage()}
                    <label className="text-xs flex items-center border border-neutral-300 gap-2 p-3 rounded-md bg-gradient-to-br cursor-pointer">
                        <Upload size={"15px"} />
                        <span>Change Photo</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </label>
                </div>
                <div className="flex flex-col md:items-start items-center md:gap-4 gap-6 w-full">
                    <div className="flex md:flex-row flex-col md:items-start items-center md:gap-4 gap-6 w-full">
                        <div className="flex flex-col gap-1.5 md:w-1/2 w-full">
                            <label className="md:text-sm text-xs flex items-center gap-2" htmlFor="username">
                                <User size={"15px"} />
                                <span>Username</span>
                            </label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="md:text-sm text-xs border-neutral-200"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 md:w-1/2 w-full">
                            <label className="md:text-sm text-xs flex items-center gap-2" htmlFor="email">
                                <Mail size={"15px"} />
                                <span>Email Address</span>
                            </label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                type="email"
                                className="md:text-sm text-xs border-neutral-200"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 md:w-1/2 w-full">
                        <label className="md:text-sm text-xs flex items-center gap-2" htmlFor="password">
                            <Lock size={"15px"} />
                            <span>Password</span>
                        </label>
                        <Input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="md:text-sm text-xs border-neutral-200"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-xs flex items-center gap-2 p-3 rounded-sm bg-gradient-to-br from-rose-600 to-rose-400 text-white"
                    >
                        {
                            loading ?
                                <div className="w-full flex items-center justify-center gap-2">
                                    {/* @ts-ignore */}
                                    <l-ring
                                        size="16"
                                        stroke="2"
                                        bg-opacity="0"
                                        speed="2"
                                        color="white"
                                    />
                                    <span>Saving changes</span>
                                </div>
                                :
                                <>
                                    <Save size={"17px"} />
                                    <span>Save changes</span>
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;