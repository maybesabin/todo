import axios from "axios";
import { BriefcaseBusiness, ListCheck, MessageSquare, Package, Trophy, UserRound, Wallet } from "lucide-react";
import { createContext, useContext, useState, ReactNode, useEffect, SetStateAction } from "react";

interface Task {
    title: string;
    description: string;
    category: string;
}

interface GlobalContextPropsType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchTasks: () => Promise<void>;
    categories: any;
    loading: boolean;
    error: string | null;
    setToken: React.Dispatch<SetStateAction<string | null>>;
    token: string | null;
    userData: any;
    fetchUserData: () => Promise<void>;
}

// create context
const GlobalContext = createContext<GlobalContextPropsType | undefined>(undefined);

// create provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<null | string>(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | false>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [userData, setUserData] = useState<any>([])

    const fetchTasks = async () => {
        if (!token) return;
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/task`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': "application/json"
                }
            })
            setLoading(false)
            setTasks(response.data.tasks);
        } catch (error) {
            console.log(error)
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { title: 'Household Chores', icon: <ListCheck /> },
        { title: 'Work', icon: <BriefcaseBusiness /> },
        { title: 'Personal', icon: <UserRound /> },
        { title: 'Finances', icon: <Wallet /> },
        { title: 'Social', icon: <MessageSquare /> },
        { title: 'Goals', icon: <Trophy /> },
        { title: 'Miscellaneous', icon: <Package /> },
    ];

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUserData(response.data);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        fetchTasks();
        fetchUserData();
    }, [])

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
            fetchTasks();
        }
        else {
            setIsAuthenticated(false);
        }
    }, [token])


    return (
        <GlobalContext.Provider value={{
            tasks,
            setTasks,
            fetchTasks,
            isAuthenticated,
            setIsAuthenticated,
            categories,
            loading,
            error,
            setToken,
            token,
            userData,
            fetchUserData
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

// custom hook
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider.");
    }
    return context;
};