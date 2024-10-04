import { WifiOff } from "lucide-react";
import './OfflineVideo.scss'; // Adjust the path as necessary

interface OfflineVideoProps {
    username: string;
}

export const OfflineVideo = ({
    username,
}: OfflineVideoProps) => {
    return (
        <div className="offlineVideo" style={{ width: "100%", height: "500px", borderBottom: "1px solid white", borderRight: "1px solid white" }}>
            <WifiOff className="icon" />
            <p className="message">
                {username} is offline
            </p>
        </div>
    )
}
