interface DashboardCardProps {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    number: number | null | undefined;
    growth: number | null | undefined;
}

const dashboardCard: React.FC<DashboardCardProps> = ({
    title,
    icon: Icon,
    number,
    growth
}) => {
    return (
        <div className="w-full border rounded-md md:p-4 p-3 flex flex-col items-start gap-3">
            <div className="flex items-center justify-between w-full">
                <h5 className="tracking-tight text-neutral-600">{title}</h5>
                <Icon color="#9b87f5" className="md:size-[20px] size-[15px]" />
            </div>
            <h3 className="font-semibold md:text-2xl text-base">{number}</h3>
            <div className="md:text-sm text-xs text-neutral-400 -mt-1">
                {(growth == null || growth == undefined)
                    ?
                    '0'
                    :
                    growth < 0 ? '-' : '+' + `${growth}% from last month`
                }
            </div>
        </div >
    )
}

export default dashboardCard