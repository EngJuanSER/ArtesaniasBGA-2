import { cn } from '@/lib/utils'

interface IconButtonProps {
    onClick: () => void,
    icon: React.ReactElement
    className?: string
}

const IconButton = (props: IconButtonProps) => {
    const { onClick, icon, className } = props

    return (
        <button onClick={onClick}
            className={cn("rounded-full flex items-center bg-white dark:hover:bg-muted border shadow-md p-2 hover:scale-110 transition border-primary dark:border-muted", className)}>
            {icon}
        </button>
    );
}

export default IconButton;