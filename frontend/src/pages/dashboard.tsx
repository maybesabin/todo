import Sidebar from "../components/sidebar"
import CardContainer from "../container/cardContainer"
import TopTasks from "@/container/topTasks"

const dashboard = () => {
    return (
        <div className="flex items-start gap-4 w-full">
            <Sidebar />
            <div className="lg:w-[calc(100%-288px)] md:w-[calc(100%-224px)] w-[calc(100%-56px)] flex flex-col items-start gap-4 lg:p-6 p-3">
                <h1 className="tracking-tighter font-medium lg:text-4xl text-2xl text-neutral-800">Dashboard</h1>

                <CardContainer />

                <TopTasks />
            </div>
        </div>
    )
}

export default dashboard