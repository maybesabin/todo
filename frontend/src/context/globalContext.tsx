import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect, SetStateAction } from "react";
import { toast } from "react-hot-toast";

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
    deleteTask: (taskId: string | null) => Promise<void>;
}

// create context
const GlobalContext = createContext<GlobalContextPropsType | undefined>(undefined);

// create provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | false>(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
        }
        else {
            setIsAuthenticated(false);
        }
    }, [token])


    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/task`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Typ': "application/json"
                }
            })
            setTasks(response.data.tasks);
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTask = async (taskId: string | null) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': "application/json"
                }
            })
            toast.success("Task deleted successfully!")
            fetchTasks();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchTasks();
    }, [])


    return (
        <GlobalContext.Provider value={{ tasks, setTasks, fetchTasks, deleteTask, isAuthenticated, setIsAuthenticated }}>
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