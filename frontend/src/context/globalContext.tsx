import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Task {
    title: string;
    description: string;
    category: string;
}

interface GlobalContextPropsType {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchTasks: () => Promise<void>;
    deleteTask: (taskId: string | null) => Promise<void>;
}

// create context
const GlobalContext = createContext<GlobalContextPropsType | undefined>(undefined);

// create provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VlZGZiYjNhNDI0ODYxMjJkMTk2ZDUiLCJpYXQiOjE3NDM3MzYyNzIsImV4cCI6MTc0NDM0MTA3MiwiYXVkIjoidG9kbyIsImlzcyI6InRvZG8ifQ.kwOTrt6FzOtL1LyxDpFFBWs4RwDU3Q7m1vR4Y2PhrCs'

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_BACKEND_URI}/api/task`, {
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
            await axios.delete(`http://${import.meta.env.VITE_BACKEND_URI}/api/task/${taskId}`, {
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
        <GlobalContext.Provider value={{ tasks, setTasks, fetchTasks, deleteTask }}>
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