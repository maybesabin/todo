import CardContainer from "../container/cardContainer"
import TopTasks from "@/components/topTasks"

const dashboard = () => {
    return (
        <div className="w-full flex flex-col items-start gap-4">
            <CardContainer />
            <TopTasks />
        </div>
    )
}

export default dashboard