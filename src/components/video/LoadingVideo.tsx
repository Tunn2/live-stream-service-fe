import { Loader } from "lucide-react";
import "./LoadingVideo.scss"; // Adjust the path as necessary

interface LoadingVideoProps {
    label: string;
}

export const LoadingVideo = ({ label }: LoadingVideoProps) => {
    return (
        <div className="loadingVideo" style={{ width: "100%", height: "500px", borderBottom: "1px solid white", borderRight: "1px solid white" }}>
            <Loader className="loader" />
            <p className="label">{label}</p>
        </div>
    );
};
